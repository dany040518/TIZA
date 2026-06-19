// TODO B2B: reactivar cuando lancemos oferta institucional.
// Mover de vuelta a src/pages/ y restaurar la ruta /coordinator en App.tsx,
// la pestaña en DashboardLayout.tsx y el redirect en RootRedirect.tsx.

import { useEffect, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { getPendingPlans, reviewLessonPlan, getProfile } from '@/lib/db';
import { useToast } from '@/components/Toast';
import type { LessonPlan, PlanStatus, AppUser } from '@/types';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Loader2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Star } from '@/components/tiza/Mark';

const STATUS_LABEL: Record<PlanStatus, string> = {
  draft_saved:    'Borrador',
  pending_review: 'En revisión',
  approved:       'Aprobado',
  rejected:       'Rechazado',
};

const STATUS_BG: Record<PlanStatus, string> = {
  draft_saved:    'var(--color-paper)',
  pending_review: 'var(--color-butter)',
  approved:       'var(--color-mint)',
  rejected:       'var(--color-blush)',
};

type Filter = 'all' | 'pending_review' | 'approved' | 'rejected';

export default function CoordinatorDashboard() {
  const { profile } = useProfile();
  const { error: toastError, success } = useToast();

  const [plans, setPlans]       = useState<LessonPlan[]>([]);
  const [teachers, setTeachers] = useState<Record<string, AppUser>>({});
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<Filter>('pending_review');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [comment, setComment]   = useState('');
  const [busy, setBusy]         = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.institution_id) return;
    getPendingPlans(profile.institution_id)
      .then(async (data) => {
        setPlans(data);
        const uniqueIds = [...new Set(data.map((p) => p.teacher_id))];
        const teacherRecords = await Promise.all(uniqueIds.map((id) => getProfile(id)));
        const map: Record<string, AppUser> = {};
        teacherRecords.forEach((t) => { if (t) map[t.id] = t; });
        setTeachers(map);
      })
      .finally(() => setLoading(false));
  }, [profile]);

  const handleReview = async (planId: string, decision: 'approved' | 'rejected') => {
    if (!profile) return;
    setBusy(planId);
    try {
      const updated = await reviewLessonPlan(planId, profile.id, decision, comment || undefined);
      setPlans((prev) => prev.map((p) => (p.id === planId ? updated : p)));
      setExpanded(null);
      setComment('');
      success(decision === 'approved' ? 'Planeación aprobada.' : 'Planeación rechazada.');
    } catch (err) {
      console.error(err);
      toastError('No se pudo registrar la revisión. Intenta de nuevo.');
    } finally {
      setBusy(null);
    }
  };

  const filteredPlans = filter === 'all'
    ? plans
    : plans.filter((p) => p.status === filter);

  const counts: Record<Filter, number> = {
    all:            plans.length,
    pending_review: plans.filter((p) => p.status === 'pending_review').length,
    approved:       plans.filter((p) => p.status === 'approved').length,
    rejected:       plans.filter((p) => p.status === 'rejected').length,
  };

  const filterLabels: { value: Filter; label: string }[] = [
    { value: 'pending_review', label: 'Por revisar' },
    { value: 'approved',       label: 'Aprobados'   },
    { value: 'rejected',       label: 'Rechazados'  },
    { value: 'all',            label: 'Todos'       },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 label mb-2" style={{ color: 'var(--color-mute)' }}>
            <Star size={13} fill="var(--color-orange)" />
            panel coordinador
          </div>
          <h1 className="font-display m-0" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            Revisión de{' '}
            <span className="serif-em" style={{ color: 'var(--color-orange)' }}>planeaciones</span>
          </h1>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterLabels.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="chip font-semibold text-[13px] transition-all"
              style={{
                background: filter === f.value ? 'var(--color-plum)' : 'var(--color-paper)',
                color: filter === f.value ? 'var(--color-cream)' : 'var(--color-plum)',
              }}
            >
              {f.label}
              {counts[f.value] > 0 && (
                <span
                  className="ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold"
                  style={{
                    background: filter === f.value ? 'oklch(1 0 0 / 0.15)' : 'var(--color-butter)',
                  }}
                >
                  {counts[f.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-orange)' }} />
          </div>
        )}

        {!loading && filteredPlans.length === 0 && (
          <div className="sticker p-10 text-center" style={{ background: 'var(--color-paper)' }}>
            <div className="font-hand text-[22px] mb-3" style={{ color: 'var(--color-orange)' }}>✿</div>
            <p className="font-semibold text-[16px]">
              {filter === 'pending_review'
                ? 'No hay planeaciones pendientes de revisión.'
                : 'No hay planeaciones en esta categoría.'}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {filteredPlans.map((plan) => {
            const teacher = teachers[plan.teacher_id];
            const isOpen = expanded === plan.id;

            return (
              <div
                key={plan.id}
                className="sticker"
                style={{ background: 'var(--color-paper)' }}
              >
                {/* Plan header */}
                <div
                  className="p-5 flex flex-wrap items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : (plan.id ?? null))}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h2 className="font-bold text-[15px] m-0 truncate">{plan.content.title}</h2>
                      <span
                        className="chip text-[11px] font-bold shrink-0"
                        style={{ background: STATUS_BG[plan.status] }}
                      >
                        {STATUS_LABEL[plan.status]}
                      </span>
                    </div>
                    <div className="text-[13px]" style={{ color: 'var(--color-mute)' }}>
                      {teacher ? `${teacher.full_name} · ` : ''}
                      {[plan.subject, plan.grade, plan.topic].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <div style={{ color: 'var(--color-mute)' }}>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Expanded detail + review */}
                {isOpen && (
                  <div
                    className="px-5 pb-5 border-t space-y-4"
                    style={{ borderColor: 'oklch(0.24 0.06 340 / 0.15)' }}
                  >
                    {/* Plan summary */}
                    <div className="pt-4 space-y-2 text-[13px]">
                      <p><strong>Objetivo:</strong> {plan.content.objective}</p>
                      <p><strong>Descripción:</strong> {plan.content.description}</p>
                      <p><strong>Duración:</strong> {plan.content.duration} min</p>
                      <p><strong>Evaluación:</strong> {plan.content.evaluation}</p>
                    </div>

                    {plan.coordinator_comment && (
                      <div
                        className="sticker p-3 text-[13px]"
                        style={{ background: 'var(--color-butter)' }}
                      >
                        <strong>Comentario previo: </strong>{plan.coordinator_comment}
                      </div>
                    )}

                    {/* Review actions — only for pending */}
                    {plan.status === 'pending_review' && (
                      <div className="space-y-3 pt-2">
                        <div>
                          <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>
                            Comentario para el docente (opcional)
                          </div>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Ej: Excelente estructura. Considera ajustar la duración de la apertura."
                            rows={2}
                            className="w-full bg-transparent border rounded-lg p-3 text-[14px] focus:outline-none resize-none"
                            style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)' }}
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            className="btn-chunky"
                            style={{ padding: '10px 18px', fontSize: 13, background: 'var(--color-mint)' }}
                            disabled={busy === plan.id}
                            onClick={() => handleReview(plan.id!, 'approved')}
                          >
                            {busy === plan.id
                              ? <Loader2 size={14} className="animate-spin" />
                              : <Check size={14} />}
                            Aprobar
                          </button>
                          <button
                            className="btn-chunky"
                            style={{ padding: '10px 18px', fontSize: 13, background: 'var(--color-blush)' }}
                            disabled={busy === plan.id}
                            onClick={() => handleReview(plan.id!, 'rejected')}
                          >
                            {busy === plan.id
                              ? <Loader2 size={14} className="animate-spin" />
                              : <X size={14} />}
                            Rechazar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </DashboardLayout>
  );
}