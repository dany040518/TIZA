import { supabase } from './supabaseClient';

export interface ErrorEvent {
  message: string;
  stack?: string;
  context?: string;
  componentStack?: string;
  url?: string;
  timestamp: string;
}

async function persist(event: ErrorEvent) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('bug_reports').insert({
      user_id:     user?.id ?? null,
      title:       event.message.slice(0, 120),
      description: [
        event.context ? `Context: ${event.context}` : '',
        event.stack   ? `Stack:\n${event.stack}`     : '',
        event.componentStack ? `Component:\n${event.componentStack}` : '',
      ].filter(Boolean).join('\n\n') || 'No details',
      category:    'otro',
      page_url:    event.url ?? window.location.pathname,
      user_agent:  navigator.userAgent,
    });
  } catch {
    // Never throw from error logger
  }
}

export function logError(err: Error | unknown, meta: Record<string, string> = {}) {
  const message = err instanceof Error ? err.message : String(err);
  const stack   = err instanceof Error ? err.stack   : undefined;
  const event: ErrorEvent = {
    message,
    stack,
    timestamp: new Date().toISOString(),
    url: window.location.pathname,
    ...meta,
  };
  console.error('[TIZA]', event);
  persist(event);
}

export function initGlobalErrorMonitor() {
  window.addEventListener('error', (e) => {
    logError(e.error ?? new Error(e.message), { context: 'window.onerror' });
  });

  window.addEventListener('unhandledrejection', (e) => {
    const err = e.reason instanceof Error ? e.reason : new Error(String(e.reason));
    logError(err, { context: 'unhandledrejection' });
  });
}