import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mark, Star, Blob } from "@/components/tiza/Mark";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({ meta: [{ title: "Set up · tiza" }] }),
});

const STEPS = [
  { k: "name", lbl: "your name", placeholder: "Valentina", help: "What should we call you each morning?", color: "var(--color-blush)" },
  { k: "subject", lbl: "what you teach", placeholder: "Biology", help: "We'll tune the workspace to your subject.", color: "var(--color-butter)" },
  { k: "classes", lbl: "your classes", placeholder: "9A · 9B · 10A", help: "A short list. You can grow it later.", color: "var(--color-mint)" },
  { k: "rhythm", lbl: "your rhythm", placeholder: "Tue & Thu mornings", help: "So tiza knows your week.", color: "var(--color-lilac)" },
] as const;

function Onboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const cur = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <div className="min-h-screen text-plum relative overflow-hidden">
      <Blob color="var(--color-blush)" className="absolute -z-10" style={{ top: -80, right: -80, width: 380, height: 380, transform: "rotate(20deg)" }} />
      <Blob color="var(--color-mint)" className="absolute -z-10" style={{ bottom: -120, left: -100, width: 360, height: 360, transform: "rotate(-15deg)" }} />

      <header className="mx-auto max-w-[1200px] px-6 md:px-10 pt-8 flex items-center justify-between">
        <Link to="/" className="no-underline text-plum"><Mark /></Link>
        <div className="chip" style={{ background: "var(--color-paper)" }}>step {step + 1} of {STEPS.length}</div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 md:px-10 mt-12 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
        {/* Card */}
        <section className="sticker sticker-lg p-8 md:p-12" style={{ background: cur.color }}>
          <div className="flex items-center gap-3">
            <Star size={28} fill="var(--color-orange)" />
            <span className="label">{cur.lbl}</span>
          </div>
          <h1 className="font-display mt-6 m-0" style={{ fontSize: "clamp(40px, 6vw, 76px)" }}>
            {step === 0 && <>What should tiza <span style={{ fontStyle: "italic", color: "var(--color-orange)" }}>call you</span>?</>}
            {step === 1 && <>What do you <span style={{ fontStyle: "italic", color: "var(--color-orange)" }}>teach</span>?</>}
            {step === 2 && <>Which classes are <span style={{ fontStyle: "italic", color: "var(--color-orange)" }}>yours</span>?</>}
            {step === 3 && <>And <span style={{ fontStyle: "italic", color: "var(--color-orange)" }}>when</span>?</>}
          </h1>
          <p className="font-display mt-5 max-w-[480px]" style={{ fontSize: 22, fontWeight: 400, color: "var(--color-plum)" }}>{cur.help}</p>

          <div className="mt-10">
            <input
              autoFocus
              value={data[cur.k] ?? ""}
              placeholder={cur.placeholder}
              onChange={e => setData({ ...data, [cur.k]: e.target.value })}
              className="w-full bg-paper outline-none font-display rounded-2xl"
              style={{
                fontSize: 32,
                padding: "20px 24px",
                background: "var(--color-paper)",
                border: "2px solid var(--color-plum)",
                boxShadow: "3px 3px 0 var(--color-plum)",
                letterSpacing: "-0.01em",
              }}
            />
          </div>

          <div className="mt-10 flex items-center gap-4">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="btn-chunky btn-chunky-ghost">← back</button>
            )}
            <button
              className="btn-chunky btn-chunky-primary ml-auto"
              style={{ padding: "16px 26px", fontSize: 16 }}
              onClick={() => last ? navigate({ to: "/workspace" }) : setStep(step + 1)}
            >
              {last ? "Open my workspace" : "Continue"} →
            </button>
          </div>
        </section>

        {/* Recap */}
        <aside className="space-y-4">
          <div className="sticker p-6" style={{ background: "var(--color-paper)" }}>
            <div className="font-hand" style={{ fontSize: 28, color: "var(--color-orange)" }}>a note from tiza ✿</div>
            <p className="font-display mt-3 m-0" style={{ fontSize: 22, fontWeight: 500 }}>
              We&rsquo;ll only ask what we need. Everything else can wait until you&rsquo;re inside.
            </p>
          </div>

          {STEPS.map((s, i) => (
            <div
              key={s.k}
              className="sticker p-5 flex items-center justify-between gap-4"
              style={{
                background: i < step ? s.color : "var(--color-paper)",
                opacity: i > step ? 0.55 : 1,
              }}
            >
              <div>
                <div className="label" style={{ color: "var(--color-mute)" }}>0{i + 1} · {s.lbl}</div>
                <div className="font-display mt-1" style={{ fontSize: 22 }}>
                  {data[s.k] || (i === step ? "—" : "·")}
                </div>
              </div>
              {i < step && <Star size={22} fill="var(--color-orange)" />}
            </div>
          ))}
        </aside>
      </main>
    </div>
  );
}
