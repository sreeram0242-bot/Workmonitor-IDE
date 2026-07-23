
DROP POLICY IF EXISTS "Authenticated create notifications" ON public.notifications;
CREATE POLICY "Admins or self create notifications" ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());
