import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Mark, Star } from '@/components/tiza/Mark';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const teacherTabs = [
  { to: '/dashboard',  label: 'Panel',          emoji: '✿', bg: 'var(--color-blush)'  },
  { to: '/planning',   label: 'Planeación',     emoji: '✎', bg: 'var(--color-butter)' },
  { to: '/my-plans',   label: 'Mis Planes',     emoji: '✦', bg: 'var(--color-mint)'   },
  { to: '/classes',    label: 'Clases',         emoji: '✤', bg: 'var(--color-lilac)'  },
] as const;

const coordinatorTabs = [
  { to: '/coordinator', label: 'Revisión', emoji: '✿', bg: 'var(--color-blush)' },
] as const;

const adminTabs = [
  { to: '/admin', label: 'Instituciones', emoji: '✦', bg: 'var(--color-lilac)' },
] as const;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { displayName } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs =
    profile?.role === 'admin'       ? adminTabs :
    profile?.role === 'coordinator' ? coordinatorTabs :
    teacherTabs;

  const initials = displayName
    ? displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'T';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ color: 'var(--color-plum)' }}>

      {/* ── Top bar ──────────────────────────────────────────── */}
      <header className="mx-auto max-w-[1320px] px-6 md:px-10 pt-7 pb-4 flex flex-wrap items-center justify-between gap-4">

        <Mark to={
          profile?.role === 'admin'       ? '/admin' :
          profile?.role === 'coordinator' ? '/coordinator' :
          '/dashboard'
        } />

        {/* Tab navigation */}
        <nav
          className="sticker flex items-center gap-1.5 p-1.5"
          style={{ boxShadow: '3px 3px 0 var(--color-plum)' }}
        >
          {tabs.map((t) => {
            const active = location.pathname === t.to;
            return (
              <Link
                key={t.to}
                to={t.to}
                className="px-4 py-2 rounded-full no-underline font-semibold text-[14px] flex items-center gap-2 transition-all"
                style={{
                  background: active ? t.bg : 'transparent',
                  color: 'var(--color-plum)',
                }}
              >
                <span aria-hidden style={{ color: 'var(--color-orange)' }}>{t.emoji}</span>
                {t.label}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="flex items-center gap-3">
          <Link
            to="/account"
            className="hidden md:flex items-center gap-3 chip no-underline transition-opacity hover:opacity-80"
            style={{ background: 'var(--color-paper)' }}
          >
            <span
              className="rounded-full font-bold text-[12px] flex items-center justify-center shrink-0"
              style={{
                width: 28, height: 28,
                background: 'var(--color-butter)',
                border: '2px solid var(--color-plum)',
              }}
            >
              {initials}
            </span>
            <div className="leading-tight">
              <div className="font-semibold text-[13px]">{displayName || 'Docente'}</div>
              <div className="text-[11px]" style={{ color: 'var(--color-mute)' }}>Mi cuenta</div>
            </div>
          </Link>

          <button
            className="btn-chunky btn-chunky-blush md:hidden"
            style={{ padding: '10px 16px', fontSize: 13 }}
            onClick={handleLogout}
          >
            <Star size={14} fill="var(--color-orange)" />
            Salir
          </button>
        </div>
      </header>

      <main>
        {children}
      </main>
    </div>
  );
}