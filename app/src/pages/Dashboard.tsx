import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Star, Squiggle } from '@/components/tiza/Mark';
import { cn } from '@/lib/utils';

const TASKS = [
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
    time: 'pronto',
    tag: 'próximamente',
    title: 'Asistencia y seguimiento de grupos',
    note: 'Registra asistencia y recibe alertas cuando un estudiante muestra ausentismo frecuente.',
    color: 'var(--color-butter)',
    action: 'En desarrollo',
    link: null,
  },
  {
    time: 'pronto',
    tag: 'próximamente',
    title: 'Informes automáticos de progreso',
    note: 'Genera boletines y comunicados en minutos a partir de tus registros existentes.',
    color: 'var(--color-mint)',
    action: 'En desarrollo',
    link: null,
  },
];

const days = [
  { name: 'LUN', date: 4 },
  { name: 'MAR', date: 5 },
  { name: 'MIÉ', date: 6 },
  { name: 'JUE', date: 7 },
  { name: 'VIE', date: 8 },
  { name: 'SÁB', date: 9 },
  { name: 'DOM', date: 10 },
] as const;

const today = 7;

function VoiceCard({ tag, bg, body, children }: { tag: string; bg: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="sticker p-6" style={{ background: bg }}>
      <div className="flex items-center gap-2 label" style={{ color: 'var(--color-orange)' }}>
        <span className="rounded-full inline-block" style={{ width: 8, height: 8, background: 'var(--color-orange)' }} />
        {tag}
      </div>
      <p className="mt-3 m-0 font-semibold text-[16px] leading-snug" style={{ color: 'var(--color-plum)' }}>
        {body}
      </p>
      {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { displayName } = useAuth();
  const firstName = displayName?.split(' ')[0] ?? 'Docente';

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

            {/* Hero H1 — PJS 800 + Newsreader italic accent */}
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
            {TASKS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className={cn('sticker p-6 md:p-7 grid gap-5 items-center', t.link && 'sticker-hover')}
                style={{
                  background: t.color,
                  gridTemplateColumns: '80px 1fr auto',
                  transform: `rotate(${i % 2 === 0 ? -0.4 : 0.4}deg)`,
                  opacity: t.link ? 1 : 0.72,
                }}
              >
                {/* Time */}
                <div className="font-bold text-[22px] leading-tight tracking-tight" style={{ color: 'var(--color-plum)' }}>
                  {t.time}
                </div>

                {/* Content */}
                <div>
                  <div className="label mb-2" style={{ color: t.link ? 'var(--color-orange)' : 'var(--color-mute)' }}>
                    {t.link && '✿ '}{t.tag}
                  </div>
                  <div className="font-bold text-[18px] leading-snug" style={{ color: 'var(--color-plum)' }}>
                    {t.title}
                  </div>
                  <div className="text-[13px] font-medium mt-1.5" style={{ color: 'var(--color-mute)' }}>
                    {t.note}
                  </div>
                </div>

                {/* CTA */}
                <div>
                  {t.link ? (
                    <Link to={t.link} className="btn-chunky btn-chunky-plum" style={{ padding: '10px 16px', fontSize: 13 }}>
                      {t.action} →
                    </Link>
                  ) : (
                    <span className="chip" style={{ fontSize: 11, background: 'var(--color-paper)', opacity: 0.8 }}>
                      {t.action}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Right sidebar ────────────────────────────────────── */}
        <aside className="space-y-5">

          {/* From tiza — dark card */}
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

          {/* Week calendar */}
          <div className="sticker p-5" style={{ background: 'var(--color-paper)' }}>
            <div className="label mb-4" style={{ color: 'var(--color-mute)' }}>esta semana</div>
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((d) => {
                const active = d.date === today;
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
          </div>

          {/* Voice card */}
          <VoiceCard
            tag="bienvenida"
            bg="var(--color-blush)"
            body="Tu espacio está listo. Las planeaciones son el mejor primer paso."
          >
            <Link to="/planning" className="chip" style={{ background: 'var(--color-paper)', fontSize: 12 }}>
              Ir a planeación
            </Link>
          </VoiceCard>

          <Squiggle color="var(--color-orange)" className="w-32 h-3 ml-1" />
        </aside>

      </main>
    </DashboardLayout>
  );
}