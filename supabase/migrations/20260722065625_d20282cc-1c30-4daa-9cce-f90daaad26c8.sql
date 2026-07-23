-- Allow the creator to SELECT their conversation immediately after insert
-- (needed for .insert().select().single() to return the row before members are added)
DROP POLICY IF EXISTS "Members view conversations" ON public.conversations;
CREATE POLICY "Members or creator view conversations"
ON public.conversations
FOR SELECT
USING (
  created_by = auth.uid()
  OR public.is_conversation_member(id, auth.uid())
);