import { useEffect, useState } from 'react';
import { getAllPending } from '@/lib/offlineQueue';

export function useOnlineStatus() {
  const [isOnline, setIsOnline]       = useState(navigator.onLine);
  const [pendingCount, setPending]    = useState(0);

  useEffect(() => {
    const refresh = () => setIsOnline(navigator.onLine);
    window.addEventListener('online',  refresh);
    window.addEventListener('offline', refresh);
    return () => {
      window.removeEventListener('online',  refresh);
      window.removeEventListener('offline', refresh);
    };
  }, []);

  useEffect(() => {
    getAllPending().then((q) => setPending(q.length)).catch(() => {});
    const id = setInterval(() => {
      getAllPending().then((q) => setPending(q.length)).catch(() => {});
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return { isOnline, pendingCount };
}