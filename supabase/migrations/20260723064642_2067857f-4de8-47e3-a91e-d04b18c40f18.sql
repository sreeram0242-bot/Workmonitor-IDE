
-- 1. Auth trigger: create profile + role for new signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. GRANTs (missing entirely; app relies on them)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_proofs TO authenticated;
GRANT ALL ON public.task_proofs TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversation_members TO authenticated;
GRANT ALL ON public.conversation_members TO service_role;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- 2. Notifications: allow authenticated users to notify admins about their tasks
DROP POLICY IF EXISTS "Admins or self create notifications" ON public.notifications;
CREATE POLICY "Insert notifications for self, admins, or task admins"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.assigned_by = notifications.user_id AND t.assigned_to = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.assigned_to = notifications.user_id AND t.assigned_by = auth.uid()
    )
  );

-- 3. Tasks: users cannot self-approve
DROP POLICY IF EXISTS "Users update own task status" ON public.tasks;
CREATE POLICY "Users update own task status"
  ON public.tasks FOR UPDATE TO authenticated
  USING (assigned_to = auth.uid())
  WITH CHECK (
    assigned_to = auth.uid()
    AND status IN ('pending','completed')
  );

-- 4. Profiles: prevent employees from changing name/position/badge/passcode fields
CREATE OR REPLACE FUNCTION public.prevent_privileged_profile_changes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;
  IF NEW.full_name IS DISTINCT FROM OLD.full_name
     OR NEW.position IS DISTINCT FROM OLD.position
     OR NEW.badge IS DISTINCT FROM OLD.badge THEN
    RAISE EXCEPTION 'Only admins can change name, position, or badge';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS profiles_guard_privileged ON public.profiles;
CREATE TRIGGER profiles_guard_privileged
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_privileged_profile_changes();

-- 9. Admins manage task proofs
DROP POLICY IF EXISTS "Admins manage proofs" ON public.task_proofs;
CREATE POLICY "Admins manage proofs"
  ON public.task_proofs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 10. user_roles: only self or admins
DROP POLICY IF EXISTS "Authenticated read roles" ON public.user_roles;
CREATE POLICY "Self or admin read roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));
