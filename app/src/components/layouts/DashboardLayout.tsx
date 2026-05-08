import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Mark } from '@/components/tiza/Mark';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const nav = [
  { num: '01', label: 'Panel', path: '/dashboard' },
  { num: '02', label: 'Planeación', path: '/planning' },
] as const;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { displayName } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const initials = displayName
    ? displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'T';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const pageTitle = nav.find(n => n.path === location.pathname)?.label ?? 'TIZA';

  return (
    <div className="flex h-screen bg-background">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="w-[240px] shrink-0 border-r border-line bg-paper-warm flex flex-col h-screen sticky top-0">

        {/* Logo */}
        <div className="px-6 pt-6 pb-8">
          <Mark to="/dashboard" />
        </div>

        {/* Navigation */}
        <nav className="px-3 flex flex-col gap-px">
          {nav.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-baseline gap-3 px-4 py-2.5 rounded-sm transition-colors',
                  active
                    ? 'bg-paper text-ink'
                    : 'text-mute hover:bg-paper hover:text-ink'
                )}
              >
                <span className="font-mono text-[10px] tracking-[0.14em] text-mute-soft">
                  {item.num}
                </span>
                <span className="text-[14px]">{item.label}</span>
                {active && (
                  <span className="ml-auto heart" aria-hidden />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile + logout */}
        <div className="mt-auto px-6 pb-6 pt-6 border-t border-line-soft">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarFallback className="bg-blush text-ink text-[12px] font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="text-[13px] text-ink truncate">
                {displayName || 'Docente'}
              </div>
              <button
                onClick={handleLogout}
                className="text-[11px] text-mute hover:text-orange transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Context bar */}
        <div className="flex items-center justify-between px-10 py-3 border-b border-line bg-paper-warm/40 shrink-0">
          <div className="eyebrow">{pageTitle}</div>
          <div className="flex items-center gap-2 font-mono text-[10.5px] text-mute">
            <span className="ink-pulse" />
            TIZA
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
