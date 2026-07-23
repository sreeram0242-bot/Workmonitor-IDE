REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (avatar_url) ON public.profiles TO authenticated;