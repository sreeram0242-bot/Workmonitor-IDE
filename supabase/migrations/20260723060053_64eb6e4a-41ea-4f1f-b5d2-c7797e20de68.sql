
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS pin_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pin_locked_until timestamptz;

DROP FUNCTION IF EXISTS public.verify_passcode(text);

CREATE FUNCTION public.verify_passcode(_pin text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  v_hash text;
  v_locked timestamptz;
  v_attempts integer;
  v_ok boolean;
  v_max constant integer := 5;
  v_lock_seconds constant integer := 60;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'unauthenticated');
  END IF;

  SELECT passcode_hash, pin_locked_until, pin_attempts
    INTO v_hash, v_locked, v_attempts
    FROM public.profiles WHERE id = auth.uid();

  IF v_locked IS NOT NULL AND v_locked > now() THEN
    RETURN jsonb_build_object(
      'ok', false, 'reason', 'locked',
      'locked_until', v_locked,
      'attempts_left', 0
    );
  END IF;

  v_ok := v_hash IS NOT NULL AND v_hash = pg_catalog.encode(
    extensions.digest(auth.uid()::text || ':' || _pin, 'sha256'), 'hex');

  IF v_ok THEN
    UPDATE public.profiles
       SET pin_attempts = 0, pin_locked_until = NULL
     WHERE id = auth.uid();
    RETURN jsonb_build_object('ok', true);
  END IF;

  v_attempts := COALESCE(v_attempts, 0) + 1;
  IF v_attempts >= v_max THEN
    UPDATE public.profiles
       SET pin_attempts = v_attempts,
           pin_locked_until = now() + make_interval(secs => v_lock_seconds)
     WHERE id = auth.uid();
    RETURN jsonb_build_object(
      'ok', false, 'reason', 'locked',
      'locked_until', now() + make_interval(secs => v_lock_seconds),
      'attempts_left', 0
    );
  ELSE
    UPDATE public.profiles
       SET pin_attempts = v_attempts
     WHERE id = auth.uid();
    RETURN jsonb_build_object(
      'ok', false, 'reason', 'wrong',
      'attempts_left', v_max - v_attempts
    );
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_pin_lock_status()
RETURNS jsonb
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT jsonb_build_object(
    'locked_until', pin_locked_until,
    'attempts', COALESCE(pin_attempts, 0)
  )
  FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.clear_passcode()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  UPDATE public.profiles
     SET passcode_hash = NULL,
         pin_attempts = 0,
         pin_locked_until = NULL
   WHERE id = auth.uid();
END;
$$;
