import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

export default function RootRedirect() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--color-orange)' }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (profile?.role === 'admin')       return <Navigate to="/admin"       replace />;
  if (profile?.role === 'coordinator') return <Navigate to="/coordinator" replace />;
  return <Navigate to="/dashboard" replace />;
}