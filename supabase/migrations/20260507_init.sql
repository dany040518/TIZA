-- ============================================================
-- TIZA - Initial Supabase schema
-- Run in Supabase SQL editor or via `supabase db push`
-- ============================================================

-- ── profiles ────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  name        text,
  institution text,
  email       text,
  role        text not null default 'teacher',
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: owner full access"
  on public.profiles for all
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- ── lesson_plans ─────────────────────────────────────────────
create table if not exists public.lesson_plans (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references auth.users on delete cascade,
  subject     text,
  grade       text,
  topic       text,
  title       text,
  type        text,
  objective   text,
  materials   text[],
  sequence    jsonb,
  evaluation  text,
  created_at  timestamptz not null default now()
);

alter table public.lesson_plans enable row level security;

create policy "lesson_plans: owner full access"
  on public.lesson_plans for all
  using  (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

-- ── trigger: auto-create profile on signup ───────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, institution, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'institution', ''),
    new.email,
    'teacher'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
