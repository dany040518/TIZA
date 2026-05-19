-- Bug reports submitted by users from within the app
create table if not exists public.bug_reports (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete set null,
  title        text not null,
  description  text not null,
  category     text not null check (category in ('ui','funcionalidad','datos','rendimiento','otro')),
  page_url     text,
  user_agent   text,
  created_at   timestamptz not null default now()
);

alter table public.bug_reports enable row level security;

-- Users can only insert and read their own reports
create policy "users insert own reports"
  on public.bug_reports for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users read own reports"
  on public.bug_reports for select
  to authenticated
  using (auth.uid() = user_id);

-- Admins can read all reports
create policy "admins read all reports"
  on public.bug_reports for select
  to authenticated
  using (
    exists (
      select 1 from public.app_users
      where id = auth.uid() and role = 'admin'
    )
  );