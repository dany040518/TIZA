import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logError } from '@/lib/errorMonitor';

interface Props  { children: ReactNode; fallback?: ReactNode; }
interface State  { hasError: boolean; message: string; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message };
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    logError(err, { context: 'ErrorBoundary', componentStack: info.componentStack ?? '' });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return this.props.fallback ?? (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center"
        style={{ color: 'var(--color-plum)' }}
      >
        <span style={{ fontSize: 48 }}>✦</span>
        <h1 className="font-display text-[28px]">Algo salió mal</h1>
        <p className="text-[14px] max-w-sm" style={{ color: 'var(--color-mute)' }}>
          {this.state.message || 'Error inesperado. El equipo ya fue notificado.'}
        </p>
        <button
          className="btn-chunky btn-chunky-primary"
          style={{ padding: '12px 24px' }}
          onClick={() => window.location.reload()}
        >
          Recargar página
        </button>
      </div>
    );
  }
}