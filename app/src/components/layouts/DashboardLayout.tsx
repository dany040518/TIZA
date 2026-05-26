import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Mark } from '@/components/tiza/Mark';
import BugReportModal from '@/components/BugReportModal';
import { Bug, LogOut, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const teacherTabs = [
  { to: '/dashboard', label: 'Panel',      emoji: '✿', bg: 'var(--color-blush)'  },
  { to: '/planning',  label: 'Planeación', emoji: '✎', bg: 'var(--color-butter)' },
  { to: '/my-plans',  label: 'Mis Planes', emoji: '✦', bg: 'var(--color-mint)'   },
  { to: '/classes',   label: 'Clases',     emoji: '✤', bg: 'var(--color-lilac)'  },
  { to: '/weekly',    label: 'Semana',     emoji: '◷', bg: 'var(--color-sky)'    },
] as const;

const coordinatorTabs = [
  { to: '/coordinator', label: 'Revisión', emoji: '✿', bg: 'var(--color-blush)' },
] as const;

const adminTabs = [
  { to: '/admin', label: 'Instituciones', emoji: '✦', bg: 'var(--color-lilac)' },
] as const;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, displayName } = useAuth();
  const { profile } = useProfile();

  // Prefiere el nombre guardado en la DB (app_users.full_name) sobre el
  // metadata de auth, para reflejar actualizaciones del perfil en tiempo real.
  const headerName = profile?.full_name || displayName || user?.email || 'Docente';
  const location = useLocation();
  const navigate = useNavigate();
  const [bugOpen, setBugOpen] = useState(false);
  const { isOnline, pendingCount } = useOnlineStatus();

  const tabs =
    profile?.role === 'admin'       ? adminTabs :
    profile?.role === 'coordinator' ? coordinatorTabs :
    teacherTabs;

  const initials = headerName
    ? headerName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'T';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ color: 'var(--color-plum)' }}>

      {/* ── Top bar ──────────────────────────────────────────── */}
      <header className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-10 pt-5 pb-3 flex items-center justify-between gap-3">

        <Mark to={
          profile?.role === 'admin'       ? '/admin' :
          profile?.role === 'coordinator' ? '/coordinator' :
          '/dashboard'
        } />

        {/* Tab navigation — hidden on mobile (bottom bar takes over) */}
        <nav
          className="hidden sm:flex items-center gap-1 p-1.5 sticker"
          style={{ boxShadow: '3px 3px 0 var(--color-plum)' }}
        >
          {tabs.map((t) => {
            const active = location.pathname === t.to;
            return (
              <Link
                key={t.to}
                to={t.to}
                className="px-3 py-2 rounded-full no-underline font-semibold text-[13px] flex items-center gap-1.5 transition-all whitespace-nowrap"
                style={{
                  background: active ? t.bg : 'transparent',
                  color: 'var(--color-plum)',
                }}
              >
                <span aria-hidden style={{ color: 'var(--color-orange)' }}>{t.emoji}</span>
                <span className="hidden md:inline">{t.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Account chip — desktop only */}
          <Link
            to="/account"
            className="hidden md:flex items-center gap-2 chip no-underline transition-opacity hover:opacity-80"
            style={{ background: 'var(--color-paper)' }}
          >
            <span
              className="rounded-full font-bold text-[11px] flex items-center justify-center shrink-0"
              style={{ width: 26, height: 26, background: 'var(--color-butter)', border: '2px solid var(--color-plum)' }}
            >
              {initials}
            </span>
            <div className="leading-tight">
              <div className="font-semibold text-[12px]">{headerName}</div>
              <div className="text-[10px]" style={{ color: 'var(--color-mute)' }}>Mi cuenta</div>
            </div>
          </Link>

          {/* Account avatar — mobile */}
          <Link
            to="/account"
            className="md:hidden rounded-full font-bold text-[12px] flex items-center justify-center"
            style={{ width: 34, height: 34, background: 'var(--color-butter)', border: '2px solid var(--color-plum)' }}
            title="Mi cuenta"
          >
            {initials}
          </Link>

          {/* Bug report */}
          <button
            className="btn-chunky"
            style={{ padding: '7px 12px', fontSize: 12 }}
            onClick={() => setBugOpen(true)}
            title="Reportar un problema"
          >
            <Bug size={13} style={{ color: 'var(--color-orange)' }} />
            <span className="hidden lg:inline">Reportar</span>
          </button>

          {/* Logout — desktop only */}
          <button
            className="hidden md:inline-flex btn-chunky btn-chunky-ghost"
            style={{ padding: '7px 12px', fontSize: 12 }}
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <LogOut size={13} />
          </button>
        </div>
      </header>

      {/* ── Offline banner ───────────────────────────────────── */}
      {!isOnline && (
        <div
          className="flex items-center justify-center gap-2 py-2 text-[12px] font-semibold"
          style={{ background: 'var(--color-butter)', borderBottom: '2px solid var(--color-plum)' }}
        >
          <WifiOff size={13} />
          Sin conexión — los cambios se sincronizarán automáticamente al reconectar
          {pendingCount > 0 && <span className="chip" style={{ fontSize: 11, padding: '2px 8px' }}>{pendingCount} pendientes</span>}
        </div>
      )}
      {isOnline && pendingCount > 0 && (
        <div
          className="flex items-center justify-center gap-2 py-2 text-[12px] font-semibold"
          style={{ background: 'var(--color-mint)', borderBottom: '2px solid var(--color-plum)' }}
        >
          Sincronizando {pendingCount} acción{pendingCount > 1 ? 'es' : ''} offline…
        </div>
      )}

      <main>
        {children}
      </main>

      {/* ── Bottom nav bar — mobile only ─────────────────────── */}
      <nav
        className="sm:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch"
        style={{
          background: 'var(--color-paper)',
          borderTop: '2px solid var(--color-plum)',
          boxShadow: '0 -3px 0 var(--color-plum)',
        }}
      >
        {tabs.map((t) => {
          const active = location.pathname === t.to;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 no-underline transition-all"
              style={{
                background: active ? t.bg : 'transparent',
                color: 'var(--color-plum)',
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{t.emoji}</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.03em' }}>{t.label}</span>
            </Link>
          );
        })}
        <button
          className="flex-none flex flex-col items-center justify-center gap-0.5 py-2.5 px-4"
          style={{ background: 'transparent', border: 'none', color: 'var(--color-plum)', cursor: 'pointer' }}
          onClick={handleLogout}
          title="Salir"
        >
          <LogOut size={18} />
          <span style={{ fontSize: 10, fontWeight: 700 }}>Salir</span>
        </button>
      </nav>

      {/* Bottom nav spacer on mobile */}
      <div className="sm:hidden h-16" aria-hidden />

      {bugOpen && <BugReportModal onClose={() => setBugOpen(false)} />}
    </div>
  );
}