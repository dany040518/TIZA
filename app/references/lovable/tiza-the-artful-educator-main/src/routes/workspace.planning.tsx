import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Squiggle } from "@/components/tiza/Mark";

export const Route = createFileRoute("/workspace/planning")({
  component: Planning,
  head: () => ({ meta: [{ title: "Planning · tiza" }] }),
});

function Planning() {
  return (
    <main className="mx-auto max-w-[1320px] px-6 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
      {/* Notebook canvas */}
      <section className="sticker sticker-lg notebook p-8 md:p-12">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="chip" style={{ background: "var(--color-butter)" }}>9A · Thursday May 16</span>
            <span className="chip" style={{ background: "var(--color-mint)" }}>50 minutes</span>
          </div>
          <Squiggle color="var(--color-orange)" className="w-24 h-3" />
        </div>

        <h1 className="font-display mt-6 m-0" style={{ fontSize: "clamp(40px, 5.5vw, 68px)" }}>
          Cellular respiration — <span style={{ fontStyle: "italic", color: "var(--color-orange)" }}>why your bones are warm</span>.
        </h1>
        <div className="font-hand mt-3" style={{ fontSize: 28, color: "var(--color-mute)" }}>a session paced for after lunch ✿</div>

        <div className="mt-10 space-y-6">
          <Field k="Objective" v="Students can describe how glucose becomes ATP, and connect it to one observation from their own day." />
          <Field k="Materials" v="Worksheet 4.2 · two oranges · last week's mitochondria diagram." />

          {/* AI block */}
          <div className="sticker p-6" style={{ background: "var(--color-blush)" }}>
            <div className="flex items-center gap-2 label" style={{ color: "var(--color-orange)" }}>
              <Star size={18} fill="var(--color-orange)" /> a first pass · refine inline
            </div>
            <p className="font-display mt-4 m-0" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.4 }}>
              Open with the orange demonstration — students hold the fruit, predict where the energy &ldquo;goes.&rdquo; Move to the equation only after the prediction. Last week 9A struggled with chemistry first; the warmth-of-bones framing earned more of them.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button className="btn-chunky btn-chunky-plum" style={{ padding: "8px 14px", fontSize: 12 }}>Use this opening</button>
              <button className="btn-chunky" style={{ padding: "8px 14px", fontSize: 12, background: "var(--color-paper)" }}>Rewrite — keep the spirit</button>
              <button className="btn-chunky btn-chunky-ghost" style={{ padding: "8px 14px", fontSize: 12 }}>Discard</button>
            </div>
          </div>

          <Field k="Activity" v={<em style={{ color: "var(--color-mute)" }}>— write here, or let tiza sketch a path —</em>} />
          <Field k="Close" v={<em style={{ color: "var(--color-mute)" }}>— exit ticket: one sentence about a warm thing.</em>} />
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/workspace/save" className="btn-chunky btn-chunky-primary" style={{ padding: "16px 24px", fontSize: 15 }}>
            Save & publish to 9A →
          </Link>
          <Link to="/workspace" className="btn-chunky btn-chunky-ghost">Back to today</Link>
        </div>
      </section>

      {/* Side: context */}
      <aside className="space-y-5">
        <div className="sticker p-6" style={{ background: "var(--color-mint)" }}>
          <div className="label" style={{ color: "var(--color-mute)" }}>why this draft</div>
          <h6 className="font-display mt-2 m-0" style={{ fontSize: 22 }}>
            Last Thursday, 9A&rsquo;s energy fell off after minute 28.
          </h6>
          <p className="text-[14px] mt-3 font-medium" style={{ color: "var(--color-plum)" }}>
            The orange demo restores attention. Drawn from your own pacing notes — not a generic recommendation.
          </p>
        </div>

        <div className="sticker p-6" style={{ background: "var(--color-paper)" }}>
          <div className="label mb-3" style={{ color: "var(--color-mute)" }}>9A pulse</div>
          {[
            ["Comprehension", "88%", "var(--color-mint)"],
            ["Engagement (Tue)", "71%", "var(--color-butter)"],
            ["At-risk", "2 · soft", "var(--color-orange)"],
            ["Attendance", "94%", "var(--color-mint)"],
          ].map(([k, v, c]) => (
            <div key={k} className="flex justify-between items-center py-2.5" style={{ borderBottom: "1.5px dashed var(--color-plum)" }}>
              <span className="text-[14px] font-semibold">{k}</span>
              <span className="chip" style={{ background: c, fontSize: 11, padding: "3px 10px" }}>{v}</span>
            </div>
          ))}
        </div>

        <div className="sticker p-6" style={{ background: "var(--color-lilac)" }}>
          <div className="font-hand" style={{ fontSize: 26, color: "var(--color-orange)" }}>quiet suggestion ✿</div>
          <h6 className="font-display mt-2 m-0" style={{ fontSize: 22 }}>Pair Sofía with Mateo for the demo.</h6>
          <p className="text-[14px] mt-3 font-medium" style={{ color: "var(--color-plum)" }}>
            They&rsquo;ve worked well together twice. A small task with a familiar partner usually helps.
          </p>
        </div>
      </aside>
    </main>
  );
}

function Field({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-5 items-start">
      <div className="label pt-2" style={{ color: "var(--color-mute)" }}>{k}</div>
      <div className="font-display" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.45 }}>{v}</div>
    </div>
  );
}
