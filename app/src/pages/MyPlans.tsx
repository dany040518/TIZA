import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getLessonPlans, deleteLessonPlan, submitLessonPlanForReview } from '@/lib/db';
import type { LessonPlan, PlanStatus } from '@/types';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Loader2, Trash2, FileDown, Send } from 'lucide-react';
import { Star } from '@/components/tiza/Mark';
import html2pdf from 'html2pdf.js';

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

function downloadPlanPDF(plan: LessonPlan) {
  const c = plan.content;
  const el = document.createElement('div');
  el.style.cssText = 'font-family:Arial,sans-serif;padding:32px;color:#000;background:#fff;';
  el.innerHTML = `
    <h1 style="font-size:22px;margin:0 0 4px">${c.title}</h1>
    <p style="color:#666;margin:0 0 16px;font-size:13px">${plan.subject ?? ''} · ${plan.grade ?? ''} · ${plan.topic ?? ''}</p>
    <p style="margin:0 0 8px"><strong>Tipo:</strong> ${c.type}</p>
    <p style="margin:0 0 8px"><strong>Objetivo:</strong> ${c.objective}</p>
    <p style="margin:0 0 8px"><strong>Descripción:</strong> ${c.description}</p>
    <p style="margin:0 0 16px"><strong>Duración:</strong> ${c.duration} min</p>
    <h3 style="font-size:14px;margin:0 0 8px">Materiales</h3>
    <ul style="margin:0 0 16px;padding-left:20px">${c.materials.map((m) => `<li>${m}</li>`).join('')}</ul>
    <h3 style="font-size:14px;margin:0 0 8px">Secuencia</h3>
    ${c.sequence.map((s) => `
      <div style="margin-bottom:10px;padding:10px;border:1px solid #e5e7eb;border-radius:6px">
        <strong>${s.phase}</strong> (${s.duration} min)<br/>${s.description}
      </div>`).join('')}
    <h3 style="font-size:14px;margin:16px 0 8px">Evaluación</h3>
    <p style="margin:0">${c.evaluation}</p>
  `;
  html2pdf().from(el).set({
    margin: 0.5,
    filename: `planeacion-${c.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  }).save();
}

export default function MyPlans() {
  const { user } = useAuth();
  const [plans, setPlans]     = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]       = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getLessonPlans(user.id)
      .then(setPlans)
      .finally(() => setLoading(false));
  }, [user]);

  const handleSubmit = async (planId: string) => {
    if (!planId) return;
    setBusy(planId);
    try {
      const updated = await submitLessonPlanForReview(planId);
      setPlans((prev) => prev.map((p) => (p.id === planId ? updated : p)));
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('¿Eliminar esta planeación?')) return;
    setBusy(planId);
    try {
      await deleteLessonPlan(planId);
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 label mb-2" style={{ color: 'var(--color-mute)' }}>
              <Star size={13} fill="var(--color-orange)" />
              mis planeaciones
            </div>
            <h1 className="font-display m-0" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
              Historial de{' '}
              <span className="serif-em" style={{ color: 'var(--color-orange)' }}>planes</span>
            </h1>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-orange)' }} />
          </div>
        )}

        {!loading && plans.length === 0 && (
          <div
            className="sticker p-10 text-center"
            style={{ background: 'var(--color-paper)' }}
          >
            <div className="font-hand text-[22px] mb-3" style={{ color: 'var(--color-orange)' }}>✿</div>
            <p className="font-semibold text-[16px]">Todavía no tienes planeaciones guardadas.</p>
            <p className="text-[13px] mt-1" style={{ color: 'var(--color-mute)' }}>
              Ve a Planeación, genera ideas y guarda la que más te guste.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="sticker p-6"
              style={{ background: 'var(--color-paper)' }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h2 className="font-bold text-[16px] m-0 truncate">{plan.content.title}</h2>
                    <span
                      className="chip text-[11px] font-bold shrink-0"
                      style={{ background: STATUS_BG[plan.status] }}
                    >
                      {STATUS_LABEL[plan.status]}
                    </span>
                  </div>
                  <div className="text-[13px]" style={{ color: 'var(--color-mute)' }}>
                    {[plan.subject, plan.grade, plan.topic].filter(Boolean).join(' · ')}
                  </div>
                  {plan.coordinator_comment && (
                    <div
                      className="sticker mt-3 p-3 text-[13px]"
                      style={{
                        background: plan.status === 'rejected'
                          ? 'oklch(0.95 0.06 25)'
                          : 'var(--color-mint)',
                        borderColor: plan.status === 'rejected'
                          ? 'oklch(0.55 0.18 25)'
                          : 'var(--color-plum)',
                      }}
                    >
                      <span className="font-semibold">Coordinador: </span>
                      {plan.coordinator_comment}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {plan.status === 'draft_saved' && (
                    <button
                      className="btn-chunky"
                      style={{ padding: '8px 14px', fontSize: 13 }}
                      disabled={busy === plan.id}
                      onClick={() => handleSubmit(plan.id!)}
                    >
                      {busy === plan.id
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Send size={14} />}
                      Enviar a revisión
                    </button>
                  )}

                  {plan.status === 'approved' && (
                    <button
                      className="btn-chunky btn-chunky-blush"
                      style={{ padding: '8px 14px', fontSize: 13 }}
                      onClick={() => downloadPlanPDF(plan)}
                    >
                      <FileDown size={14} />
                      PDF
                    </button>
                  )}

                  <button
                    className="btn-chunky"
                    style={{ padding: '8px 12px', fontSize: 13, opacity: busy === plan.id ? 0.5 : 1 }}
                    disabled={busy === plan.id}
                    onClick={() => handleDelete(plan.id!)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}