-- Phase 1 schema changes

-- 1. Tasks: allow time-of-day on deadlines
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS deadline_at timestamptz;

-- Backfill deadline_at from existing deadline (date) at end-of-day
UPDATE public.tasks
   SET deadline_at = (deadline::timestamp + interval '23 hours 59 minutes')::timestamptz
 WHERE deadline_at IS NULL AND deadline IS NOT NULL;

-- 2. Messages: per-user "delete for me" list
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS deleted_for uuid[] NOT NULL DEFAULT '{}';

-- 3. Conversation members: mute + leave support
ALTER TABLE public.conversation_members
  ADD COLUMN IF NOT EXISTS muted_at timestamptz,
  ADD COLUMN IF NOT EXISTS left_at timestamptz;

-- 4. Group admin flag on conversation_members
ALTER TABLE public.conversation_members
  ADD COLUMN IF NOT EXISTS is_group_admin boolean NOT NULL DEFAULT false;

-- Creator of an existing group becomes group admin (backfill)
UPDATE public.conversation_members cm
   SET is_group_admin = true
  FROM public.conversations c
 WHERE cm.conversation_id = c.id
   AND c.is_group = true
   AND cm.user_id = c.created_by;

-- 5. RPC: change own passcode (verify current, set new)
CREATE OR REPLACE FUNCTION public.change_passcode(_current text, _new text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE v_hash text;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'unauthenticated');
  END IF;
  IF _new !~ '^[0-9]{4}$' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_new');
  END IF;
  SELECT passcode_hash INTO v_hash FROM public.profiles WHERE id = auth.uid();
  IF v_hash IS NULL OR v_hash <> extensions.crypt(_current, v_hash) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'wrong_current');
  END IF;
  UPDATE public.profiles
     SET passcode_hash = extensions.crypt(_new, extensions.gen_salt('bf', 10)),
         pin_attempts = 0,
         pin_locked_until = NULL
   WHERE id = auth.uid();
  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.change_passcode(text, text) TO authenticated;

-- 6. RPC: mark a message deleted-for-me
CREATE OR REPLACE FUNCTION public.hide_message_for_me(_message_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  UPDATE public.messages
     SET deleted_for = ARRAY(SELECT DISTINCT unnest(deleted_for || auth.uid()))
   WHERE id = _message_id
     AND public.is_conversation_member(conversation_id, auth.uid());
END;
$$;

GRANT EXECUTE ON FUNCTION public.hide_message_for_me(uuid) TO authenticated;

-- 7. RPC: leave a group conversation
CREATE OR REPLACE FUNCTION public.leave_conversation(_conv uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  DELETE FROM public.conversation_members
   WHERE conversation_id = _conv AND user_id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.leave_conversation(uuid) TO authenticated;

-- 8. RPC: toggle mute for the current user
CREATE OR REPLACE FUNCTION public.toggle_mute_conversation(_conv uuid, _mute boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  UPDATE public.conversation_members
     SET muted_at = CASE WHEN _mute THEN now() ELSE NULL END
   WHERE conversation_id = _conv AND user_id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_mute_conversation(uuid, boolean) TO authenticated;

-- 9. RPC: admin reset user password (sends recovery email via admin API is not available here;
--     instead we clear the user's passcode and let them use "Forgot password" on auth).
--     For now expose a helper that only admins can call, and lets them clear the target's PIN.
CREATE OR REPLACE FUNCTION public.admin_clear_user_passcode(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  UPDATE public.profiles
     SET passcode_hash = NULL, pin_attempts = 0, pin_locked_until = NULL
   WHERE id = _user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_clear_user_passcode(uuid) TO authenticated;