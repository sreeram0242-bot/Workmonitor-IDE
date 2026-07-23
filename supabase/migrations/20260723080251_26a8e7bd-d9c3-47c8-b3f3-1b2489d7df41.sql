CREATE OR REPLACE FUNCTION public.admin_reset_user_passcode(_target uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can reset passcodes';
  END IF;
  UPDATE public.profiles
     SET passcode_hash = NULL,
         pin_attempts = 0,
         pin_locked_until = NULL
   WHERE id = _target;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_reset_user_passcode(uuid) TO authenticated;