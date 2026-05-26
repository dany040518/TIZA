import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Star, Squiggle } from '@/components/tiza/Mark';
import { getLessonPlans, getClasses } from '@/lib/db';
import type { LessonPlan, Class, DayOfWeek } from '@/types';
import { Loader2, BookOpen, Clock, AlertCircle, CheckCircle2, FileText } from 'lucide-react';

// ── Active tasks — only Planning focus (Attendance paused) ──────────────────

const ACTIVE_TASKS = [
  {
    time: 'ahora',
    tag: 'planeación · IA lista',
    title: 'Crea tu primera planeación de clase',
    note: 'Describe el tema, el grado y el contexto — tiza propone tres ideas muy diferentes.',
    color: 'var(--color-blush)',
    action: 'Ir a planeación',
    link: '/planning' as const,
  },
  {
    time: 'semana',
    tag: 'vista semanal',
    title: 'Consulta tu agenda de la semana',
    note: 'Visualiza tus clases programadas en el calendario semanal.',
    color: 'var(--color-mint)',
    action: 'Ver semana',
    link: '/weekly' as const,
  },
] as const;

/* TIZA - Funcionalidad pausada temporalmente. No eliminar.
   Tarjeta de asistencia — reactivar descomentando este bloque y añadiéndolo a ACTIVE_TASKS:
  {
    time: 'hoy',
    tag: 'asistencia',
    title: 'Registra la asistencia de tus clases',
    note: 'Ve a cada clase y marca presente o ausente con un solo toque.',
    color: 'var(--color-butter)',
    action: 'Ir a Clases',
    link: '/classes' as const,
  },
*/

// ── Week calendar helper ─────────────────────────────────────────────────────

function getWeekDays() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);
  const names = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { name: names[i], date: d.getDate(), full: d };
  });
}

// ── Smart reminder widget ────────────────────────────────────────────────────

interface Reminder {
  icon: React.ReactNode;
  text: string;
  bg: string;
  link?: string;
  linkLabel?: string;
}

function buildReminders(plans: LessonPlan[], classes: Class[]): Reminder[] {
  const reminders: Reminder[] = [];
  const todayDow = new Date().getDay() as DayOfWeek;

  const draftPlans   = plans.filter((p) => p.status === 'draft_saved' && !p.parent_plan_id);
  const pendingPlans = plans.filter((p) => p.status === 'pending_review');
  const classesWithPlan = new Set(plans.map((p) => p.class_id).filter(Boolean));
  const classesWithoutPlan = classes.filter((c) => !classesWithPlan.has(c.id));
  const todayClasses = classes.filter((c) => (c.days_of_week ?? []).includes(todayDow));
  const todayWithoutPlan = todayClasses.filter((c) => !classesWithPlan.has(c.id));

  // Hoy hay clases sin planeación
  if (todayWithoutPlan.length > 0) {
    const names = todayWithoutPlan.slice(0, 2).map((c) => c.name).join(', ');
    reminders.push({
      icon: <AlertCircle size={14} />,
      text: `Hoy tienes ${todayWithoutPlan.length === 1 ? 'una clase' : `${todayWithoutPlan.length} clases`} sin planeación enlazada: ${names}${todayWithoutPlan.length > 2 ? '…' : ''}.`,
      bg: 'var(--color-lilac)',
      link: '/my-plans',
      linkLabel: 'Ver planeaciones',
    });
  }

  // Planeaciones en borrador
  if (draftPlans.length > 0) {
    reminders.push({
      icon: <FileText size={14} />,
      text: `Tienes ${draftPlans.length} planeación${draftPlans.length > 1 ? 'es' : ''} en borrador sin enviar a revisión.`,
      bg: 'var(--color-butter)',
      link: '/my-plans',
      linkLabel: 'Revisar borradores',
    });
  }

  // Planeaciones en revisión
  if (pendingPlans.length > 0) {
    reminders.push({
      icon: <Clock size={14} />,
      text: `${pendingPlans.length} planeación${pendingPlans.length > 1 ? 'es están' : ' está'} en revisión por el coordinador.`,
      bg: 'var(--color-sky)',
    });
  }

  // Clases sin planeación (general)
  if (classesWithoutPlan.length > 0 && todayWithoutPlan.length === 0) {
    const names = classesWithoutPlan.slice(0, 2).map((c) => c.name).join(', ');
    reminders.push({
      icon: <BookOpen size={14} />,
      text: `${classesWithoutPlan.length === 1 ? 'La clase' : 'Las clases'} ${names}${classesWithoutPlan.length > 2 ? '…' : ''} aún no ${classesWithoutPlan.length > 1 ? 'tienen' : 'tiene'} planeación asignada.`,
      bg: 'var(--color-blush)',
      link: '/my-plans',
      linkLabel: 'Ir a planeaciones',
    });
  }

  // Sin planeaciones aún
  if (plans.length === 0) {
    reminders.push({
      icon: <CheckCircle2 size={14} />,
      text: 'Crea tu primera planeación con ayuda de la IA de TIZA. Solo describe el tema y el grado.',
      bg: 'var(--color-blush)',
      link: '/planning',
      linkLabel: 'Crear planeación',
    });
  }

  // Todo al día
  if (reminders.length === 0) {
    reminders.push({
      icon: <CheckCircle2 size={14} />,
      text: 'Todas tus clases tienen planeaciones enlazadas. ¡Sigue así!',
      bg: 'var(--color-mint)',
    });
  }

  return reminders;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, displayName } = useAuth();
  const firstName = displayName?.split(' ')[0] ?? 'Docente';
  const weekDays  = getWeekDays();
  const todayDate = new Date().getDate();

  const [plans,    setPlans]    = useState<LessonPlan[]>([]);
  const [classes,  setClasses]  = useState<Class[]>([]);
  const [loading,  setLoading]  = useState(true);

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

  const reminders = loading ? [] : buildReminders(plans, classes);

  return (
    <DashboardLayout>
      <main className="mx-auto max-w-[1320px] px-6 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

        {/* ── Left ─────────────────────────────────────────────── */}
        <section>

          {/* Greeting card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticker sticker-lg p-8 md:p-10 mb-8"
            style={{ background: 'var(--color-paper)' }}
          >
            <div className="flex items-center gap-3">
              <Star size={22} fill="var(--color-orange)" />
              <span className="label" style={{ color: 'var(--color-mute)' }}>panel de control</span>
            </div>

            <h1 className="font-display mt-5 m-0" style={{ fontSize: 'clamp(38px, 5.5vw, 64px)' }}>
              Hola,{' '}
              <span className="serif-em" style={{ color: 'var(--color-orange)' }}>{firstName}</span>.
            </h1>

            <p className="mt-3 text-[18px] font-medium" style={{ color: 'var(--color-mute)', lineHeight: 1.4 }}>
              ¿Qué necesitas hoy?
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="chip" style={{ background: 'var(--color-blush)' }}>planeación IA</span>
              <span className="chip" style={{ background: 'var(--color-butter)' }}>seguimiento pronto</span>
              <span className="chip" style={{ background: 'var(--color-mint)' }}>informes pronto</span>
            </div>
          </motion.div>

          {/* Tilted task cards */}
          <div className="space-y-4">
            {ACTIVE_TASKS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="sticker p-6 md:p-7 grid gap-5 items-center sticker-hover"
                style={{
                  background: t.color,
                  gridTemplateColumns: '80px 1fr auto',
                  transform: `rotate(${i % 2 === 0 ? -0.4 : 0.4}deg)`,
                }}
              >
                <div className="font-bold text-[22px] leading-tight tracking-tight" style={{ color: 'var(--color-plum)' }}>
                  {t.time}
                </div>
                <div>
                  <div className="label mb-2" style={{ color: 'var(--color-orange)' }}>
                    ✿ {t.tag}
                  </div>
                  <div className="font-bold text-[18px] leading-snug" style={{ color: 'var(--color-plum)' }}>
                    {t.title}
                  </div>
                  <div className="text-[13px] font-medium mt-1.5" style={{ color: 'var(--color-mute)' }}>
                    {t.note}
                  </div>
                </div>
                <div>
                  <Link to={t.link} className="btn-chunky btn-chunky-plum" style={{ padding: '10px 16px', fontSize: 13 }}>
                    {t.action} →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Right sidebar ────────────────────────────────────── */}
        <aside className="space-y-5">

          {/* Dark brand card */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="sticker sticker-lg p-7"
            style={{ background: 'var(--color-plum)', color: 'var(--color-cream)', borderColor: 'var(--color-cream)' }}
          >
            <div className="font-hand" style={{ fontSize: 24, color: 'var(--color-butter)' }}>
              de tiza ✿
            </div>
            <p className="mt-3 m-0 font-semibold text-[17px] leading-relaxed" style={{ color: 'var(--color-cream)' }}>
              Comienza con una planeación.{' '}
              <span className="serif-em" style={{ color: 'var(--color-blush)' }}>
                El resto se abre desde ahí.
              </span>
            </p>
          </motion.div>

          {/* Smart reminders */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="sticker p-5"
            style={{ background: 'var(--color-paper)' }}
          >
            <div className="label mb-4" style={{ color: 'var(--color-mute)' }}>
              recordatorios →
            </div>

            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 size={18} className="animate-spin" style={{ color: 'var(--color-orange)' }} />
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.map((r, i) => (
                  <div
                    key={i}
                    className="sticker p-3.5"
                    style={{ background: r.bg, boxShadow: '2px 2px 0 var(--color-plum)' }}
                  >
                    <div className="flex items-start gap-2">
                      <span style={{ color: 'var(--color-plum)', marginTop: 2, flexShrink: 0 }}>
                        {r.icon}
                      </span>
                      <p className="text-[12.5px] font-semibold leading-snug m-0" style={{ color: 'var(--color-plum)' }}>
                        {r.text}
                      </p>
                    </div>
                    {r.link && r.linkLabel && (
                      <Link
                        to={r.link}
                        className="chip mt-2.5 no-underline"
                        style={{ fontSize: 11, padding: '3px 10px', background: 'var(--color-paper)' }}
                      >
                        {r.linkLabel} →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Week calendar */}
          <Link to="/weekly" className="sticker p-5 block no-underline" style={{ background: 'var(--color-paper)' }}>
            <div className="label mb-4" style={{ color: 'var(--color-mute)' }}>esta semana →</div>
            <div className="grid grid-cols-7 gap-1.5">
              {weekDays.map((d) => {
                const active = d.date === todayDate;
                return (
                  <div
                    key={d.date}
                    className="flex flex-col items-center py-2.5 transition-all"
                    style={
                      active
                        ? { background: 'var(--color-orange)', border: '2px solid var(--color-plum)', boxShadow: '3px 3px 0 var(--color-plum)', borderRadius: 14 }
                        : { border: '1.5px solid oklch(0.24 0.06 340 / 0.2)', borderRadius: 10 }
                    }
                  >
                    <span
                      className="text-[9px] font-bold tracking-wider mb-1.5 uppercase"
                      style={{ color: active ? 'oklch(0.99 0.012 85 / 0.8)' : 'var(--color-mute)' }}
                    >
                      {d.name}
                    </span>
                    <span
                      className="font-bold text-[18px] leading-none"
                      style={{ color: active ? 'var(--color-paper)' : 'var(--color-plum)' }}
                    >
                      {d.date}
                    </span>
                    {active && (
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.99 0.012 85 / 0.6)' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </Link>

          <Squiggle color="var(--color-orange)" className="w-32 h-3 ml-1" />

        </aside>

      </main>
    </DashboardLayout>
  );
}