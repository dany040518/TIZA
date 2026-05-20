-- ─────────────────────────────────────────────────────────────────────────────
-- TIZA · 2026-05-20 · Classes & Lesson Plans enhancements
-- Safe / additive only — no destructive changes
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Classes table ─────────────────────────────────────────────────────────

ALTER TABLE classes
  ADD COLUMN IF NOT EXISTS description   text,
  ADD COLUMN IF NOT EXISTS is_archived   boolean    NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS days_of_week  integer[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS start_time    time,
  ADD COLUMN IF NOT EXISTS end_time      time;

-- Index for fast "active classes" queries
CREATE INDEX IF NOT EXISTS classes_teacher_active_idx
  ON classes (teacher_id, is_archived);

-- ── 2. Lesson Plans table ────────────────────────────────────────────────────

ALTER TABLE lesson_plans
  ADD COLUMN IF NOT EXISTS parent_plan_id uuid        REFERENCES lesson_plans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS class_id        uuid        REFERENCES classes(id)       ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS objectives      text,
  ADD COLUMN IF NOT EXISTS methodology     text,
  ADD COLUMN IF NOT EXISTS observations    text;

-- Index for linked plans lookup
CREATE INDEX IF NOT EXISTS lesson_plans_parent_idx
  ON lesson_plans (parent_plan_id) WHERE parent_plan_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS lesson_plans_class_idx
  ON lesson_plans (class_id) WHERE class_id IS NOT NULL;

-- ── 3. Students update function RLS-safe ────────────────────────────────────
-- Students table already has all needed columns; no schema changes required.
-- Existing RLS policies allow teacher to update own students.

-- ─────────────────────────────────────────────────────────────────────────────