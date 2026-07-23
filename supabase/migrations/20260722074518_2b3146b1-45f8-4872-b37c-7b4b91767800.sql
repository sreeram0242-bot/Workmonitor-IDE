
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS badge text;

UPDATE public.profiles SET badge = 'Developer' WHERE lower(full_name) LIKE '%sreeram%' OR lower(full_name) LIKE '%sree ram%';
UPDATE public.profiles SET badge = 'Founder'   WHERE lower(full_name) LIKE '%elil%';
UPDATE public.profiles SET badge = 'Content'   WHERE lower(full_name) LIKE '%deva%' OR lower(full_name) LIKE '%mahith%';
