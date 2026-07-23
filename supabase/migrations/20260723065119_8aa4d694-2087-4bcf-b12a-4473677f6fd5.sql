
-- Switch PIN hashing to bcrypt (pgcrypto). Existing SHA-256 hashes are cleared.
UPDATE public.profiles SET passcode_hash = NULL, pin_attempts = 0, pin_locked_until = NULL WHERE passcode_hash IS NOT NULL;

CREATE OR REPLACE FUNCTION public.set_passcode(_pin text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _pin !~ '^[0-9]{4}$' THEN RAISE EXCEPTION 'Passcode must be exactly 4 digits'; END IF;
  UPDATE public.profiles
     SET passcode_hash = extensions.crypt(_pin, extensions.gen_salt('bf', 10)),
         pin_attempts = 0,
         pin_locked_until = NULL
   WHERE id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_passcode(_pin text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE
  v_hash text; v_locked timestamptz; v_attempts integer; v_ok boolean;
  v_max constant integer := 5; v_lock_seconds constant integer := 60;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'unauthenticated');
  END IF;
  SELECT passcode_hash, pin_locked_until, pin_attempts
    INTO v_hash, v_locked, v_attempts
    FROM public.profiles WHERE id = auth.uid();
  IF v_locked IS NOT NULL AND v_locked > now() THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'locked', 'locked_until', v_locked, 'attempts_left', 0);
  END IF;
  v_ok := v_hash IS NOT NULL AND v_hash = extensions.crypt(_pin, v_hash);
  IF v_ok THEN
    UPDATE public.profiles SET pin_attempts = 0, pin_locked_until = NULL WHERE id = auth.uid();
    RETURN jsonb_build_object('ok', true);
  END IF;
  v_attempts := COALESCE(v_attempts, 0) + 1;
  IF v_attempts >= v_max THEN
    UPDATE public.profiles SET pin_attempts = v_attempts, pin_locked_until = now() + make_interval(secs => v_lock_seconds) WHERE id = auth.uid();
    RETURN jsonb_build_object('ok', false, 'reason', 'locked', 'locked_until', now() + make_interval(secs => v_lock_seconds), 'attempts_left', 0);
  ELSE
    UPDATE public.profiles SET pin_attempts = v_attempts WHERE id = auth.uid();
    RETURN jsonb_build_object('ok', false, 'reason', 'wrong', 'attempts_left', v_max - v_attempts);
  END IF;
END;
$$;
