import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

// Static focus items — will become dynamic once DB is wired
const focus = [
  {
    n: '01',
    title: 'Crea tu primera planeación',
    body: 'Describe el tema, el grado y el contexto. TIZA te propone tres ideas muy diferentes — tú eliges.',
    meta: 'Planeación IA · listo',
    to: '/planning',
    cta: 'Ir a planeación',
    accent: true,
  },
  {
    n: '02',
    title: 'Asistencia y seguimiento',
    body: 'Registra la asistencia de cada grupo y recibe alertas cuando un estudiante muestra ausentismo frecuente.',
    meta: 'Próximamente',
    to: '/dashboard',
    cta: 'Pronto disponible',
    accent: false,
  },
  {
    n: '03',
    title: 'Informes automáticos',
    body: 'Genera informes de progreso, boletines y comunicados en minutos a partir de tus registros existentes.',
    meta: 'Próximamente',
    to: '/dashboard',
    cta: 'Pronto disponible',
    accent: false,
  },
];

// Calendar — week strip (static for now)
const days = [
  { name: 'LUN', date: 4 },
  { name: 'MAR', date: 5 },
  { name: 'MIÉ', date: 6 },
  { name: 'JUE', date: 7 },
  { name: 'VIE', date: 8 },
  { name: 'SÁB', date: 9 },
  { name: 'DOM', date: 10 },
] as const;

const today = 7; // Thursday

export default function Dashboard() {
  const { displayName } = useAuth();
  const firstName = displayName?.split(' ')[0] ?? 'Docente';

  return (
    <DashboardLayout>
      <div className="relative min-h-full">
        <div className="dawn-light opacity-50" />

        <div className="relative px-10 py-8 max-w-[1280px] mx-auto space-y-14">

          {/* ── Greeting ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="eyebrow mb-5">— Panel de control</div>
            <h1 className="font-serif font-light text-[52px] leading-[1.05] tracking-[-0.02em] max-w-[780px]">
              Hola, {firstName}.<br />
              <span className="italic text-mute">
                ¿Qué necesitas{' '}
              </span>
              <span className="italic text-orange">
                hoy
              </span>
              <span className="italic text-mute">?</span>
            </h1>
          </motion.div>

          {/* ── Focus cards ───────────────────────────────────── */}
          <section>
            <div className="eyebrow mb-5">— Acciones</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {focus.map((f, i) => (
                <motion.div
                  key={f.n}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={cn(
                    'border p-6 transition-all group',
                    f.accent
                      ? 'border-blush bg-gradient-to-b from-paper to-blush-mist/60 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-24px_rgba(40,32,20,0.2)]'
                      : 'border-line bg-paper opacity-60'
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={cn(
                      'font-mono text-[10px] tracking-[0.18em]',
                      f.accent ? 'text-orange' : 'text-mute'
                    )}>
                      {f.n}
                    </span>
                    {f.accent && <span className="ink-pulse" />}
                  </div>
                  <h3 className="font-serif font-light text-[22px] leading-[1.2] tracking-[-0.01em]">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[1.6] text-mute">
                    {f.body}
                  </p>
                  <div className="mt-6 pt-4 border-t border-line-soft flex items-center justify-between">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-mute">
                      {f.meta}
                    </span>
                    {f.accent ? (
                      <Link
                        to={f.to}
                        className="text-[12.5px] text-ink hover:text-orange transition-colors inline-flex items-center gap-1"
                      >
                        {f.cta} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <span className="text-[12.5px] text-mute-soft italic">En desarrollo</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Week calendar ─────────────────────────────────── */}
          <section>
            <div className="eyebrow mb-5">— Esta semana</div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((d) => {
                const active = d.date === today;
                return (
                  <div
                    key={d.date}
                    className={cn(
                      'flex flex-col items-center py-4 border transition-colors',
                      active
                        ? 'border-orange bg-orange text-paper'
                        : 'border-line bg-paper text-mute hover:border-mute cursor-pointer'
                    )}
                  >
                    <span className="font-mono text-[10px] tracking-[0.14em] mb-2 opacity-70">
                      {d.name}
                    </span>
                    <span className={cn(
                      'font-serif text-[22px] font-light tracking-[-0.01em]',
                      active ? 'text-paper' : 'text-ink'
                    )}>
                      {d.date}
                    </span>
                    {active && (
                      <span
                        className="mt-2 w-1.5 h-1.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.6)' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── TIZA note ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pb-8"
          >
            <div className="p-6 bg-blush-mist/50 border border-blush-air max-w-[560px]">
              <div className="eyebrow text-orange mb-3 flex items-center gap-2">
                <span className="ink-pulse" /> Una nota de TIZA
              </div>
              <p className="font-serif text-[18px] leading-[1.45] italic font-light">
                "Comienza con una planeación. El resto del espacio de trabajo se abre desde ahí."
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </DashboardLayout>
  );
}
