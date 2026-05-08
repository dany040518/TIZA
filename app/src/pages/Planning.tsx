import { Sparkles, Loader2, FileDown, X, Plus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/hooks/useAuth";
import { saveLessonPlan } from "@/lib/db";
import { generateLessonPlan } from "@/services/geminiService";
import DashboardLayout from "../components/layouts/DashboardLayout";
import html2pdf from "html2pdf.js";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────
interface PlanPhase {
  phase: string;
  description: string;
  duration: number;
}

interface PlanIdea {
  title: string;
  type: string;
  objective: string;
  description: string;
  duration: number;
  materials: string[];
  sequence: PlanPhase[];
  evaluation: string;
}

// ── Inline field components ──────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="eyebrow block mb-2">{children}</span>
  );
}

function FieldInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent border-0 border-b border-line py-2 text-[15px] text-ink focus:outline-none focus:border-orange transition-colors placeholder:text-mute-soft"
    />
  );
}

// ── Phase color map ──────────────────────────────────────────
const phaseAccent = ["text-blue-600", "text-orange", "text-moss"];

// ── Component ────────────────────────────────────────────────
export default function Planning() {
  const { user } = useAuth();

  const [subject, setSubject]     = useState("");
  const [grade, setGrade]         = useState("");
  const [topic, setTopic]         = useState("");
  const [context, setContext]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [ideas, setIdeas]         = useState<PlanIdea[]>([]);
  const [selected, setSelected]   = useState<PlanIdea | null>(null);
  const [activePlan, setActivePlan] = useState<PlanIdea | null>(null);

  const subjects = [
    "Matemáticas", "Ciencias Naturales", "Lengua/Español",
    "Ciencias Sociales", "Inglés", "Tecnología", "Arte", "Educación Física",
  ];
  const grades = ["Preescolar", "Primaria", "Secundaria", "Media", "Universidad"];

  // ── Handlers ────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setIdeas([]);
    setSelected(null);
    setActivePlan(null);

    try {
      const result = await generateLessonPlan(subject, grade, topic, context);
      if (result?.ideas) {
        setIdeas(result.ideas);

        if (user && result.ideas[0]) {
          saveLessonPlan({
            teacher_id: user.id,
            subject, grade, topic,
            title:      result.ideas[0].title,
            type:       result.ideas[0].type,
            objective:  result.ideas[0].objective,
            materials:  result.ideas[0].materials ?? [],
            sequence:   result.ideas[0].sequence ?? [],
            evaluation: result.ideas[0].evaluation,
          }).catch(console.error);
        }
      }
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUsePlan = async (idea: PlanIdea) => {
    setActivePlan(idea);
    setTimeout(() => {
      document.getElementById("plan-panel")?.scrollIntoView({ behavior: "smooth" });
    }, 80);

    if (user) {
      saveLessonPlan({
        teacher_id: user.id,
        subject, grade, topic,
        title:      idea.title,
        type:       idea.type,
        objective:  idea.objective,
        materials:  idea.materials ?? [],
        sequence:   idea.sequence ?? [],
        evaluation: idea.evaluation,
      }).catch(console.error);
    }
  };

  const handleDownloadPDF = () => {
    const el = document.getElementById("plan-panel");
    if (!el) return;
    const clone = el.cloneNode(true) as HTMLElement;
    clone.style.background = "#ffffff";
    clone.style.color = "#000000";
    clone.querySelectorAll("*").forEach((n: any) => {
      n.style.backgroundColor = "#ffffff";
      n.style.color = "#000000";
      n.style.borderColor = "#e5e7eb";
    });
    html2pdf()
      .from(clone)
      .set({
        margin: 0.5,
        filename: "planeacion-clase.pdf",
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="relative min-h-full">
        <div className="dawn-light opacity-40" />

        <div className="relative px-10 py-8 max-w-[1400px] mx-auto">

          {/* ── Page header ───────────────────────────────────── */}
          <div className="mb-8">
            <div className="eyebrow mb-3">— Laboratorio de planeación</div>
            <h1 className="font-serif font-light text-[42px] leading-[1.05] tracking-[-0.02em] text-ink">
              Genera tu{" "}
              <span className="italic">planeación de clase</span>
              <span className="text-orange">.</span>
            </h1>
            <p className="mt-2 text-[14px] text-mute max-w-[480px]">
              Describe el tema, el grado y el contexto. TIZA propone tres ideas muy diferentes — tú eliges.
            </p>
          </div>

          {/* ── Main grid ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">

            {/* LEFT: Input form */}
            <div>
              <div className="border border-line bg-paper p-6 space-y-6 sticky top-4">

                <div className="space-y-5">
                  {/* Topic */}
                  <div>
                    <FieldLabel>Tema principal</FieldLabel>
                    <FieldInput
                      value={topic}
                      onChange={setTopic}
                      placeholder="ej. Fotosíntesis y luz"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <FieldLabel>Área</FieldLabel>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {subjects.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSubject(s === subject ? "" : s)}
                          className={cn(
                            "px-2.5 py-1 text-[12px] border transition-colors",
                            subject === s
                              ? "border-orange bg-blush-mist text-ink"
                              : "border-line text-mute hover:border-mute hover:text-ink"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grade */}
                  <div>
                    <FieldLabel>Grado</FieldLabel>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {grades.map((g) => (
                        <button
                          key={g}
                          onClick={() => setGrade(g === grade ? "" : g)}
                          className={cn(
                            "px-2.5 py-1 text-[12px] border transition-colors",
                            grade === g
                              ? "border-orange bg-blush-mist text-ink"
                              : "border-line text-mute hover:border-mute hover:text-ink"
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Context */}
                  <div>
                    <FieldLabel>Contexto del aula</FieldLabel>
                    <textarea
                      rows={3}
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Número de estudiantes, necesidades especiales, recursos disponibles…"
                      className="w-full bg-transparent border border-line p-2.5 text-[13.5px] leading-relaxed text-ink resize-none focus:outline-none focus:border-orange transition-colors placeholder:text-mute-soft mt-1"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading || !topic.trim()}
                  className={cn(
                    "w-full flex items-center justify-center gap-2.5 py-3 text-[13.5px] transition-colors",
                    loading || !topic.trim()
                      ? "bg-line text-mute cursor-not-allowed"
                      : "bg-ink text-paper hover:bg-orange"
                  )}
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
                <div className="border border-dashed border-line rounded-sm p-16 flex flex-col items-center justify-center text-center min-h-[300px]">
                  <div className="font-serif font-light text-[28px] text-mute-soft mb-3">
                    La planeación aparece aquí.
                  </div>
                  <p className="text-[13px] text-mute max-w-[280px]">
                    Describe el tema a la izquierda y pulsa "Generar ideas".
                  </p>
                </div>
              )}

              {/* Loading shimmer */}
              {loading && (
                <div className="border border-line bg-paper p-8 space-y-4 animate-pulse">
                  <div className="eyebrow text-orange flex items-center gap-2">
                    <span className="ink-pulse" /> TIZA está pensando…
                  </div>
                  <div className="h-4 bg-line-soft rounded-sm w-3/4" />
                  <div className="h-4 bg-line-soft rounded-sm w-1/2" />
                  <div className="h-4 bg-line-soft rounded-sm w-2/3" />
                </div>
              )}

              {/* Ideas grid */}
              {ideas.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Ideas list */}
                  <div className="space-y-3">
                    <div className="eyebrow mb-4">— {ideas.length} ideas generadas</div>
                    {ideas.map((idea, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => setSelected(idea)}
                        className={cn(
                          "w-full text-left p-5 border transition-all",
                          selected === idea
                            ? "border-orange bg-gradient-to-b from-paper to-blush-mist/50"
                            : "border-line bg-paper hover:border-mute"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <span className={cn(
                            "font-mono text-[10px] tracking-[0.16em] uppercase",
                            selected === idea ? "text-orange" : "text-mute"
                          )}>
                            0{i + 1} · {idea.type}
                          </span>
                          {selected === idea && <span className="ink-pulse mt-1" />}
                        </div>
                        <h3 className="font-serif text-[18px] leading-snug mt-3 tracking-[-0.01em]">
                          {idea.title}
                        </h3>
                        <p className="text-[13px] text-mute mt-2 leading-relaxed line-clamp-2">
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
                          className="border border-line bg-paper p-6 h-full flex flex-col"
                        >
                          <div className="eyebrow text-orange mb-1">— Plan seleccionado</div>
                          <h2 className="font-serif text-[22px] leading-snug tracking-[-0.01em] mt-1">
                            {selected.title}
                          </h2>
                          <p className="text-[13px] text-mute mt-2 leading-relaxed">
                            {selected.objective}
                          </p>

                          <div className="mt-5 space-y-4 flex-1">
                            {(selected.sequence || []).map((fase, i) => (
                              <div key={i} className="flex gap-3">
                                <div className="flex flex-col items-center shrink-0">
                                  <span className={cn(
                                    "font-mono text-[10px] tracking-[0.12em] font-medium",
                                    phaseAccent[i % phaseAccent.length]
                                  )}>
                                    {String(i + 1).padStart(2, "0")}
                                  </span>
                                  {i < (selected.sequence?.length ?? 0) - 1 && (
                                    <div className="w-px flex-1 bg-line-soft mt-1" />
                                  )}
                                </div>
                                <div className="pb-4">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-[13.5px] font-medium text-ink">
                                      {fase.phase}
                                    </span>
                                    <span className="font-mono text-[10px] text-mute">
                                      {fase.duration} min
                                    </span>
                                  </div>
                                  <p className="text-[13px] text-mute mt-1 leading-relaxed">
                                    {fase.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-5 pt-4 border-t border-line-soft">
                            <button
                              onClick={() => handleUsePlan(selected)}
                              className="w-full bg-ink text-paper py-2.5 text-[13px] hover:bg-orange transition-colors"
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
                          className="border border-dashed border-line flex items-center justify-center h-full min-h-[200px]"
                        >
                          <p className="text-[13px] text-mute italic font-serif">
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

          {/* ── Active plan document ────────────────────────── */}
          <AnimatePresence>
            {activePlan && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                id="plan-panel"
                className="mt-10 border border-line bg-paper"
              >
                {/* Doc bar */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-line bg-paper-warm/60">
                  <div className="flex items-center gap-3">
                    <span className="eyebrow text-orange flex items-center gap-2">
                      <span className="ink-pulse" /> Planeación activa
                    </span>
                    {subject && grade && (
                      <span className="font-mono text-[10.5px] text-mute">
                        {subject} · {grade} · {activePlan.duration} min
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-1.5 text-[12.5px] text-mute hover:text-ink transition-colors border border-line px-3 py-1.5"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      PDF
                    </button>
                    <button
                      onClick={() => setActivePlan(null)}
                      className="text-mute hover:text-ink transition-colors p-1.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Doc canvas */}
                <div className="max-w-[760px] mx-auto px-12 py-12">
                  <div className="eyebrow mb-4">— {activePlan.type}</div>
                  <h2 className="font-serif font-light text-[48px] leading-[1.05] tracking-[-0.02em]">
                    {activePlan.title}
                  </h2>
                  <p className="mt-4 font-serif text-[18px] text-mute leading-relaxed italic font-light">
                    {activePlan.objective}
                  </p>

                  {/* Sequence blocks */}
                  <div className="mt-12 space-y-8">
                    {(activePlan.sequence || []).map((fase, i) => (
                      <div
                        key={i}
                        className="group relative pl-8 border-l border-line hover:border-orange transition-colors"
                      >
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-paper border border-line group-hover:bg-orange group-hover:border-orange transition-all" />
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="font-mono text-[10.5px] tracking-[0.14em] text-mute uppercase">
                            {fase.phase} · {fase.duration} min
                          </span>
                        </div>
                        <p className="text-[15px] leading-[1.7] text-ink/85">
                          {fase.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Materials */}
                  {activePlan.materials?.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-line-soft">
                      <div className="eyebrow mb-4">— Materiales</div>
                      <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
                        {activePlan.materials.map((m, i) => (
                          <li key={i} className="flex items-baseline gap-2 text-[14px] text-mute">
                            <span className="font-mono text-[10px] text-orange">·</span>
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Evaluation */}
                  <div className="mt-10 p-6 bg-blush-mist/50 border border-blush-air">
                    <div className="eyebrow text-orange mb-3">— Evaluación</div>
                    <p className="font-serif text-[17px] leading-[1.55] italic font-light">
                      "{activePlan.evaluation}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </DashboardLayout>
  );
}
