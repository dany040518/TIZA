import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getClasses } from '@/lib/db';
import type { Class, WeeklyEvent, DayOfWeek } from '@/types';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Loader2, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Star } from '@/components/tiza/Mark';

// ── Constants ─────────────────────────────────────────────────────────────────

const DAY_NAMES   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DAY_FULL    = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HOURS       = Array.from({ length: 13 }, (_, i) => i + 6); // 6:00 – 18:00
const CLASS_COLORS = [
  'var(--color-blush)',
  'var(--color-butter)',
  'var(--color-mint)',
  'var(--color-lilac)',
  'var(--color-sky)',
  'oklch(0.88 0.08 60)',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  d.setDate(d.getDate() - day + 1); // Monday
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m ?? 0);
}

function minutesToPx(minutes: number, pxPerHour = 64): number {
  return (minutes / 60) * pxPerHour;
}

function buildWeeklyEvents(classes: Class[]): WeeklyEvent[] {
  const events: WeeklyEvent[] = [];
  classes.forEach((cls, idx) => {
    if (!cls.days_of_week?.length || !cls.start_time || !cls.end_time) return;
    const color = CLASS_COLORS[idx % CLASS_COLORS.length];
    cls.days_of_week.forEach((day) => {
      events.push({
        classId:   cls.id,
        className: cls.name,
        subject:   cls.subject,
        day:       day as DayOfWeek,
        startTime: cls.start_time!,
        endTime:   cls.end_time!,
        color,
      });
    });
  });
  return events;
}

// ── Component ─────────────────────────────────────────────────────────────────

const PX_PER_HOUR = 64;

export default function WeeklyView() {
  const { user } = useAuth();
  const [classes, setClasses]     = useState<Class[]>([]);
  const [loading, setLoading]     = useState(true);
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));

  useEffect(() => {
    if (!user) return;
    getClasses(user.id)
      .then(setClasses)
      .finally(() => setLoading(false));
  }, [user]);

  const events = buildWeeklyEvents(classes);
  const today  = new Date();

  // Mon-Sun of current display week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goBack    = () => setWeekStart((w) => addDays(w, -7));
  const goForward = () => setWeekStart((w) => addDays(w, 7));
  const goToday   = () => setWeekStart(getWeekStart(new Date()));

  const isToday = (d: Date) =>
    d.getDate()     === today.getDate()     &&
    d.getMonth()    === today.getMonth()    &&
    d.getFullYear() === today.getFullYear();

  // dayIndex in weekDays: 0=Mon … 6=Sun
  // Event.day: 0=Sun,1=Mon…6=Sat → map to column
  function dayToCol(day: DayOfWeek): number {
    return day === 0 ? 6 : day - 1; // Sun→6, Mon→0 … Sat→5
  }

  const hasSchedule = classes.some(
    (c) => c.days_of_week?.length && c.start_time && c.end_time,
  );

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-10 py-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 label mb-2" style={{ color: 'var(--color-mute)' }}>
              <Star size={13} fill="var(--color-orange)" />
              vista semanal
            </div>
            <h1 className="font-display m-0" style={{ fontSize: 'clamp(26px, 4vw, 40px)' }}>
              Tu{' '}
              <span className="serif-em" style={{ color: 'var(--color-orange)' }}>semana</span>
            </h1>
          </div>

          {/* Nav controls */}
          <div className="flex items-center gap-2">
            <button className="btn-chunky" style={{ padding: '8px 12px' }} onClick={goBack}>
              <ChevronLeft size={16} />
            </button>
            <button
              className="btn-chunky"
              style={{ padding: '8px 14px', fontSize: 13 }}
              onClick={goToday}
            >
              Hoy
            </button>
            <button className="btn-chunky" style={{ padding: '8px 12px' }} onClick={goForward}>
              <ChevronRight size={16} />
            </button>
            <span className="label ml-2 hidden sm:inline" style={{ color: 'var(--color-mute)' }}>
              {formatDate(weekStart)} — {formatDate(addDays(weekStart, 6))}
            </span>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-orange)' }} />
          </div>
        )}

        {!loading && !hasSchedule && (
          <div className="sticker p-10 text-center" style={{ background: 'var(--color-paper)' }}>
            <CalendarDays size={36} className="mx-auto mb-4" style={{ color: 'var(--color-mute)' }} />
            <p className="font-bold text-[16px]">No hay horarios configurados.</p>
            <p className="text-[13px] mt-1 mb-5" style={{ color: 'var(--color-mute)' }}>
              Agrega días y horarios a tus clases para verlos aquí.
            </p>
            <Link
              to="/classes"
              className="btn-chunky btn-chunky-primary no-underline"
              style={{ padding: '10px 18px', fontSize: 13 }}
            >
              Ir a Clases →
            </Link>
          </div>
        )}

        {!loading && hasSchedule && (
          <div className="sticker overflow-hidden" style={{ background: 'var(--color-paper)' }}>
            {/* Day headers */}
            <div
              className="grid border-b-2"
              style={{
                gridTemplateColumns: '48px repeat(7, 1fr)',
                borderColor: 'var(--color-plum)',
              }}
            >
              <div className="p-2" />
              {weekDays.map((d, i) => {
                const active = isToday(d);
                return (
                  <div
                    key={i}
                    className="p-2 text-center"
                    style={{
                      borderLeft: '1px solid oklch(0.24 0.06 340 / 0.15)',
                      background: active ? 'var(--color-orange)' : 'transparent',
                    }}
                  >
                    <div
                      className="text-[9px] font-bold tracking-wider uppercase"
                      style={{ color: active ? 'var(--color-cream)' : 'var(--color-mute)' }}
                    >
                      {DAY_NAMES[d.getDay()]}
                    </div>
                    <div
                      className="font-bold text-[18px] leading-tight"
                      style={{ color: active ? 'var(--color-paper)' : 'var(--color-plum)' }}
                    >
                      {d.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time grid */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)', position: 'relative' }}>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: '48px repeat(7, 1fr)',
                  height: HOURS.length * PX_PER_HOUR,
                  position: 'relative',
                }}
              >
                {/* Hour labels */}
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="col-start-1 flex items-start justify-end pr-2 pt-1"
                    style={{
                      gridRow: `${HOURS.indexOf(h) + 1}`,
                      height: PX_PER_HOUR,
                      fontSize: 10,
                      color: 'var(--color-mute)',
                      fontWeight: 600,
                    }}
                  >
                    {h}:00
                  </div>
                ))}

                {/* Day columns background */}
                {Array.from({ length: 7 }, (_, col) => (
                  <div
                    key={col}
                    style={{
                      gridColumn: `${col + 2}`,
                      gridRow: `1 / ${HOURS.length + 1}`,
                      borderLeft: '1px solid oklch(0.24 0.06 340 / 0.1)',
                      position: 'relative',
                    }}
                  >
                    {/* Hour lines */}
                    {HOURS.map((_, hi) => (
                      <div
                        key={hi}
                        style={{
                          position: 'absolute',
                          top: hi * PX_PER_HOUR,
                          left: 0,
                          right: 0,
                          height: 1,
                          background: 'oklch(0.24 0.06 340 / 0.08)',
                        }}
                      />
                    ))}

                    {/* Events for this column */}
                    {events
                      .filter((ev) => dayToCol(ev.day) === col)
                      .map((ev, ei) => {
                        const startMin = timeToMinutes(ev.startTime);
                        const endMin   = timeToMinutes(ev.endTime);
                        const topOffset = minutesToPx(startMin - HOURS[0] * 60, PX_PER_HOUR);
                        const height    = Math.max(minutesToPx(endMin - startMin, PX_PER_HOUR), 24);
                        return (
                          <Link
                            key={ei}
                            to={`/classes/${ev.classId}/attendance`}
                            className="no-underline"
                            style={{
                              position: 'absolute',
                              top: topOffset,
                              left: 3,
                              right: 3,
                              height,
                              background: ev.color,
                              border: '2px solid var(--color-plum)',
                              borderRadius: 8,
                              padding: '3px 6px',
                              overflow: 'hidden',
                              boxShadow: '2px 2px 0 var(--color-plum)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-start',
                              zIndex: 1,
                            }}
                          >
                            <div
                              className="font-bold leading-tight truncate"
                              style={{ fontSize: Math.min(12, height / 2), color: 'var(--color-plum)' }}
                            >
                              {ev.className}
                            </div>
                            {height > 36 && (
                              <div
                                className="truncate"
                                style={{ fontSize: 10, color: 'var(--color-mute)', fontWeight: 600 }}
                              >
                                {ev.startTime} – {ev.endTime}
                              </div>
                            )}
                          </Link>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        {!loading && hasSchedule && (
          <div className="mt-4 flex flex-wrap gap-2">
            {classes
              .filter((c) => c.days_of_week?.length && c.start_time)
              .map((cls, idx) => (
                <div
                  key={cls.id}
                  className="chip text-[12px]"
                  style={{ background: CLASS_COLORS[idx % CLASS_COLORS.length] }}
                >
                  {cls.name} · {cls.subject}
                  {cls.days_of_week?.map((d) => ` ${DAY_NAMES[d]}`).join('')}
                </div>
              ))}
          </div>
        )}

        {/* Mobile: list view */}
        {!loading && hasSchedule && (
          <div className="mt-6 sm:hidden space-y-3">
            <div className="label" style={{ color: 'var(--color-mute)' }}>Esta semana</div>
            {weekDays.map((d, wi) => {
              const dayEvents = events.filter((ev) => dayToCol(ev.day) === wi);
              if (!dayEvents.length) return null;
              return (
                <div key={wi} className="sticker p-4" style={{ background: 'var(--color-paper)' }}>
                  <div className="font-bold text-[13px] mb-2" style={{ color: isToday(d) ? 'var(--color-orange)' : 'var(--color-plum)' }}>
                    {DAY_FULL[d.getDay()]} {d.getDate()}
                  </div>
                  <div className="space-y-1.5">
                    {dayEvents.map((ev, ei) => (
                      <Link
                        key={ei}
                        to={`/classes/${ev.classId}/attendance`}
                        className="flex items-center gap-3 no-underline p-2.5 rounded-xl"
                        style={{
                          background: ev.color,
                          border: '1.5px solid var(--color-plum)',
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[13px] truncate">{ev.className}</div>
                          <div className="text-[11px]" style={{ color: 'var(--color-mute)' }}>
                            {ev.startTime} – {ev.endTime}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}