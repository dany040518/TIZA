import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/components/Toast';
import {
  getLessonPlans, updateLessonPlan, duplicateLessonPlan,
  deleteLessonPlan, submitLessonPlanForReview, getLinkedPlans,
  getClasses,
} from '@/lib/db';
import type { LessonPlan, PlanStatus, Class, PlanIdea } from '@/types';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  Loader2, Trash2, FileDown, Send, Pencil, Copy, Search,
  X, ChevronDown, ChevronUp, Link2, Check, BookOpen,
} from 'lucide-react';
import { Star } from '@/components/tiza/Mark';
import html2pdf from 'html2pdf.js';

// ── Constants ─────────────────────────────────────────────────────────────────

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

const ALL_STATUSES: PlanStatus[] = ['draft_saved', 'pending_review', 'approved', 'rejected'];

// ── PDF export ────────────────────────────────────────────────────────────────

function downloadPlanPDF(plan: LessonPlan) {
  const c = plan.content;
  const el = document.createElement('div');
  el.style.cssText = 'font-family:Arial,sans-serif;padding:32px;color:#000;background:#fff;';
  el.innerHTML = `
    <h1 style="font-size:22px;margin:0 0 4px">${c.title}</h1>
    <p style="color:#666;margin:0 0 16px;font-size:13px">${[plan.subject, plan.grade, plan.topic].filter(Boolean).join(' · ')}</p>
    ${plan.objectives ? `<p style="margin:0 0 8px"><strong>Objetivos:</strong> ${plan.objectives}</p>` : ''}
    <p style="margin:0 0 8px"><strong>Objetivo principal:</strong> ${c.objective}</p>
    <p style="margin:0 0 8px"><strong>Descripción:</strong> ${c.description}</p>
    <p style="margin:0 0 16px"><strong>Duración:</strong> ${c.duration} min</p>
    ${plan.methodology ? `<p style="margin:0 0 8px"><strong>Metodología:</strong> ${plan.methodology}</p>` : ''}
    <h3 style="font-size:14px;margin:0 0 8px">Materiales</h3>
    <ul style="margin:0 0 16px;padding-left:20px">${c.materials.map((m) => `<li>${m}</li>`).join('')}</ul>
    <h3 style="font-size:14px;margin:0 0 8px">Secuencia</h3>
    ${c.sequence.map((s) => `<div style="margin-bottom:10px;padding:10px;border:1px solid #e5e7eb;border-radius:6px"><strong>${s.phase}</strong> (${s.duration} min)<br/>${s.description}</div>`).join('')}
    <h3 style="font-size:14px;margin:16px 0 8px">Evaluación</h3>
    <p style="margin:0 0 16px">${c.evaluation}</p>
    ${plan.observations ? `<p style="margin:0"><strong>Observaciones:</strong> ${plan.observations}</p>` : ''}
  `;
  html2pdf().from(el).set({
    margin: 0.5,
    filename: `planeacion-${c.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  }).save();
}

// ── Edit modal ────────────────────────────────────────────────────────────────

interface EditPlanForm {
  title: string;
  subject: string;
  grade: string;
  topic: string;
  objectives: string;
  methodology: string;
  observations: string;
  content: PlanIdea;
}

function EditPlanModal({
  plan,
  onSave,
  onClose,
  saving,
}: {
  plan: LessonPlan;
  onSave: (form: EditPlanForm) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<EditPlanForm>({
    title:        plan.title,
    subject:      plan.subject ?? '',
    grade:        plan.grade ?? '',
    topic:        plan.topic ?? '',
    objectives:   plan.objectives ?? '',
    methodology:  plan.methodology ?? '',
    observations: plan.observations ?? '',
    content: { ...plan.content },
  });

  const inp = 'w-full bg-transparent border-0 border-b py-2 text-[14px] focus:outline-none';
  const bc  = { borderColor: 'oklch(0.24 0.06 340 / 0.3)' };
  const ta  = 'w-full bg-transparent border rounded-xl p-3 text-[13px] resize-none focus:outline-none';
  const tac = { borderColor: 'oklch(0.24 0.06 340 / 0.2)' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'oklch(0.24 0.06 340 / 0.45)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="sticker w-full max-w-[700px] max-h-[92vh] overflow-y-auto p-7 space-y-5"
        style={{ background: 'var(--color-paper)' }}
      >
        <div className="flex items-center justify-between">
          <div className="font-bold text-[17px]">Editar planeación</div>
          <button type="button" onClick={onClose} className="btn-chunky" style={{ padding: '6px 10px', fontSize: 13 }}>✕</button>
        </div>

        <form onSubmit={async (e) => { e.preventDefault(); await onSave(form); }} className="space-y-5">

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Título *</div>
              <input required value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className={inp} style={{ ...bc, fontSize: 16, fontWeight: 700 }} />
            </div>
            <div>
              <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Materia</div>
              <input value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="Matemáticas" className={inp} style={bc} />
            </div>
            <div>
              <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Grado</div>
              <input value={form.grade}
                onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
                placeholder="Secundaria" className={inp} style={bc} />
            </div>
            <div className="sm:col-span-2">
              <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Tema</div>
              <input value={form.topic}
                onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                placeholder="Fracciones" className={inp} style={bc} />
            </div>
          </div>

          {/* Content fields */}
          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Objetivo principal</div>
            <textarea rows={2} value={form.content.objective}
              onChange={(e) => setForm((f) => ({ ...f, content: { ...f.content, objective: e.target.value } }))}
              className={ta} style={tac} />
          </div>
          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Objetivos específicos</div>
            <textarea rows={3} value={form.objectives}
              onChange={(e) => setForm((f) => ({ ...f, objectives: e.target.value }))}
              placeholder="Lista los objetivos específicos de aprendizaje…"
              className={ta} style={tac} />
          </div>
          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Descripción / Contenidos</div>
            <textarea rows={3} value={form.content.description}
              onChange={(e) => setForm((f) => ({ ...f, content: { ...f.content, description: e.target.value } }))}
              className={ta} style={tac} />
          </div>
          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Metodología</div>
            <textarea rows={3} value={form.methodology}
              onChange={(e) => setForm((f) => ({ ...f, methodology: e.target.value }))}
              placeholder="Describe el enfoque pedagógico, estrategias y recursos principales…"
              className={ta} style={tac} />
          </div>
          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Evaluación</div>
            <textarea rows={2} value={form.content.evaluation}
              onChange={(e) => setForm((f) => ({ ...f, content: { ...f.content, evaluation: e.target.value } }))}
              className={ta} style={tac} />
          </div>
          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Observaciones</div>
            <textarea rows={2} value={form.observations}
              onChange={(e) => setForm((f) => ({ ...f, observations: e.target.value }))}
              placeholder="Notas adicionales, ajustes para grupos específicos…"
              className={ta} style={tac} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-chunky btn-chunky-primary flex-1 justify-center" style={{ padding: '12px 16px', fontSize: 14 }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Guardar cambios
            </button>
            <button type="button" className="btn-chunky" style={{ padding: '12px 16px', fontSize: 14 }} onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Associate to class modal ──────────────────────────────────────────────────

function LinkToClassModal({
  plan,
  classes,
  linkedPlans,
  onLink,
  onClose,
  linking,
}: {
  plan: LessonPlan;
  classes: Class[];
  linkedPlans: LessonPlan[];
  onLink: (classId: string) => Promise<void>;
  onClose: () => void;
  linking: boolean;
}) {
  const linkedClassIds = new Set(linkedPlans.map((lp) => lp.class_id).filter(Boolean));
  const available = classes.filter((c) => !c.is_archived && !linkedClassIds.has(c.id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'oklch(0.24 0.06 340 / 0.45)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sticker w-full max-w-[480px] p-7 space-y-5" style={{ background: 'var(--color-paper)' }}>
        <div className="flex items-center justify-between">
          <div className="font-bold text-[16px]">Vincular a clase</div>
          <button type="button" onClick={onClose} className="btn-chunky" style={{ padding: '6px 10px', fontSize: 13 }}>✕</button>
        </div>

        <p className="text-[13px]" style={{ color: 'var(--color-mute)', lineHeight: 1.5 }}>
          Se creará una copia de <strong>"{plan.title}"</strong> vinculada a la clase seleccionada.
          Las clases ya vinculadas no aparecen.
        </p>

        {linkedPlans.length > 0 && (
          <div className="sticker p-3" style={{ background: 'var(--color-butter)' }}>
            <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Ya vinculada a:</div>
            <div className="space-y-1">
              {linkedPlans.map((lp) => {
                const cls = classes.find((c) => c.id === lp.class_id);
                return (
                  <div key={lp.id} className="text-[13px] font-semibold">
                    · {cls?.name ?? 'Clase desconocida'}
                    <span className="chip ml-2 text-[10px]" style={{ background: STATUS_BG[lp.status] }}>
                      {STATUS_LABEL[lp.status]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {available.length === 0 ? (
          <div className="text-center py-6 text-[14px]" style={{ color: 'var(--color-mute)' }}>
            Todas tus clases ya tienen esta planeación vinculada.
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {available.map((cls) => (
              <button
                key={cls.id}
                disabled={linking}
                onClick={() => onLink(cls.id)}
                className="sticker w-full text-left p-4 transition-all sticker-hover"
                style={{ background: 'var(--color-cream)' }}
              >
                <div className="font-bold text-[14px]">{cls.name}</div>
                <div className="text-[12px]" style={{ color: 'var(--color-mute)' }}>
                  {cls.subject} · {cls.grade_level}
                </div>
                {linking && <Loader2 size={12} className="animate-spin mt-1" />}
              </button>
            ))}
          </div>
        )}

        <button type="button" className="btn-chunky w-full justify-center" style={{ padding: '11px', fontSize: 13 }} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

// ── Plan card ─────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  classes,
  onEdit,
  onDuplicate,
  onDelete,
  onSubmit,
  onLink,
  busy,
}: {
  plan: LessonPlan;
  classes: Class[];
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSubmit: () => void;
  onLink: () => void;
  busy: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const linkedClass = plan.class_id ? classes.find((c) => c.id === plan.class_id) : null;

  return (
    <div className="sticker" style={{ background: 'var(--color-paper)' }}>
      {/* Header row */}
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-bold text-[15px] m-0 truncate">{plan.content.title}</h2>
              <span className="chip text-[11px] font-bold shrink-0" style={{ background: STATUS_BG[plan.status] }}>
                {STATUS_LABEL[plan.status]}
              </span>
              {plan.parent_plan_id && (
                <span className="chip text-[10px]" style={{ background: 'var(--color-sky)' }}>
                  <Link2 size={10} /> Vinculada
                </span>
              )}
              {linkedClass && (
                <span className="chip text-[10px]" style={{ background: 'var(--color-lilac)' }}>
                  <BookOpen size={10} /> {linkedClass.name}
                </span>
              )}
            </div>
            <div className="text-[12px]" style={{ color: 'var(--color-mute)' }}>
              {[plan.subject, plan.grade, plan.topic].filter(Boolean).join(' · ')}
            </div>
            {plan.coordinator_comment && (
              <div className="sticker mt-2 p-2.5 text-[12px]"
                style={{
                  background: plan.status === 'rejected' ? 'oklch(0.95 0.06 25)' : 'var(--color-mint)',
                  borderColor: plan.status === 'rejected' ? 'oklch(0.55 0.18 25)' : 'var(--color-plum)',
                }}>
                <span className="font-semibold">Coordinador: </span>{plan.coordinator_comment}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            {(plan.status === 'draft_saved' || plan.status === 'rejected') && (
              <button className="btn-chunky" style={{ padding: '6px 11px', fontSize: 12 }}
                disabled={busy} onClick={onSubmit} title={plan.status === 'rejected' ? 'Re-enviar a revisión' : 'Enviar a revisión'}>
                {busy ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                <span className="hidden sm:inline">{plan.status === 'rejected' ? 'Re-enviar' : 'Enviar'}</span>
              </button>
            )}
            {plan.status === 'approved' && (
              <button className="btn-chunky" style={{ padding: '6px 11px', fontSize: 12 }}
                onClick={() => downloadPlanPDF(plan)} title="Descargar PDF">
                <FileDown size={12} />
              </button>
            )}
            <button className="btn-chunky" style={{ padding: '6px 11px', fontSize: 12 }}
              onClick={onEdit} title="Editar">
              <Pencil size={12} />
            </button>
            {/* Link only available for master plans that are approved */}
            {!plan.parent_plan_id && plan.status === 'approved' && (
              <button className="btn-chunky" style={{ padding: '6px 11px', fontSize: 12 }}
                onClick={onLink} title="Vincular a clase">
                <Link2 size={12} />
              </button>
            )}
            <button className="btn-chunky" style={{ padding: '6px 11px', fontSize: 12 }}
              onClick={onDuplicate} disabled={busy} title="Duplicar">
              <Copy size={12} />
            </button>
            <button className="btn-chunky" style={{ padding: '6px 11px', fontSize: 12, opacity: busy ? 0.5 : 1 }}
              disabled={busy} onClick={onDelete} title="Eliminar">
              <Trash2 size={12} />
            </button>
            <button className="btn-chunky" style={{ padding: '6px 9px', fontSize: 12 }}
              onClick={() => setExpanded((v) => !v)} title="Ver detalle">
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>

        {/* Expanded detail */}
        {expanded && (
          <div className="mt-4 pt-4 space-y-3" style={{ borderTop: '1px solid oklch(0.24 0.06 340 / 0.12)' }}>
            {plan.objectives && (
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Objetivos</div>
                <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--color-plum)' }}>{plan.objectives}</p>
              </div>
            )}
            <div>
              <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Descripción</div>
              <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--color-plum)' }}>{plan.content.description}</p>
            </div>
            {plan.methodology && (
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Metodología</div>
                <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--color-plum)' }}>{plan.methodology}</p>
              </div>
            )}
            {plan.content.materials?.length > 0 && (
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Materiales</div>
                <div className="flex flex-wrap gap-1.5">
                  {plan.content.materials.map((m, i) => (
                    <span key={i} className="chip text-[11px]" style={{ background: 'var(--color-sky)' }}>{m}</span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Evaluación</div>
              <p className="text-[13px] font-medium italic leading-relaxed" style={{ color: 'var(--color-plum)' }}>"{plan.content.evaluation}"</p>
            </div>
            {plan.observations && (
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Observaciones</div>
                <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--color-mute)' }}>{plan.observations}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MyPlans() {
  const { user }    = useAuth();
  const { profile } = useProfile();
  const { success, error: toastError } = useToast();

  const [plans, setPlans]       = useState<LessonPlan[]>([]);
  const [classes, setClasses]   = useState<Class[]>([]);
  const [loading, setLoading]   = useState(true);
  const [busy, setBusy]         = useState<string | null>(null);

  // Search + filter
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState<PlanStatus | 'all'>('all');

  // Modals
  const [editTarget, setEditTarget]     = useState<LessonPlan | null>(null);
  const [editSaving, setEditSaving]     = useState(false);
  const [linkTarget, setLinkTarget]     = useState<LessonPlan | null>(null);
  const [linkPlans, setLinkPlans]       = useState<LessonPlan[]>([]);
  const [linking, setLinking]           = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getLessonPlans(user.id),
      getClasses(user.id, false),
    ]).then(([p, c]) => {
      setPlans(p);
      setClasses(c);
    }).finally(() => setLoading(false));
  }, [user]);

  // ── Filtered plans ─────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return plans.filter((p) => {
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchSearch = !q ||
        p.content.title.toLowerCase().includes(q) ||
        (p.subject ?? '').toLowerCase().includes(q) ||
        (p.grade ?? '').toLowerCase().includes(q) ||
        (p.topic ?? '').toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [plans, search, filterStatus]);

  // ── Actions ────────────────────────────────────────────────

  const handleSubmit = async (planId: string) => {
    setBusy(planId);
    try {
      const updated = await submitLessonPlanForReview(planId);
      setPlans((prev) => prev.map((p) => (p.id === planId ? updated : p)));
      success('Planeación enviada a revisión');
    } catch { toastError('Error al enviar la planeación.'); }
    finally { setBusy(null); }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('¿Eliminar esta planeación?')) return;
    setBusy(planId);
    try {
      await deleteLessonPlan(planId);
      setPlans((prev) => prev.filter((p) => p.id !== planId));
      success('Planeación eliminada');
    } catch { toastError('Error al eliminar.'); }
    finally { setBusy(null); }
  };

  const handleDuplicate = async (plan: LessonPlan) => {
    setBusy(plan.id!);
    try {
      const copy = await duplicateLessonPlan(plan);
      setPlans((prev) => [copy, ...prev]);
      success('Planeación duplicada');
    } catch { toastError('Error al duplicar.'); }
    finally { setBusy(null); }
  };

  const handleEditSave = async (form: EditPlanForm) => {
    if (!editTarget) return;
    setEditSaving(true);
    try {
      const updated = await updateLessonPlan(editTarget.id!, {
        title:        form.title,
        subject:      form.subject || undefined,
        grade:        form.grade || undefined,
        topic:        form.topic || undefined,
        objectives:   form.objectives || undefined,
        methodology:  form.methodology || undefined,
        observations: form.observations || undefined,
        content:      form.content,
      });
      setPlans((prev) => prev.map((p) => (p.id === editTarget.id ? updated : p)));
      setEditTarget(null);
      success('Planeación actualizada');
    } catch { toastError('Error al guardar los cambios.'); }
    finally { setEditSaving(false); }
  };

  const openLink = async (plan: LessonPlan) => {
    setLinkTarget(plan);
    setLinkPlans([]);
    if (plan.id) {
      const linked = await getLinkedPlans(plan.id);
      setLinkPlans(linked);
    }
  };

  const handleLink = async (classId: string) => {
    if (!linkTarget || !user || !profile) return;
    setLinking(true);
    try {
      const copy = await duplicateLessonPlan(linkTarget, classId);
      setPlans((prev) => [copy, ...prev]);
      setLinkPlans((prev) => [...prev, copy]);
      success('Planeación vinculada a la clase');
    } catch { toastError('Error al vincular la planeación.'); }
    finally { setLinking(false); }
  };

  // ── Stats ──────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:    plans.filter((p) => !p.parent_plan_id).length,
    draft:    plans.filter((p) => p.status === 'draft_saved').length,
    review:   plans.filter((p) => p.status === 'pending_review').length,
    approved: plans.filter((p) => p.status === 'approved').length,
  }), [plans]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-10 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 label mb-2" style={{ color: 'var(--color-mute)' }}>
            <Star size={13} fill="var(--color-orange)" />
            panel central · planeaciones
          </div>
          <h1 className="font-display m-0" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            Mis{' '}
            <span className="serif-em" style={{ color: 'var(--color-orange)' }}>planeaciones</span>
          </h1>
        </div>

        {/* Stats */}
        {!loading && plans.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total',       value: stats.total,    bg: 'var(--color-paper)' },
              { label: 'Borradores',  value: stats.draft,    bg: 'var(--color-cream-2)' },
              { label: 'En revisión', value: stats.review,   bg: 'var(--color-butter)' },
              { label: 'Aprobadas',   value: stats.approved, bg: 'var(--color-mint)' },
            ].map((s) => (
              <div key={s.label} className="sticker p-4 text-center" style={{ background: s.bg }}>
                <div className="font-bold text-[26px]">{s.value}</div>
                <div className="label text-[10px]" style={{ color: 'var(--color-mute)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Search + filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-mute)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, materia, tema…"
              className="w-full sticker pl-9 pr-8 py-2.5 text-[13px] focus:outline-none bg-transparent"
              style={{ background: 'var(--color-paper)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2"
                style={{ background: 'none', border: 'none', color: 'var(--color-mute)', cursor: 'pointer' }}>
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className="chip transition-all"
              style={{ fontSize: 12, padding: '6px 12px',
                background: filterStatus === 'all' ? 'var(--color-plum)' : 'var(--color-paper)',
                color: filterStatus === 'all' ? 'var(--color-cream)' : 'var(--color-plum)',
              }}
            >
              Todas
            </button>
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s === filterStatus ? 'all' : s)}
                className="chip transition-all"
                style={{ fontSize: 12, padding: '6px 12px',
                  background: filterStatus === s ? STATUS_BG[s] : 'var(--color-paper)',
                  borderColor: filterStatus === s ? 'var(--color-plum)' : 'oklch(0.24 0.06 340 / 0.25)',
                  fontWeight: filterStatus === s ? 700 : 500,
                }}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-orange)' }} />
          </div>
        )}

        {!loading && plans.length === 0 && (
          <div className="sticker p-10 text-center" style={{ background: 'var(--color-paper)' }}>
            <div className="font-hand text-[22px] mb-3" style={{ color: 'var(--color-orange)' }}>✿</div>
            <p className="font-semibold text-[16px]">Todavía no tienes planeaciones guardadas.</p>
            <p className="text-[13px] mt-1" style={{ color: 'var(--color-mute)' }}>
              Ve a Planeación → genera ideas → guarda la que más te guste.
            </p>
          </div>
        )}

        {!loading && plans.length > 0 && filtered.length === 0 && (
          <div className="sticker p-8 text-center" style={{ background: 'var(--color-paper)' }}>
            <p className="font-semibold text-[15px]">Sin resultados para "{search}"</p>
            <button onClick={() => { setSearch(''); setFilterStatus('all'); }} className="btn-chunky mt-3" style={{ padding: '8px 16px', fontSize: 13 }}>
              Limpiar filtros
            </button>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              classes={classes}
              onEdit={() => setEditTarget(plan)}
              onDuplicate={() => handleDuplicate(plan)}
              onDelete={() => handleDelete(plan.id!)}
              onSubmit={() => handleSubmit(plan.id!)}
              onLink={() => openLink(plan)}
              busy={busy === plan.id}
            />
          ))}
        </div>

      </div>

      {/* Edit modal */}
      {editTarget && (
        <EditPlanModal
          plan={editTarget}
          onSave={handleEditSave}
          onClose={() => setEditTarget(null)}
          saving={editSaving}
        />
      )}

      {/* Link to class modal */}
      {linkTarget && (
        <LinkToClassModal
          plan={linkTarget}
          classes={classes}
          linkedPlans={linkPlans}
          onLink={handleLink}
          onClose={() => setLinkTarget(null)}
          linking={linking}
        />
      )}
    </DashboardLayout>
  );
}