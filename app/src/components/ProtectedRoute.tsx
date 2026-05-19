import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Loader2 } from 'lucide-react';
import type { AppRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: AppRole | AppRole[];
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--color-orange)' }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role && profile) {
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(profile.role)) {
      return <Navigate to={
        profile.role === 'admin'       ? '/admin' :
        profile.role === 'coordinator' ? '/coordinator' :
        '/dashboard'
      } replace />;
    }
  }

  return <>{children}</>;
}