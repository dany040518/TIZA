-- B2C upgrade: make institution_id nullable on classes,
-- add personal organizer fields (color, estimated_students, has_special_needs, observations)

ALTER TABLE classes
  ALTER COLUMN institution_id DROP NOT NULL;

ALTER TABLE classes
  ADD COLUMN IF NOT EXISTS color             text,
  ADD COLUMN IF NOT EXISTS estimated_students integer,
  ADD COLUMN IF NOT EXISTS has_special_needs  boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS observations       text;
