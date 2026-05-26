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
// Disponible para todos los estados de la planeación (borrador, revisión, aprobada, rechazada).
// Incluye información de la clase vinculada si existe.

function downloadPlanPDF(plan: LessonPlan, linkedClass?: Class) {
  const c = plan.content;
  const meta = [plan.subject, plan.grade, plan.topic].filter(Boolean).join(' · ');
  const statusLabels: Record<string, string> = {
    draft_saved:    'Borrador',
    pending_review: 'En revisión',
    approved:       'Aprobada',
    rejected:       'Rechazada',
  };

  const el = document.createElement('div');
  el.style.cssText = 'font-family:Georgia,serif;padding:48px 56px;color:#1a1a2e;background:#fff;max-width:800px;';
  el.innerHTML = `
    <!-- Encabezado TIZA -->
    <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #ec7a8a;padding-bottom:16px;margin-bottom:28px;">
      <div>
        <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin-bottom:4px;">
          Planeación de Clase · TIZA
        </div>
        <h1 style="font-family:Arial,sans-serif;font-size:24px;font-weight:800;margin:0;letter-spacing:-0.02em;color:#1a1a2e;">${c.title}</h1>
        ${meta ? `<p style="font-family:Arial,sans-serif;color:#666;margin:6px 0 0;font-size:13px;">${meta}</p>` : ''}
      </div>
      <div style="text-align:right;">
        <div style="font-family:Arial,sans-serif;font-size:11px;background:#f0f0f0;padding:4px 10px;border-radius:20px;display:inline-block;color:#555;font-weight:600;">
          ${statusLabels[plan.status] ?? plan.status}
        </div>
        <div style="font-family:Arial,sans-serif;font-size:11px;color:#aaa;margin-top:6px;">
          ${plan.created_at ? new Date(plan.created_at).toLocaleDateString('es-CO', { year:'numeric', month:'long', day:'numeric' }) : ''}
        </div>
      </div>
    </div>

    <!-- Clase vinculada (si existe) -->
    ${linkedClass ? `
    <div style="background:#f9e1ee;border:2px solid #ec7a8a;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
      <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#ec7a8a;margin-bottom:6px;">Clase Vinculada</div>
      <div style="font-family:Arial,sans-serif;font-size:17px;font-weight:700;color:#1a1a2e;">${linkedClass.name}</div>
      <div style="font-family:Arial,sans-serif;font-size:13px;color:#555;margin-top:3px;">
        ${[linkedClass.subject, linkedClass.grade_level, linkedClass.academic_period].filter(Boolean).join(' · ')}
      </div>
      ${(linkedClass.start_time && linkedClass.end_time) ? `
      <div style="font-family:Arial,sans-serif;font-size:12px;color:#888;margin-top:4px;">
        Horario: ${linkedClass.start_time} – ${linkedClass.end_time}
      </div>` : ''}
    </div>` : ''}

    <!-- Objetivo principal -->
    <div style="margin-bottom:20px;">
      <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin-bottom:8px;">Objetivo Principal</div>
      <p style="font-size:15px;line-height:1.6;margin:0;color:#1a1a2e;">${c.objective}</p>
    </div>

    <!-- Descripción -->
    <div style="margin-bottom:20px;">
      <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin-bottom:8px;">Descripción / Contenidos</div>
      <p style="font-size:14px;line-height:1.6;margin:0;color:#333;">${c.description}</p>
    </div>

    <!-- Duración y Tipo -->
    <div style="display:flex;gap:16px;margin-bottom:24px;">
      <div style="background:#f5f5f5;border-radius:8px;padding:10px 16px;">
        <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;color:#888;margin-bottom:2px;">Duración</div>
        <div style="font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#1a1a2e;">${c.duration} min</div>
      </div>
      ${c.type ? `<div style="background:#f5f5f5;border-radius:8px;padding:10px 16px;">
        <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;color:#888;margin-bottom:2px;">Tipo</div>
        <div style="font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#1a1a2e;">${c.type}</div>
      </div>` : ''}
    </div>

    ${plan.objectives ? `
    <!-- Objetivos específicos -->
    <div style="margin-bottom:20px;">
      <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin-bottom:8px;">Objetivos Específicos</div>
      <p style="font-size:14px;line-height:1.6;margin:0;color:#333;">${plan.objectives}</p>
    </div>` : ''}

    ${plan.methodology ? `
    <!-- Metodología -->
    <div style="margin-bottom:20px;">
      <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin-bottom:8px;">Metodología</div>
      <p style="font-size:14px;line-height:1.6;margin:0;color:#333;">${plan.methodology}</p>
    </div>` : ''}

    <!-- Secuencia de clase -->
    <div style="margin-bottom:24px;">
      <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin-bottom:12px;">Secuencia de Clase</div>
      ${c.sequence.map((s, i) => `
      <div style="display:flex;gap:14px;margin-bottom:14px;">
        <div style="font-family:Arial,sans-serif;font-weight:700;font-size:11px;color:#ec7a8a;min-width:24px;padding-top:2px;">0${i+1}</div>
        <div style="flex:1;border-left:2px solid #ec7a8a;padding-left:14px;">
          <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:4px;">
            <strong style="font-family:Arial,sans-serif;font-size:13px;color:#1a1a2e;">${s.phase}</strong>
            <span style="font-family:monospace;font-size:11px;color:#888;">${s.duration} min</span>
          </div>
          <p style="font-size:13px;line-height:1.55;margin:0;color:#444;">${s.description}</p>
        </div>
      </div>`).join('')}
    </div>

    ${c.materials?.length > 0 ? `
    <!-- Materiales -->
    <div style="margin-bottom:20px;">
      <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin-bottom:8px;">Materiales</div>
      <ul style="margin:0;padding-left:20px;column-count:2;column-gap:24px;">
        ${c.materials.map((m) => `<li style="font-size:13px;color:#333;margin-bottom:4px;">${m}</li>`).join('')}
      </ul>
    </div>` : ''}

    <!-- Evaluación -->
    <div style="background:#f9e1ee;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
      <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#ec7a8a;margin-bottom:8px;">Evaluación</div>
      <p style="font-size:14px;font-style:italic;line-height:1.65;margin:0;color:#333;">"${c.evaluation}"</p>
    </div>

    ${plan.observations ? `
    <!-- Observaciones -->
    <div style="margin-bottom:0;">
      <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin-bottom:8px;">Observaciones</div>
      <p style="font-size:13px;line-height:1.6;margin:0;color:#555;">${plan.observations}</p>
    </div>` : ''}

    <!-- Footer -->
    <div style="margin-top:40px;padding-top:16px;border-top:1px solid #e5e5e5;font-family:Arial,sans-serif;font-size:10px;color:#aaa;display:flex;justify-content:space-between;">
      <span>Generado con TIZA — planeación inteligente para docentes</span>
      <span>${new Date().toLocaleDateString('es-CO')}</span>
    </div>
  `;

  html2pdf().from(el).set({
    margin: [0.4, 0.5, 0.5, 0.5],
    filename: `tiza-planeacion-${c.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      // html2canvas no soporta oklch(). Removemos todos los stylesheets
      // del documento clonado antes de renderizar para evitar el error de parseo.
      onclone: (_doc: Document) => {
        _doc.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => el.remove());
      },
    },
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
            {/* PDF disponible para todos los estados — sin restricción de aprobación */}
            <button className="btn-chunky" style={{ padding: '6px 11px', fontSize: 12 }}
              onClick={() => downloadPlanPDF(plan, linkedClass ?? undefined)} title="Descargar PDF">
              <FileDown size={12} />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button className="btn-chunky" style={{ padding: '6px 11px', fontSize: 12 }}
              onClick={onEdit} title="Editar">
              <Pencil size={12} />
            </button>
            {/* Vincular: disponible para cualquier planeación maestra */}
            {!plan.parent_plan_id && (
              <button className="btn-chunky" style={{ padding: '6px 11px', fontSize: 12 }}
                onClick={onLink} title="Vincular a clase">
                <Link2 size={12} />
                <span className="hidden sm:inline">Vincular</span>
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
    }).catch(() => toastError('Error al cargar las planeaciones. Recarga la página.')
    ).finally(() => setLoading(false));
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