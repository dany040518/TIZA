-- Add per-day schedule column to classes table.
-- Each entry: { day: DayOfWeek, start_time: string, end_time: string }
-- Legacy start_time / end_time columns are kept for backward compatibility.

ALTER TABLE classes
  ADD COLUMN IF NOT EXISTS schedule jsonb;
