import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './useAuth';
import type { AppUser } from '@/types';

export function useProfile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) setProfile(data as AppUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    fetchProfile(user.id);
  }, [user, authLoading, fetchProfile]);

  const refresh = useCallback(() => {
    if (user) fetchProfile(user.id);
  }, [user, fetchProfile]);

  return { profile, setProfile, refresh, loading: authLoading || loading };
}