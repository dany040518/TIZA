import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/components/Toast';
import {
  getClasses, createClass, updateClass, archiveClass, unarchiveClass, deleteClass,
} from '@/lib/db';
import type { Class, DayOfWeek } from '@/types';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Loader2, Plus, Trash2, Users, CalendarCheck, Pencil, Archive, ArchiveRestore, Clock } from 'lucide-react';
import { Star } from '@/components/tiza/Mark';

// ── Constants ─────────────────────────────────────────────────────────────────

const GRADES  = ['Preescolar', 'Primaria', 'Secundaria', 'Media', 'Universidad'];
const PERIODS = ['2025-1', '2025-2', '2026-1', '2026-2'];

const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' },
  { value: 0, label: 'Dom' },
];

// ── Form state helper ─────────────────────────────────────────────────────────

function emptyForm() {
  return {
    name: '',
    subject: '',
    gradeLevel: '',
    academicPeriod: '',
    description: '',
    days: [] as DayOfWeek[],
    startTime: '',
    endTime: '',
  };
}

type FormState = ReturnType<typeof emptyForm>;

// ── Modal ─────────────────────────────────────────────────────────────────────

function ClassFormModal({
  title,
  form,
  setForm,
  onSubmit,
  onClose,
  saving,
}: {
  title: string;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: (e: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}) {
  const inp = 'w-full bg-transparent border-0 border-b py-2 text-[15px] focus:outline-none';
  const borderStyle = { borderColor: 'oklch(0.24 0.06 340 / 0.3)' };

  const toggleDay = (day: DayOfWeek) => {
    setForm((f) => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day],
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'oklch(0.24 0.06 340 / 0.45)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="sticker w-full max-w-[560px] max-h-[90vh] overflow-y-auto p-7 space-y-5"
        style={{ background: 'var(--color-paper)' }}
      >
        <div className="flex items-center justify-between">
          <div className="font-bold text-[17px]">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="btn-chunky"
            style={{ padding: '6px 10px', fontSize: 13 }}
          >✕</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Nombre *</div>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="9° Matemáticas A"
              className={inp}
              style={borderStyle}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject */}
            <div>
              <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Materia *</div>
              <input
                required
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="Matemáticas"
                className={inp}
                style={borderStyle}
              />
            </div>

            {/* Grade */}
            <div>
              <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Nivel *</div>
              <select
                required
                value={form.gradeLevel}
                onChange={(e) => setForm((f) => ({ ...f, gradeLevel: e.target.value }))}
                className={inp}
                style={borderStyle}
              >
                <option value="">Selecciona…</option>
                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Period */}
            <div>
              <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Período (opcional)</div>
              <select
                value={form.academicPeriod}
                onChange={(e) => setForm((f) => ({ ...f, academicPeriod: e.target.value }))}
                className={inp}
                style={borderStyle}
              >
                <option value="">—</option>
                {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Descripción (opcional)</div>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Notas sobre el grupo, salón, etc."
              className="w-full bg-transparent border rounded-xl p-3 text-[13px] resize-none focus:outline-none"
              style={{ borderColor: 'oklch(0.24 0.06 340 / 0.25)' }}
            />
          </div>

          {/* Schedule */}
          <div
            className="sticker p-4 space-y-3"
            style={{ background: 'var(--color-butter)' }}
          >
            <div className="flex items-center gap-2 font-semibold text-[13px]">
              <Clock size={14} style={{ color: 'var(--color-orange)' }} />
              Horario (opcional)
            </div>

            {/* Days */}
            <div>
              <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Días</div>
              <div className="flex flex-wrap gap-1.5">
                {DAYS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => toggleDay(d.value)}
                    className="chip transition-all"
                    style={{
                      fontSize: 12,
                      padding: '4px 10px',
                      background: form.days.includes(d.value)
                        ? 'var(--color-orange)'
                        : 'var(--color-paper)',
                      borderColor: form.days.includes(d.value)
                        ? 'var(--color-plum)'
                        : 'oklch(0.24 0.06 340 / 0.3)',
                      color: form.days.includes(d.value)
                        ? 'var(--color-paper)'
                        : 'var(--color-plum)',
                      fontWeight: form.days.includes(d.value) ? 700 : 500,
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Inicio</div>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  className="w-full bg-transparent border-0 border-b py-1.5 text-[14px] focus:outline-none"
                  style={borderStyle}
                />
              </div>
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Fin</div>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                  className="w-full bg-transparent border-0 border-b py-1.5 text-[14px] focus:outline-none"
                  style={borderStyle}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-chunky btn-chunky-primary flex-1 justify-center"
              style={{ padding: '12px 18px', fontSize: 14 }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Guardar
            </button>
            <button
              type="button"
              className="btn-chunky"
              style={{ padding: '12px 18px', fontSize: 14 }}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Classes() {
  const { user }    = useAuth();
  const { profile } = useProfile();
  const { success, error: toastError } = useToast();

  const [classes, setClasses]       = useState<Class[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  // Modal state
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Class | null>(null);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState<string | null>(null);

  const [createForm, setCreateForm] = useState<FormState>(emptyForm());
  const [editForm, setEditForm]     = useState<FormState>(emptyForm());

  // ── Load ───────────────────────────────────────────────────
  const loadClasses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getClasses(user.id, showArchived);
      setClasses(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadClasses(); }, [user, showArchived]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ────────────────────────────────────────────────
  const formToFields = (f: FormState): Partial<Omit<Class, 'id' | 'created_at'>> => ({
    name: f.name,
    subject: f.subject,
    grade_level: f.gradeLevel,
    academic_period: f.academicPeriod || undefined,
    description: f.description || undefined,
    days_of_week: f.days,
    start_time: f.startTime || null,
    end_time: f.endTime || null,
  });

  const classToForm = (c: Class): FormState => ({
    name: c.name,
    subject: c.subject,
    gradeLevel: c.grade_level,
    academicPeriod: c.academic_period ?? '',
    description: c.description ?? '',
    days: (c.days_of_week ?? []) as DayOfWeek[],
    startTime: c.start_time ?? '',
    endTime: c.end_time ?? '',
  });

  // ── Create ─────────────────────────────────────────────────
  const handleCreate = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!user || !profile?.institution_id) return;
    setSaving(true);
    try {
      const cls = await createClass({
        institution_id: profile.institution_id,
        teacher_id: user.id,
        is_archived: false,
        ...formToFields(createForm),
      } as Omit<Class, 'id' | 'created_at'>);
      setClasses((prev) => [cls, ...prev]);
      setCreateForm(emptyForm());
      setShowCreate(false);
      success('Clase creada correctamente');
    } catch {
      toastError('Error al crear la clase. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  // ── Edit ───────────────────────────────────────────────────
  const openEdit = (cls: Class) => {
    setEditTarget(cls);
    setEditForm(classToForm(cls));
  };

  const handleEdit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setSaving(true);
    try {
      const updated = await updateClass(editTarget.id, formToFields(editForm));
      setClasses((prev) => prev.map((c) => (c.id === editTarget.id ? updated : c)));
      setEditTarget(null);
      success('Clase actualizada');
    } catch {
      toastError('Error al actualizar la clase.');
    } finally {
      setSaving(false);
    }
  };

  // ── Archive ────────────────────────────────────────────────
  const handleArchive = async (cls: Class) => {
    try {
      if (cls.is_archived) {
        const updated = await unarchiveClass(cls.id);
        setClasses((prev) => prev.map((c) => (c.id === cls.id ? updated : c)));
        success('Clase restaurada');
      } else {
        await archiveClass(cls.id);
        setClasses((prev) =>
          showArchived
            ? prev.map((c) => (c.id === cls.id ? { ...c, is_archived: true } : c))
            : prev.filter((c) => c.id !== cls.id),
        );
        success('Clase archivada');
      }
    } catch {
      toastError('Error al cambiar estado de la clase.');
    }
  };

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async (cls: Class) => {
    if (!confirm(`¿Eliminar permanentemente "${cls.name}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(cls.id);
    try {
      await deleteClass(cls.id);
      setClasses((prev) => prev.filter((c) => c.id !== cls.id));
      success('Clase eliminada');
    } catch {
      toastError('Error al eliminar la clase.');
    } finally {
      setDeleting(null);
    }
  };

  const dayAbbr = (days: DayOfWeek[] = []) =>
    days.map((d) => DAYS.find((x) => x.value === d)?.label ?? '').join(', ');

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-10 py-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 label mb-2" style={{ color: 'var(--color-mute)' }}>
              <Star size={13} fill="var(--color-orange)" />
              gestión de clases
            </div>
            <h1 className="font-display m-0" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
              Mis{' '}
              <span className="serif-em" style={{ color: 'var(--color-orange)' }}>clases</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              className="btn-chunky"
              style={{
                padding: '10px 16px',
                fontSize: 13,
                background: showArchived ? 'var(--color-butter)' : 'transparent',
              }}
              onClick={() => setShowArchived((v) => !v)}
            >
              <Archive size={14} />
              {showArchived ? 'Ocultar archivadas' : 'Ver archivadas'}
            </button>
            <button
              className="btn-chunky btn-chunky-primary"
              style={{ padding: '10px 18px', fontSize: 14 }}
              onClick={() => { setCreateForm(emptyForm()); setShowCreate(true); }}
            >
              <Plus size={14} />
              Nueva clase
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-orange)' }} />
          </div>
        )}

        {!loading && classes.length === 0 && (
          <div className="sticker p-10 text-center" style={{ background: 'var(--color-paper)' }}>
            <div className="font-hand text-[22px] mb-3" style={{ color: 'var(--color-orange)' }}>✤</div>
            <p className="font-semibold text-[16px]">
              {showArchived ? 'No hay clases archivadas.' : 'Aún no tienes clases registradas.'}
            </p>
            <p className="text-[13px] mt-1" style={{ color: 'var(--color-mute)' }}>
              {!showArchived && 'Crea tu primera clase para gestionar estudiantes y asistencia.'}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="sticker p-5"
              style={{
                background: cls.is_archived ? 'var(--color-cream-2)' : 'var(--color-paper)',
                opacity: cls.is_archived ? 0.75 : 1,
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-bold text-[15px]">{cls.name}</div>
                    {cls.is_archived && (
                      <span className="chip text-[11px]" style={{ background: 'var(--color-butter)' }}>
                        Archivada
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] mt-0.5" style={{ color: 'var(--color-mute)' }}>
                    {cls.subject} · {cls.grade_level}
                    {cls.academic_period ? ` · ${cls.academic_period}` : ''}
                  </div>
                  {cls.description && (
                    <div className="text-[12px] mt-1" style={{ color: 'var(--color-mute)' }}>
                      {cls.description}
                    </div>
                  )}
                  {cls.start_time && cls.end_time && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <Clock size={11} style={{ color: 'var(--color-orange)' }} />
                      <span className="text-[12px] font-semibold" style={{ color: 'var(--color-mute)' }}>
                        {dayAbbr(cls.days_of_week as DayOfWeek[])} · {cls.start_time} – {cls.end_time}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {!cls.is_archived && (
                    <>
                      <Link
                        to={`/classes/${cls.id}/students`}
                        className="btn-chunky no-underline"
                        style={{ padding: '7px 12px', fontSize: 12 }}
                      >
                        <Users size={13} />
                        <span className="hidden sm:inline">Estudiantes</span>
                      </Link>
                      <Link
                        to={`/classes/${cls.id}/attendance`}
                        className="btn-chunky no-underline"
                        style={{ padding: '7px 12px', fontSize: 12 }}
                      >
                        <CalendarCheck size={13} />
                        <span className="hidden sm:inline">Asistencia</span>
                      </Link>
                    </>
                  )}
                  <button
                    className="btn-chunky"
                    style={{ padding: '7px 10px', fontSize: 12 }}
                    onClick={() => openEdit(cls)}
                    title="Editar"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    className="btn-chunky"
                    style={{
                      padding: '7px 10px',
                      fontSize: 12,
                      background: cls.is_archived ? 'var(--color-mint)' : 'transparent',
                    }}
                    onClick={() => handleArchive(cls)}
                    title={cls.is_archived ? 'Restaurar' : 'Archivar'}
                  >
                    {cls.is_archived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
                  </button>
                  <button
                    className="btn-chunky"
                    style={{ padding: '7px 10px', fontSize: 12, opacity: deleting === cls.id ? 0.5 : 1 }}
                    disabled={deleting === cls.id}
                    onClick={() => handleDelete(cls)}
                    title="Eliminar"
                  >
                    {deleting === cls.id
                      ? <Loader2 size={13} className="animate-spin" />
                      : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Create modal */}
      {showCreate && (
        <ClassFormModal
          title="Nueva clase"
          form={createForm}
          setForm={setCreateForm}
          onSubmit={handleCreate}
          onClose={() => setShowCreate(false)}
          saving={saving}
        />
      )}

      {/* Edit modal */}
      {editTarget && (
        <ClassFormModal
          title="Editar clase"
          form={editForm}
          setForm={setEditForm}
          onSubmit={handleEdit}
          onClose={() => setEditTarget(null)}
          saving={saving}
        />
      )}
    </DashboardLayout>
  );
}