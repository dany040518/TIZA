import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { getClasses, createClass, deleteClass } from '@/lib/db';
import type { Class } from '@/types';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Loader2, Plus, Trash2, Users, CalendarCheck } from 'lucide-react';
import { Star } from '@/components/tiza/Mark';

const GRADES = ['Preescolar', 'Primaria', 'Secundaria', 'Media', 'Universidad'];
const PERIODS = ['2025-1', '2025-2', '2026-1', '2026-2'];

export default function Classes() {
  const { user } = useAuth();
  const { profile } = useProfile();

  const [classes, setClasses]   = useState<Class[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [name, setName]                   = useState('');
  const [subject, setSubject]             = useState('');
  const [gradeLevel, setGradeLevel]       = useState('');
  const [academicPeriod, setAcademicPeriod] = useState('');

  useEffect(() => {
    if (!user) return;
    getClasses(user.id)
      .then(setClasses)
      .finally(() => setLoading(false));
  }, [user]);

  const handleCreate = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!user || !profile?.institution_id) return;
    setSaving(true);
    try {
      const cls = await createClass({
        institution_id: profile.institution_id,
        teacher_id: user.id,
        name,
        subject,
        grade_level: gradeLevel,
        academic_period: academicPeriod || undefined,
      });
      setClasses((prev) => [cls, ...prev]);
      setName(''); setSubject(''); setGradeLevel(''); setAcademicPeriod('');
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (classId: string) => {
    if (!confirm('¿Eliminar esta clase y todos sus datos?')) return;
    setDeleting(classId);
    try {
      await deleteClass(classId);
      setClasses((prev) => prev.filter((c) => c.id !== classId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
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
          <button
            className="btn-chunky btn-chunky-primary"
            style={{ padding: '12px 20px', fontSize: 14 }}
            onClick={() => setShowForm((v) => !v)}
          >
            <Plus size={15} />
            Nueva clase
          </button>
        </div>

        {/* New class form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="sticker p-6 mb-6 space-y-4"
            style={{ background: 'oklch(0.96 0.06 90)' }}
          >
            <div className="font-bold text-[15px]">Nueva clase</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Nombre de la clase</div>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="9° Matemáticas A"
                  className="w-full bg-transparent border-0 border-b py-2 text-[15px] focus:outline-none"
                  style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)' }}
                />
              </div>
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Materia</div>
                <input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Matemáticas"
                  className="w-full bg-transparent border-0 border-b py-2 text-[15px] focus:outline-none"
                  style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)' }}
                />
              </div>
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Nivel</div>
                <select
                  required
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full bg-transparent border-0 border-b py-2 text-[15px] focus:outline-none"
                  style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)' }}
                >
                  <option value="">Selecciona…</option>
                  {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Período (opcional)</div>
                <select
                  value={academicPeriod}
                  onChange={(e) => setAcademicPeriod(e.target.value)}
                  className="w-full bg-transparent border-0 border-b py-2 text-[15px] focus:outline-none"
                  style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)' }}
                >
                  <option value="">—</option>
                  {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-chunky btn-chunky-primary"
                style={{ padding: '10px 18px', fontSize: 13 }}
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Crear
              </button>
              <button
                type="button"
                className="btn-chunky"
                style={{ padding: '10px 18px', fontSize: 13 }}
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-orange)' }} />
          </div>
        )}

        {!loading && classes.length === 0 && !showForm && (
          <div className="sticker p-10 text-center" style={{ background: 'var(--color-paper)' }}>
            <div className="font-hand text-[22px] mb-3" style={{ color: 'var(--color-orange)' }}>✤</div>
            <p className="font-semibold text-[16px]">Aún no tienes clases registradas.</p>
            <p className="text-[13px] mt-1" style={{ color: 'var(--color-mute)' }}>
              Crea tu primera clase para gestionar estudiantes y asistencia.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {classes.map((cls) => (
            <div key={cls.id} className="sticker p-5" style={{ background: 'var(--color-paper)' }}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-[15px]">{cls.name}</div>
                  <div className="text-[13px] mt-0.5" style={{ color: 'var(--color-mute)' }}>
                    {cls.subject} · {cls.grade_level}
                    {cls.academic_period ? ` · ${cls.academic_period}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/classes/${cls.id}/students`}
                    className="btn-chunky no-underline"
                    style={{ padding: '8px 14px', fontSize: 13 }}
                  >
                    <Users size={14} />
                    Estudiantes
                  </Link>
                  <Link
                    to={`/classes/${cls.id}/attendance`}
                    className="btn-chunky no-underline"
                    style={{ padding: '8px 14px', fontSize: 13 }}
                  >
                    <CalendarCheck size={14} />
                    Asistencia
                  </Link>
                  <button
                    className="btn-chunky"
                    style={{ padding: '8px 12px', fontSize: 13, opacity: deleting === cls.id ? 0.5 : 1 }}
                    disabled={deleting === cls.id}
                    onClick={() => handleDelete(cls.id)}
                  >
                    {deleting === cls.id
                      ? <Loader2 size={14} className="animate-spin" />
                      : <Trash2 size={14} />}
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