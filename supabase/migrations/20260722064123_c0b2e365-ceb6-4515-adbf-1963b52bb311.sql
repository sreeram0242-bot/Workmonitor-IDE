ALTER TABLE public.conversations ALTER COLUMN created_by SET DEFAULT auth.uid();

-- Also allow members to be inserted alongside via a more permissive INSERT check
-- (creator inserting themselves + one other into conversation_members).
-- Ensure conversation_members INSERT policy allows adding others when caller is the creator.
DROP POLICY IF EXISTS "Members insert self" ON public.conversation_members;
DROP POLICY IF EXISTS "Members can be added by creator or self" ON public.conversation_members;
CREATE POLICY "Members can be added by creator or self"
  ON public.conversation_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND c.created_by = auth.uid()
    )
  );