CREATE TABLE public.subtasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  title text NOT NULL,
  is_done boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX subtasks_task_id_idx ON public.subtasks(task_id, position);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.subtasks TO authenticated;
GRANT ALL ON public.subtasks TO service_role;

ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage subtasks"
  ON public.subtasks FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Assignee reads subtasks"
  ON public.subtasks FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = subtasks.task_id AND t.assigned_to = auth.uid()));

CREATE POLICY "Assignee updates subtasks"
  ON public.subtasks FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = subtasks.task_id AND t.assigned_to = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = subtasks.task_id AND t.assigned_to = auth.uid()));

CREATE OR REPLACE FUNCTION public.touch_subtasks_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER subtasks_updated_at
  BEFORE UPDATE ON public.subtasks
  FOR EACH ROW EXECUTE FUNCTION public.touch_subtasks_updated_at();

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS recurrence text CHECK (recurrence IN ('none','daily','weekly','monthly')) DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';