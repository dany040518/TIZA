import { useState } from 'react';
import { X, Bug, Loader2, CheckCircle2 } from 'lucide-react';
import { submitBugReport } from '@/lib/db';
import { useAuth } from '@/hooks/useAuth';
import type { BugCategory } from '@/types';

const CATEGORIES: { value: BugCategory; label: string }[] = [
  { value: 'ui',            label: 'Problema visual / UI'    },
  { value: 'funcionalidad', label: 'Función no funciona'     },
  { value: 'datos',         label: 'Datos incorrectos'       },
  { value: 'rendimiento',   label: 'Lento o se congela'      },
  { value: 'otro',          label: 'Otro'                    },
];

interface Props {
  onClose: () => void;
}

export default function BugReportModal({ onClose }: Props) {
  const { user } = useAuth();
  const [title, setTitle]       = useState('');
  const [description, setDesc]  = useState('');
  const [category, setCategory] = useState<BugCategory>('funcionalidad');
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    setError('');
    try {
      await submitBugReport({
        user_id:    user?.id,
        title:      title.trim(),
        description: description.trim(),
        category,
        page_url:   window.location.pathname,
        user_agent: navigator.userAgent,
      });
      setDone(true);
      setTimeout(onClose, 2000);
    } catch {
      setError('No se pudo enviar el reporte. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'oklch(0.24 0.06 340 / 0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="sticker w-full max-w-md p-6"
        style={{ background: 'var(--color-paper)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Bug size={18} style={{ color: 'var(--color-orange)' }} />
            <span className="font-display text-[18px]">Reportar un problema</span>
          </div>
          <button
            className="btn-chunky btn-chunky-ghost"
            style={{ padding: '6px 10px' }}
            onClick={onClose}
          >
            <X size={15} />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle2 size={40} style={{ color: 'var(--color-mint)' }} />
            <p className="font-semibold text-[15px]">¡Reporte enviado! Gracias.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category */}
            <div>
              <label className="label mb-1.5 block" style={{ color: 'var(--color-mute)' }}>
                Tipo de problema
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className="chip text-[12px]"
                    style={{
                      background: category === c.value ? 'var(--color-blush)' : 'transparent',
                      fontWeight: category === c.value ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="label mb-1.5 block" style={{ color: 'var(--color-mute)' }}>
                Título breve
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="Ej: El botón de guardar no responde"
                required
                className="w-full sticker px-4 py-2.5 text-[14px] font-medium focus:outline-none"
                style={{ boxShadow: '2px 2px 0 var(--color-plum)', borderRadius: 14 }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="label mb-1.5 block" style={{ color: 'var(--color-mute)' }}>
                Descripción detallada
              </label>
              <textarea
                value={description}
                onChange={(e) => setDesc(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="¿Qué hiciste? ¿Qué esperabas que pasara? ¿Qué pasó en cambio?"
                required
                className="w-full sticker px-4 py-2.5 text-[14px] font-medium focus:outline-none resize-none"
                style={{ boxShadow: '2px 2px 0 var(--color-plum)', borderRadius: 14 }}
              />
            </div>

            {error && (
              <p className="text-[13px] font-semibold" style={{ color: 'var(--color-destructive)' }}>
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                className="btn-chunky"
                style={{ padding: '10px 18px', fontSize: 13 }}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-chunky btn-chunky-primary"
                style={{ padding: '10px 18px', fontSize: 13 }}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Bug size={14} />}
                {loading ? 'Enviando…' : 'Enviar reporte'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}