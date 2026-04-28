import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  BarChart2, 
  HelpCircle, 
  LogOut, 
  Search, 
  Bell, 
  Settings,
  Plus
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const initials = user?.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/dashboard' },
    { icon: Calendar, label: 'Planeación', path: '/planning' },
//    { icon: Users, label: 'Asistencia', path: '/attendance' },
//    { icon: BarChart2, label: 'Informes', path: '/reports' },
  ];

  return (
    <div className="flex h-screen bg-background text-text-main font-sans">
      {/* Sidebar */}
      <aside className="w-[240px] bg-surface border-r border-border flex flex-col py-6 shrink-0">
        <div className="logo px-6 pb-8 flex items-center gap-2 text-xl font-bold text-primary">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-sm">T</div>
          TIZA
        </div>
        
        <nav className="flex flex-col">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-item px-6 py-3 flex items-center gap-3 text-sm font-medium transition-all border-l-3 border-transparent",
                location.pathname === item.path 
                  ? "bg-[#eff6ff] text-primary border-primary" 
                  : "text-text-muted hover:bg-slate-50 hover:text-text-main"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-6 space-y-6">
          {/*
          <Button className="w-full bg-primary hover:bg-primary-dark text-white rounded-md py-6 font-semibold flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Nueva Clase
          </Button>
          */}

          <div className="space-y-1">
            {/*
            <button className="flex items-center gap-3 px-0 py-2 w-full text-text-muted hover:text-text-main text-sm font-medium transition-colors">
              <HelpCircle className="w-5 h-5" />
              Ayuda
            </button>
            */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-0 py-2 w-full text-text-muted hover:text-text-main text-sm font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden p-8 gap-6">
        {/* Topbar */}
        <header className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-text-main">
              {location.pathname === '/dashboard' ? 'Panel de Control' : 'Laboratorio de Planeación'}
            </h1>
            <p className="text-text-muted text-sm">Preparación de clases impulsada por IA</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input 
                placeholder="Buscar..." 
                className="pl-10 bg-surface border-border rounded-md h-10 text-sm"
              />
            </div>

            <div className="user-profile flex items-center gap-3 pl-6 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-semibold text-text-main">{user?.displayName || 'Usuario'}</p>
                <p className="text-xs text-text-muted">Docente</p>
              </div>
              <Avatar className="w-10 h-10 bg-primary text-white flex items-center justify-center font-semibold rounded-full">
                <AvatarFallback className="bg-primary text-white">{initials}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
