# TIZA

AI-powered lesson planning tool for teachers. Built with React + Vite + Supabase + Gemini.

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| Auth & DB | Supabase (PostgreSQL + Auth) |
| AI | Google Gemini 2.0 Flash |
| PDF Export | html2pdf.js |

## Required Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_GEMINI_API_KEY` | Google AI Studio API key |

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL migration in the Supabase SQL editor:

```bash
# File: supabase/migrations/20260507_init.sql
```

This creates:
- `profiles` table (auto-populated on signup via trigger)
- `lesson_plans` table with Row Level Security
- Auth trigger that creates a profile row on user registration

3. (Optional) Enable Google OAuth in **Authentication → Providers → Google**

## Run Locally

**Prerequisites:** Node.js 18+

```bash
cd app
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Build

```bash
cd app
npm run build      # production build → dist/
npm run lint       # TypeScript type check
```

## Branch

Active development: `feat/claude-implementation`
