
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Storage policies for chat-attachments: path prefix is conversation_id
CREATE POLICY "chat attachments read for members"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND public.is_conversation_member((storage.foldername(name))[1]::uuid, auth.uid())
);

CREATE POLICY "chat attachments upload for members"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'chat-attachments'
  AND public.is_conversation_member((storage.foldername(name))[1]::uuid, auth.uid())
  AND owner = auth.uid()
);

CREATE POLICY "chat attachments delete own"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'chat-attachments' AND owner = auth.uid());
