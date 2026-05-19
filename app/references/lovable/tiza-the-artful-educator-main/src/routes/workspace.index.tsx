import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Squiggle } from "@/components/tiza/Mark";

export const Route = createFileRoute("/workspace/")({
  component: Today,
});

const ROWS = [
  { time: "09:30", tag: "9A · Biology", title: "Photosynthesis lab", note: "Plan ready · 28 students", color: "var(--color-blush)", action: "Open lesson" },
  { time: "11:00", tag: "a draft from tiza", title: "Cellular respiration — first pass for Thursday", note: "12 minutes to refine · drawn from last week", color: "var(--color-butter)", action: "Open draft", ai: true, link: "/workspace/planning" as const },
  { time: "14:00", tag: "9B · grading", title: "Eleven essays on the carbon cycle", note: "two need a closer look · ~28 minutes", color: "var(--color-mint)", action: "Begin" },
  { time: "16:30", tag: "soft · parents", title: "Reply to Mateo's mother — already drafted", note: "3 minutes · waiting your eyes", color: "var(--color-lilac)", action: "Read" },
];

function Today() {
  return (
    <main className="mx-auto max-w-[1320px] px-6 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
      <section>
        {/* Greeting card */}
        <div className="sticker sticker-lg p-8 md:p-10 mb-8" style={{ background: "var(--color-paper)" }}>
          <div className="flex items-center gap-3">
            <Star size={26} fill="var(--color-orange)" />
            <span className="label">tuesday · may 14</span>
          </div>
          <h1 className="font-display mt-5 m-0" style={{ fontSize: "clamp(44px, 6vw, 78px)" }}>
            Good morning, <span style={{ color: "var(--color-orange)", fontStyle: "italic" }}>Valentina</span>.
          </h1>
          <p className="font-display mt-4 m-0" style={{ fontSize: 26, fontWeight: 400, color: "var(--color-mute)" }}>
            Three things actually need you today. The rest is handled.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="chip" style={{ background: "var(--color-mint)" }}>2 classes</span>
            <span className="chip" style={{ background: "var(--color-butter)" }}>11 essays</span>
            <span className="chip" style={{ background: "var(--color-blush)" }}>light load</span>
          </div>
        </div>

        {/* Today list — chunky tilted cards */}
        <div className="space-y-4">
          {ROWS.map((r, i) => (
            <div
              key={i}
              className="sticker sticker-hover p-6 md:p-7 grid grid-cols-[88px_1fr_auto] gap-5 items-center"
              style={{ background: r.color, transform: `rotate(${i % 2 === 0 ? -0.4 : 0.4}deg)` }}
            >
              <div className="font-display" style={{ fontSize: 32 }}>{r.time}</div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="label" style={{ color: r.ai ? "var(--color-orange)" : "var(--color-mute)" }}>
                    {r.ai && "✿ "}{r.tag}
                  </span>
                </div>
                <div className="font-display" style={{ fontSize: 26, lineHeight: 1.15 }}>{r.title}</div>
                <div className="text-[13px] font-medium mt-1.5" style={{ color: "var(--color-mute)" }}>{r.note}</div>
              </div>
              <div>
                {r.link ? (
                  <Link to={r.link} className="btn-chunky btn-chunky-plum" style={{ padding: "10px 16px", fontSize: 13 }}>
                    {r.action} →
                  </Link>
                ) : (
                  <button className="btn-chunky" style={{ padding: "10px 16px", fontSize: 13, background: "var(--color-paper)" }}>
                    {r.action} →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Right: tiza voice */}
      <aside className="space-y-5">
        <div className="sticker sticker-lg p-7" style={{ background: "var(--color-plum)", color: "var(--color-cream)", borderColor: "var(--color-cream)" }}>
          <div className="font-hand" style={{ fontSize: 26, color: "var(--color-butter)" }}>from tiza ✿</div>
          <p className="font-display mt-2 m-0" style={{ fontSize: 26, fontWeight: 500, color: "var(--color-cream)" }}>
            A quiet morning. <span style={{ fontStyle: "italic", color: "var(--color-blush)" }}>You&rsquo;re ahead by an hour.</span>
          </p>
        </div>

        <VoiceCard tag="observation" bg="var(--color-blush)"
          body="Sofía missed three Biology sessions this month. Worth a glance before Thursday." actions={["See her thread", "Dismiss"]} />
        <VoiceCard tag="quiet brief" bg="var(--color-mint)"
          body="Tomorrow is lighter. A good day to write the trimester report — outline already drafted." actions={["Open outline", "Not now"]} />

        <div className="sticker p-5 flex items-center gap-3" style={{ background: "var(--color-butter)" }}>
          <Star size={26} fill="var(--color-orange)" />
          <div className="font-hand" style={{ fontSize: 24 }}>you wrote 47 lesson plans this semester</div>
        </div>

        <Squiggle color="var(--color-orange)" className="w-32 h-3 ml-1" />
      </aside>
    </main>
  );
}

function VoiceCard({ tag, bg, body, actions }: { tag: string; bg: string; body: string; actions: string[] }) {
  return (
    <div className="sticker p-6" style={{ background: bg }}>
      <div className="flex items-center gap-2 label" style={{ color: "var(--color-orange)" }}>
        <span aria-hidden className="rounded-full" style={{ width: 8, height: 8, background: "var(--color-orange)" }} />
        {tag}
      </div>
      <p className="font-display mt-3 m-0" style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.3 }}>{body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((a, i) => (
          <span key={a} className="chip" style={{ background: i === 0 ? "var(--color-paper)" : "transparent", fontSize: 12 }}>{a}</span>
        ))}
      </div>
    </div>
  );
}
