CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS passcode_hash text;

REVOKE SELECT ON public.profiles FROM authenticated;
GRANT SELECT (id, full_name, position, avatar_url, badge, created_at) ON public.profiles TO authenticated;

REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (avatar_url) ON public.profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.has_passcode()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT COALESCE((SELECT passcode_hash IS NOT NULL FROM public.profiles WHERE id = auth.uid()), false);
$$;

CREATE OR REPLACE FUNCTION public.set_passcode(_pin text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _pin !~ '^[0-9]{4}$' THEN RAISE EXCEPTION 'Passcode must be exactly 4 digits'; END IF;
  UPDATE public.profiles
     SET passcode_hash = pg_catalog.encode(extensions.digest(auth.uid()::text || ':' || _pin, 'sha256'), 'hex')
   WHERE id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_passcode(_pin text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT COALESCE(
    (SELECT passcode_hash = pg_catalog.encode(extensions.digest(auth.uid()::text || ':' || _pin, 'sha256'), 'hex')
       FROM public.profiles WHERE id = auth.uid()),
    false);
$$;

REVOKE ALL ON FUNCTION public.has_passcode() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.set_passcode(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.verify_passcode(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_passcode() TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_passcode(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_passcode(text) TO authenticated;