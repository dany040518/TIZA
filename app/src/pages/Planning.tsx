import { Sparkles, X, BookmarkCheck, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { saveLessonPlan } from "@/lib/db";
import { generateLessonPlan } from "@/services/aiService";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { Star, Squiggle } from "@/components/tiza/Mark";
import { useToast } from "@/components/Toast";
import type { PlanIdea } from "@/types";
import type { SectionKey } from "@/types";
import { SECTION_LABELS, SECTION_PRESETS, MANDATORY_SECTIONS } from "@/types";

// ── Phase accent colors ──────────────────────────────────────
const phaseColors = [
  'var(--color-sky)',
  'var(--color-orange)',
  'var(--color-mint)',
];

// ── Idea card accent backgrounds ─────────────────────────────
const ideaColors = [
  'var(--color-blush)',
  'var(--color-butter)',
  'var(--color-mint)',
];

export default function Planning() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { error: toastError, success: toastSuccess } = useToast();

  const [topic, setTopic]           = useState("");
  const [subject, setSubject]       = useState("");
  const [grade, setGrade]           = useState("");
  const [context, setContext]       = useState("");
  const [selectedSections, setSelectedSections] = useState<SectionKey[]>(
    SECTION_PRESETS[0].sections // default: Completa
  );
  const [loading, setLoading]       = useState(false);
  const [ideas, setIdeas]           = useState<PlanIdea[]>([]);
  const [selected, setSelected]     = useState<PlanIdea | null>(null);
  const [activePlan, setActivePlan] = useState<PlanIdea | null>(null);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);

  const subjects = [
    "Matemáticas", "Ciencias Naturales", "Lengua/Español",
    "Ciencias Sociales", "Inglés", "Tecnología", "Arte", "Educación Física",
  ];
  const grades = ["Preescolar", "Primaria", "Secundaria", "Media", "Universidad"];

  // ── Handlers ─────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setIdeas([]);
    setSelected(null);
    setActivePlan(null);
    setSaved(false);

    try {
      const result = await generateLessonPlan(subject, grade, topic, context, selectedSections);
      if (result?.ideas) {
        setIdeas(result.ideas);
      }
    } catch (err) {
      console.error("Generation error:", err);
      toastError('No se pudo generar la planeación. Verifica tu conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleUsePlan = (idea: PlanIdea) => {
    setSaved(false);
    setActivePlan(idea);
    setTimeout(() => {
      document.getElementById("plan-panel")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const handleSaveLessonPlan = async () => {
    if (!user || !activePlan) return;
    setSaving(true);
    try {
      await saveLessonPlan({
        teacher_id:     user.id,
        institution_id: profile?.institution_id ?? null,
        title:          activePlan.title,
        subject,
        grade,
        topic,
        content:         activePlan,
        selected_sections: selectedSections,
      });
      setSaved(true);
      toastSuccess('Planeación guardada correctamente.');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      toastError('No se pudo guardar la planeación. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };



  // ── Render ───────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <main className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-10 py-7 sm:py-10">

        {/* ── Page header ─────────────────────────────────────── */}
        <div className="mb-7 sm:mb-10">
          <span className="label" style={{ color: 'var(--color-mute)' }}>— laboratorio de planeación</span>
          <h1 className="font-display mt-3" style={{ fontSize: 'clamp(34px, 5vw, 56px)' }}>
            Genera tu{' '}
            <span className="serif-em" style={{ color: 'var(--color-orange)' }}>
              planeación de clase
            </span>.
          </h1>
          <p className="mt-3 text-[15px] font-medium max-w-[480px]" style={{ color: 'var(--color-mute)' }}>
            Describe el tema, el grado y el contexto. TIZA propone tres ideas muy diferentes — tú eliges.
          </p>
        </div>

        {/* ── Main grid: form | output ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">

          {/* LEFT: Input canvas */}
          <div>
            <div className="sticker sticker-lg notebook p-5 sm:p-7 space-y-5 sm:space-y-6 sm:sticky sm:top-4">

              {/* Topic */}
              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Tema principal</div>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="ej. Fotosíntesis y luz"
                  className="w-full bg-transparent border-0 border-b py-2 font-bold focus:outline-none transition-colors"
                  style={{
                    fontSize: 20,
                    letterSpacing: '-0.01em',
                    borderColor: 'oklch(0.24 0.06 340 / 0.3)',
                    color: 'var(--color-plum)',
                  }}
                />
              </div>

              {/* Subject */}
              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Área</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {subjects.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSubject(s === subject ? "" : s)}
                      className="chip transition-all"
                      style={{
                        background:  subject === s ? 'var(--color-blush)' : 'var(--color-paper)',
                        borderColor: subject === s ? 'var(--color-orange)' : 'oklch(0.24 0.06 340 / 0.3)',
                        fontSize: 12,
                        padding: '4px 10px',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade */}
              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Grado</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {grades.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGrade(g === grade ? "" : g)}
                      className="chip transition-all"
                      style={{
                        background: grade === g ? 'var(--color-butter)' : 'var(--color-paper)',
                        borderColor: grade === g ? 'var(--color-orange)' : 'oklch(0.24 0.06 340 / 0.3)',
                        fontSize: 12,
                        padding: '4px 10px',
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Context */}
              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Contexto del aula</div>
                <textarea
                  rows={3}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Número de estudiantes, necesidades especiales, recursos…"
                  className="w-full bg-transparent border rounded-xl p-3 text-[14px] font-medium leading-relaxed resize-none focus:outline-none transition-colors mt-1"
                  style={{
                    borderColor: 'oklch(0.24 0.06 340 / 0.2)',
                    color: 'var(--color-plum)',
                  }}
                />
              </div>

              {/* Section selector */}
              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Secciones a incluir</div>

                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {SECTION_PRESETS.map((preset) => {
                    const active = JSON.stringify([...preset.sections].sort()) ===
                      JSON.stringify([...selectedSections].sort());
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setSelectedSections([...preset.sections])}
                        className="chip transition-all"
                        style={{
                          fontSize: 11,
                          padding: '3px 9px',
                          background: active ? 'var(--color-plum)' : 'var(--color-paper)',
                          color: active ? 'var(--color-cream)' : 'var(--color-plum)',
                          borderColor: active ? 'var(--color-plum)' : 'oklch(0.24 0.06 340 / 0.3)',
                        }}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* Individual toggles */}
                <div className="flex flex-col gap-1.5">
                  {(Object.keys(SECTION_LABELS) as SectionKey[]).map((key) => {
                    const mandatory = MANDATORY_SECTIONS.includes(key);
                    const checked   = mandatory || selectedSections.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={mandatory}
                        onClick={() => {
                          if (mandatory) return;
                          setSelectedSections((prev) =>
                            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
                          );
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all text-left w-full"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          background: checked ? 'var(--color-mint)' : 'var(--color-paper)',
                          border: `1.5px solid ${checked ? 'var(--color-plum)' : 'oklch(0.24 0.06 340 / 0.2)'}`,
                          color: 'var(--color-plum)',
                          opacity: mandatory ? 0.7 : 1,
                          cursor: mandatory ? 'default' : 'pointer',
                        }}
                      >
                        <span style={{ color: checked ? 'var(--color-orange)' : 'var(--color-mute)', fontSize: 10, flexShrink: 0 }}>
                          {checked ? '✓' : '○'}
                        </span>
                        <span>{SECTION_LABELS[key]}</span>
                        {mandatory && (
                          <span style={{ fontSize: 9, color: 'var(--color-mute)', marginLeft: 'auto', flexShrink: 0 }}>
                            req.
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="btn-chunky btn-chunky-primary w-full justify-center"
              >
                {loading ? (
                  <>
                    <span className="ink-pulse" />
                    Generando ideas…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generar ideas
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: Ideas + detail */}
          <div className="space-y-6">

            {/* Empty state */}
            {ideas.length === 0 && !loading && (
              <div
                className="sticker sticker-lg p-16 flex flex-col items-center justify-center text-center min-h-[300px]"
                style={{ background: 'var(--color-cream-2)', borderStyle: 'dashed' }}
              >
                <Squiggle color="var(--color-orange)" className="w-24 h-3 mb-6" />
                <p className="font-bold text-[22px] tracking-tight" style={{ color: 'var(--color-mute)' }}>
                  La planeación aparece aquí.
                </p>
                <p className="text-[14px] font-medium mt-2 max-w-[280px]" style={{ color: 'var(--color-mute)' }}>
                  Describe el tema a la izquierda y pulsa "Generar ideas".
                </p>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div
                className="sticker sticker-lg p-8 space-y-4"
                style={{ background: 'var(--color-paper)' }}
              >
                <div className="label flex items-center gap-2" style={{ color: 'var(--color-orange)' }}>
                  <span className="ink-pulse" /> TIZA está pensando…
                </div>
                <div className="space-y-3 animate-pulse">
                  {[75, 50, 65].map((w, i) => (
                    <div
                      key={i}
                      className="h-4 rounded-full"
                      style={{ background: 'var(--color-cream-2)', width: `${w}%` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Ideas grid */}
            {ideas.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Ideas list */}
                <div className="space-y-3">
                  <div className="label mb-4" style={{ color: 'var(--color-mute)' }}>
                    — {ideas.length} ideas generadas
                  </div>
                  {ideas.map((idea, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => setSelected(idea)}
                      className="sticker sticker-hover w-full text-left p-5 transition-all"
                      style={{
                        background: selected === idea ? ideaColors[i % 3] : 'var(--color-paper)',
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <span className="label" style={{ color: selected === idea ? 'var(--color-orange)' : 'var(--color-mute)' }}>
                          0{i + 1} · {idea.type}
                        </span>
                        {selected === idea && <span className="ink-pulse mt-1" />}
                      </div>
                      <h3 className="font-bold mt-3 text-[17px] leading-snug tracking-tight">
                        {idea.title}
                      </h3>
                      <p className="text-[13px] font-medium mt-2 leading-relaxed line-clamp-2" style={{ color: 'var(--color-mute)' }}>
                        {idea.description}
                      </p>
                    </motion.button>
                  ))}
                </div>

                {/* Detail panel */}
                <div>
                  <AnimatePresence mode="wait">
                    {selected ? (
                      <motion.div
                        key={selected.title}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="sticker h-full flex flex-col p-6"
                        style={{ background: 'var(--color-paper)' }}
                      >
                        <div className="label mb-1" style={{ color: 'var(--color-orange)' }}>
                          — Plan seleccionado
                        </div>
                        <h2 className="font-bold mt-1 text-[19px] leading-snug tracking-tight">
                          {selected.title}
                        </h2>
                        {selected.objective && (
                          <p className="text-[13px] font-medium mt-2 leading-relaxed" style={{ color: 'var(--color-mute)' }}>
                            {selected.objective}
                          </p>
                        )}

                        <div className="mt-5 space-y-4 flex-1">
                          {(selected.sequence ?? []).map((fase, i) => (
                            <div key={i} className="flex gap-3">
                              <div className="flex flex-col items-center shrink-0">
                                <span className="label" style={{ color: phaseColors[i % 3] }}>
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                {i < (selected.sequence?.length ?? 0) - 1 && (
                                  <div
                                    className="w-px flex-1 mt-1"
                                    style={{ background: 'oklch(0.24 0.06 340 / 0.15)' }}
                                  />
                                )}
                              </div>
                              <div className="pb-4">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-[13.5px] font-semibold" style={{ color: 'var(--color-plum)' }}>
                                    {fase.phase}
                                  </span>
                                  <span className="text-[11px]" style={{ color: 'var(--color-mute)', fontFamily: 'var(--font-mono)' }}>
                                    {fase.duration} min
                                  </span>
                                </div>
                                <p className="text-[13px] font-medium mt-1 leading-relaxed" style={{ color: 'var(--color-mute)' }}>
                                  {fase.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div
                          className="mt-5 pt-4"
                          style={{ borderTop: '1.5px solid oklch(0.24 0.06 340 / 0.18)' }}
                        >
                          <button
                            onClick={() => handleUsePlan(selected)}
                            className="btn-chunky btn-chunky-primary w-full justify-center"
                          >
                            Usar esta planeación →
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty-detail"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="sticker flex items-center justify-center h-full min-h-[200px]"
                        style={{ background: 'var(--color-cream-2)', borderStyle: 'dashed' }}
                      >
                        <p className="text-[14px] font-medium italic" style={{ color: 'var(--color-mute)' }}>
                          Selecciona una idea para ver el detalle.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* ── Active plan document ─────────────────────────────── */}
        <AnimatePresence>
          {activePlan && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              id="plan-panel"
              className="mt-10 sticker sticker-lg"
              style={{ background: 'var(--color-paper)' }}
            >
              {/* Doc bar */}
              <div
                className="flex items-center justify-between px-8 py-4"
                style={{ borderBottom: '2px solid oklch(0.24 0.06 340 / 0.18)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="label flex items-center gap-2" style={{ color: 'var(--color-orange)' }}>
                    <span className="ink-pulse" /> Planeación activa
                  </span>
                  {subject && grade && (
                    <span
                      className="chip"
                      style={{ background: 'var(--color-butter)', fontSize: 11, padding: '3px 10px' }}
                    >
                      {subject} · {grade} · {activePlan.duration} min
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveLessonPlan}
                    disabled={saving || saved}
                    className="btn-chunky btn-chunky-primary"
                    style={{ padding: '8px 14px', fontSize: 12 }}
                  >
                    {saved ? (
                      <><Check className="w-3.5 h-3.5" /> Guardada</>
                    ) : saving ? (
                      <>Guardando…</>
                    ) : (
                      <><BookmarkCheck className="w-3.5 h-3.5" /> Guardar planeación</>
                    )}
                  </button>
                  <button
                    onClick={() => setActivePlan(null)}
                    className="btn-chunky btn-chunky-ghost"
                    style={{ padding: '8px 12px', fontSize: 12 }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Doc canvas with notebook lines */}
              <div className="notebook max-w-[760px] mx-auto px-12 py-12">
                <div className="flex items-center gap-3 mb-6">
                  <Star size={22} fill="var(--color-orange)" />
                  <span className="label" style={{ color: 'var(--color-mute)' }}>— {activePlan.type}</span>
                </div>
                <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}>
                  {activePlan.title}
                </h2>
                {activePlan.objective && (
                  <p className="serif-em mt-4 text-[17px]" style={{ color: 'var(--color-mute)', lineHeight: 1.6 }}>
                    {activePlan.objective}
                  </p>
                )}
                {activePlan.specific_objectives && activePlan.specific_objectives.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {activePlan.specific_objectives.map((o, i) => (
                      <li key={i} className="flex items-baseline gap-2 text-[14px] font-medium" style={{ color: 'var(--color-mute)' }}>
                        <span style={{ color: 'var(--color-orange)' }}>·</span>{o}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Sequence */}
                <div className="mt-12 space-y-8">
                  {(activePlan.sequence ?? []).map((fase, i) => (
                    <div
                      key={i}
                      className="relative pl-8"
                      style={{ borderLeft: '2px solid oklch(0.24 0.06 340 / 0.2)' }}
                    >
                      <div
                        className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full"
                        style={{ background: 'var(--color-paper)', border: '2px solid var(--color-plum)' }}
                      />
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="label" style={{ color: 'var(--color-mute)' }}>
                          {fase.phase}
                        </span>
                        <span className="chip" style={{ background: ideaColors[i % 3], fontSize: 10, padding: '2px 8px' }}>
                          {fase.duration} min
                        </span>
                      </div>
                      <p className="text-[15px] font-medium leading-[1.7]" style={{ color: 'var(--color-plum)' }}>
                        {fase.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Materials */}
                {(activePlan.materials ?? []).length > 0 && (
                  <div
                    className="mt-10 pt-8"
                    style={{ borderTop: '1.5px dashed oklch(0.24 0.06 340 / 0.3)' }}
                  >
                    <div className="label mb-4" style={{ color: 'var(--color-mute)' }}>— Materiales</div>
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {(activePlan.materials ?? []).map((m, i) => (
                        <li key={i} className="flex items-baseline gap-2 text-[14px] font-medium" style={{ color: 'var(--color-mute)' }}>
                          <span style={{ color: 'var(--color-orange)' }}>·</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Evaluation */}
                {activePlan.evaluation && (
                  <div className="mt-10 sticker p-6" style={{ background: 'var(--color-blush)' }}>
                    <div className="label mb-3" style={{ color: 'var(--color-orange)' }}>— Evaluación</div>
                    <p className="serif-em text-[17px]" style={{ lineHeight: 1.65 }}>
                      "{activePlan.evaluation}"
                    </p>
                  </div>
                )}

                {/* Reflection */}
                {activePlan.reflection && (
                  <div className="mt-6 sticker p-5" style={{ background: 'var(--color-sky)' }}>
                    <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>— Reflexión pedagógica</div>
                    <p className="text-[14px] font-medium leading-relaxed" style={{ color: 'var(--color-plum)' }}>
                      {activePlan.reflection}
                    </p>
                  </div>
                )}

                {/* Adaptations */}
                {activePlan.adaptations && activePlan.adaptations.length > 0 && (
                  <div className="mt-6">
                    <div className="label mb-3" style={{ color: 'var(--color-mute)' }}>— Adaptaciones</div>
                    <ul className="space-y-1">
                      {activePlan.adaptations.map((a, i) => (
                        <li key={i} className="flex items-baseline gap-2 text-[14px] font-medium" style={{ color: 'var(--color-mute)' }}>
                          <span style={{ color: 'var(--color-orange)' }}>·</span>{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Homework */}
                {activePlan.homework && (
                  <div className="mt-6 sticker p-5" style={{ background: 'var(--color-lilac)' }}>
                    <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>— Tarea</div>
                    <p className="text-[14px] font-medium leading-relaxed" style={{ color: 'var(--color-plum)' }}>
                      {activePlan.homework}
                    </p>
                  </div>
                )}

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </DashboardLayout>
  );
}