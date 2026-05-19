import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { getStudentsByClass, getAttendanceForDate, upsertAttendance, getClasses } from '@/lib/db';
import type { Student, Class, AttendanceStatus } from '@/types';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { Star } from '@/components/tiza/Mark';

const STATUSES: { value: AttendanceStatus; label: string; bg: string }[] = [
  { value: 'present',  label: 'Presente', bg: 'var(--color-mint)'   },
  { value: 'absent',   label: 'Ausente',  bg: 'var(--color-blush)'  },
  { value: 'late',     label: 'Tarde',    bg: 'var(--color-butter)' },
  { value: 'excused',  label: 'Excusado', bg: 'var(--color-lilac)'  },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Attendance() {
  const { classId } = useParams<{ classId: string }>();
  const { user } = useAuth();
  const { profile } = useProfile();

  const [cls, setCls]           = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate]         = useState(todayISO());
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    if (!classId || !user) return;
    Promise.all([
      getClasses(user.id),
      getStudentsByClass(classId),
    ]).then(([classes, studs]) => {
      setCls(classes.find((c: Class) => c.id === classId) ?? null);
      setStudents(studs);
    }).finally(() => setLoading(false));
  }, [classId, user]);

  const loadAttendance = useCallback(async () => {
    if (!classId) return;
    const entries = await getAttendanceForDate(classId, date);
    const map: Record<string, AttendanceStatus> = {};
    entries.forEach((e) => { map[e.student_id] = e.status; });
    setStatusMap(map);
  }, [classId, date]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!classId || !user || !profile?.institution_id) return;
    setSaving(true);
    setSaved(false);
    try {
      const entries = students.map((s) => ({
        institution_id: profile.institution_id!,
        class_id: classId,
        teacher_id: user.id,
        student_id: s.id,
        date,
        status: statusMap[s.id] ?? 'present',
      }));
      await upsertAttendance(entries);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const summary = students.reduce<Record<AttendanceStatus, number>>(
    (acc, s) => {
      const st = statusMap[s.id] ?? 'present';
      acc[st] = (acc[st] ?? 0) + 1;
      return acc;
    },
    { present: 0, absent: 0, late: 0, excused: 0 },
  );

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[900px] px-6 md:px-10 py-10">

        <Link to="/classes" className="btn-chunky no-underline mb-6 inline-flex" style={{ padding: '8px 14px', fontSize: 13 }}>
          <ArrowLeft size={14} />
          Mis clases
        </Link>

        <div className="flex items-start justify-between mb-8 flex-wrap gap-4 mt-4">
          <div>
            <div className="flex items-center gap-2 label mb-2" style={{ color: 'var(--color-mute)' }}>
              <Star size={13} fill="var(--color-orange)" />
              {cls?.name ?? 'Cargando…'}
            </div>
            <h1 className="font-display m-0" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
              Registro de{' '}
              <span className="serif-em" style={{ color: 'var(--color-orange)' }}>asistencia</span>
            </h1>
          </div>

          {/* Date picker */}
          <div className="sticker p-3" style={{ background: 'var(--color-paper)' }}>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Fecha</div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-[15px] font-semibold focus:outline-none"
              style={{ color: 'var(--color-plum)' }}
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-orange)' }} />
          </div>
        )}

        {!loading && students.length === 0 && (
          <div className="sticker p-10 text-center" style={{ background: 'var(--color-paper)' }}>
            <p className="font-semibold text-[16px]">No hay estudiantes en esta clase.</p>
            <Link to={`/classes/${classId}/students`} className="text-[13px]" style={{ color: 'var(--color-orange)' }}>
              Agregar estudiantes →
            </Link>
          </div>
        )}

        {!loading && students.length > 0 && (
          <>
            {/* Summary bar */}
            <div className="flex flex-wrap gap-3 mb-6">
              {STATUSES.map((s) => (
                <div
                  key={s.value}
                  className="chip text-[12px] font-semibold"
                  style={{ background: s.bg }}
                >
                  {s.label}: {summary[s.value]}
                </div>
              ))}
            </div>

            {/* Student list */}
            <div className="space-y-2 mb-8">
              {students.map((s, i) => {
                const current = statusMap[s.id] ?? 'present';
                return (
                  <div
                    key={s.id}
                    className="sticker p-4 flex flex-wrap items-center gap-4"
                    style={{ background: 'var(--color-paper)' }}
                  >
                    <span
                      className="rounded-full font-bold text-[12px] flex items-center justify-center shrink-0"
                      style={{
                        width: 32, height: 32,
                        background: 'var(--color-butter)',
                        border: '2px solid var(--color-plum)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="font-semibold text-[14px] flex-1 min-w-[120px]">{s.full_name}</div>
                    <div className="flex gap-2 flex-wrap">
                      {STATUSES.map((st) => (
                        <button
                          key={st.value}
                          onClick={() => setStatus(s.id, st.value)}
                          className="btn-chunky text-[12px]"
                          style={{
                            padding: '5px 12px',
                            background: current === st.value ? st.bg : 'transparent',
                            fontWeight: current === st.value ? 700 : 500,
                          }}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save button */}
            <button
              className="btn-chunky btn-chunky-primary"
              style={{ padding: '14px 28px', fontSize: 15 }}
              disabled={saving}
              onClick={handleSave}
            >
              {saving
                ? <><Loader2 size={15} className="animate-spin" />Guardando…</>
                : saved
                ? <>✓ Asistencia guardada</>
                : <><Save size={15} />Guardar asistencia</>}
            </button>
          </>
        )}

      </div>
    </DashboardLayout>
  );
}