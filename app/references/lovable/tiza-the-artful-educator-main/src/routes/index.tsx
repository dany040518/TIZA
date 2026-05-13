import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/tiza/TopBar";
import { Mark, Squiggle, Star, Blob } from "@/components/tiza/Mark";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "tiza — a warm workspace for teachers" },
      { name: "description", content: "tiza protects the human in the teacher. Calm, expressive software for educators." },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen text-plum">
      <TopBar active="home" />

      {/* Hero */}
      <section className="relative mx-auto max-w-[1320px] px-6 md:px-10 pt-10 md:pt-16 pb-24">
        <Blob color="var(--color-blush)" className="absolute -z-10" style={{ top: 40, right: -60, width: 360, height: 360, transform: "rotate(-12deg)" }} />
        <Blob color="var(--color-butter)" className="absolute -z-10" style={{ top: 280, left: -80, width: 240, height: 240, transform: "rotate(18deg)" }} />

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-end">
          <div>
            <span className="chip" style={{ background: "var(--color-mint)" }}>
              <span className="rounded-full" style={{ width: 8, height: 8, background: "var(--color-orange)" }} />
              Now welcoming teachers
            </span>
            <h1 className="font-display mt-7 m-0" style={{ fontSize: "clamp(58px, 9.5vw, 148px)" }}>
              <span>Teach more.</span><br />
              <span style={{ fontStyle: "italic", color: "var(--color-orange)" }}>Type less.</span>
              <span style={{ position: "relative", display: "inline-block", marginLeft: 12 }}>
                <Star size={56} />
              </span>
            </h1>
            <p className="font-display mt-8 max-w-[560px]" style={{ fontSize: 26, fontWeight: 400, lineHeight: 1.25, color: "var(--color-mute)" }}>
              tiza is a warm workspace built for the people who actually
              <span className="font-hand mx-2" style={{ fontSize: 34, color: "var(--color-orange)" }}>show up</span>
              for kids — not the ones who design forms.
            </p>

            <div className="mt-10 flex gap-4 flex-wrap">
              <Link to="/onboarding" className="btn-chunky btn-chunky-primary" style={{ padding: "18px 28px", fontSize: 17 }}>
                Make me a workspace
              </Link>
              <Link to="/workspace" className="btn-chunky btn-chunky-blush" style={{ padding: "18px 28px", fontSize: 17 }}>
                Peek inside ↗
              </Link>
            </div>
          </div>

          {/* Stacked sticker preview */}
          <div className="relative mt-6 lg:mt-0 h-[460px]">
            <div className="sticker sticker-lg absolute" style={{ top: 0, right: 30, width: 280, padding: 22, background: "var(--color-blush)", transform: "rotate(-5deg)" }}>
              <div className="label" style={{ color: "var(--color-mute)" }}>Tuesday · 9:30</div>
              <div className="font-display mt-2" style={{ fontSize: 30 }}>Photosynthesis lab</div>
              <div className="mt-3 flex items-center gap-2">
                <span className="chip" style={{ background: "var(--color-paper)", fontSize: 11, padding: "4px 10px" }}>9A · Biology</span>
                <span className="chip" style={{ background: "var(--color-mint)", fontSize: 11, padding: "4px 10px" }}>ready</span>
              </div>
            </div>

            <div className="sticker sticker-lg absolute" style={{ top: 130, right: 130, width: 300, padding: 22, background: "var(--color-butter)", transform: "rotate(4deg)" }}>
              <div className="flex items-center gap-2">
                <Star size={22} fill="var(--color-orange)" />
                <span className="label">a draft from tiza</span>
              </div>
              <div className="font-display mt-3" style={{ fontSize: 28, fontStyle: "italic" }}>
                &ldquo;Why are your bones warm?&rdquo;
              </div>
              <div className="mt-2 text-[13px]" style={{ color: "var(--color-mute)" }}>
                A first pass for Thursday — drawn from your own pacing notes.
              </div>
            </div>

            <div className="sticker absolute" style={{ top: 310, right: 60, width: 260, padding: 18, background: "var(--color-mint)", transform: "rotate(-3deg)" }}>
              <div className="font-hand" style={{ fontSize: 26, color: "var(--color-plum)" }}>
                you wrote 47 lesson plans this semester ✿
              </div>
            </div>
          </div>
        </div>

        {/* Stat belt */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            ["440 hrs", "given back to you, every year", "var(--color-blush)"],
            ["3 things", "that actually need you today", "var(--color-butter)"],
            ["0", "dashboards, ever", "var(--color-mint)"],
            ["1", "calm canvas", "var(--color-lilac)"],
          ].map(([n, l, bg]) => (
            <div key={l} className="sticker p-5" style={{ background: bg }}>
              <div className="font-display" style={{ fontSize: 44 }}>{n}</div>
              <div className="text-[13px] font-semibold mt-1" style={{ color: "var(--color-plum)" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Belief band */}
      <section className="relative py-24" style={{ background: "var(--color-plum)", color: "var(--color-cream)" }}>
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="flex items-center gap-4 mb-10">
            <span className="chip" style={{ background: "var(--color-orange)", color: "var(--color-cream)", borderColor: "var(--color-cream)" }}>what we believe</span>
            <Squiggle color="var(--color-butter)" className="w-32 h-3" />
          </div>
          <h2 className="font-display max-w-[1100px] m-0" style={{ fontSize: "clamp(40px, 6vw, 84px)" }}>
            Software shouldn&rsquo;t make teachers <span style={{ color: "var(--color-blush)", fontStyle: "italic" }}>smaller</span>.
            It should make their <span style={{ color: "var(--color-butter)" }}>days bigger</span>.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              { n: "01", t: "We protect the human", p: "tiza never replaces your judgment. It clears the room so you can think.", c: "var(--color-blush)" },
              { n: "02", t: "We refuse urgency", p: "No notifications begging for attention. No red dots. No streaks.", c: "var(--color-butter)" },
              { n: "03", t: "We design for relief", p: "The first feeling each morning should be a deep breath, not a to-do list.", c: "var(--color-mint)" },
            ].map(b => (
              <div key={b.n} className="sticker sticker-lg p-7" style={{ background: b.c, color: "var(--color-plum)" }}>
                <div className="font-display" style={{ fontSize: 18, color: "var(--color-mute)" }}>belief {b.n}</div>
                <div className="font-display mt-3" style={{ fontSize: 32 }}>{b.t}</div>
                <p className="mt-4 text-[15px] font-medium" style={{ color: "var(--color-plum)" }}>{b.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you do with tiza */}
      <section className="mx-auto max-w-[1320px] px-6 md:px-10 py-24">
        <div className="flex flex-wrap items-end justify-between gap-8 mb-14">
          <h2 className="font-display m-0" style={{ fontSize: "clamp(40px, 5.5vw, 72px)", maxWidth: 680 }}>
            A whole week of teaching, in a workspace that <span className="squiggle" style={{ fontStyle: "italic" }}>feels like yours</span>.
          </h2>
          <Link to="/workspace" className="btn-chunky btn-chunky-butter">See the workspace →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <FeatureCard span="md:col-span-7" bg="var(--color-blush)" tag="planning"
            title="Lessons that start halfway done"
            body="Open the canvas and a first draft is already there — pulled from your last class, not a generic template. Edit it like a notebook." />
          <FeatureCard span="md:col-span-5" bg="var(--color-mint)" tag="grading"
            title="Eleven essays, paced"
            body="tiza reads first, flags two for your eyes, and gets out of the way." />
          <FeatureCard span="md:col-span-5" bg="var(--color-butter)" tag="attendance"
            title="Roll call as a single soft tap"
            body="One row per student. Set in big serifs. Done in under a minute." />
          <FeatureCard span="md:col-span-7" bg="var(--color-lilac)" tag="parents & reports"
            title="Replies your evenings get back"
            body="Drafted in your voice, ready to send. tiza never speaks for you — it just types faster." />
        </div>
      </section>

      {/* Voice band */}
      <section id="stories" className="mx-auto max-w-[1320px] px-6 md:px-10 pb-24">
        <div className="sticker sticker-lg p-10 md:p-16 relative overflow-hidden" style={{ background: "var(--color-paper)" }}>
          <Blob color="var(--color-blush)" className="absolute -z-0" style={{ top: -40, right: -40, width: 240, height: 240 }} />
          <span className="chip" style={{ background: "var(--color-orange)", color: "var(--color-cream)" }}>a teacher&rsquo;s desk</span>
          <p className="font-display relative mt-8 m-0" style={{ fontSize: "clamp(28px, 3.5vw, 48px)", maxWidth: 880, fontWeight: 500 }}>
            &ldquo;I used to spend Sunday nights making slides. Now I spend them
            <span className="font-hand mx-2" style={{ fontSize: "1.3em", color: "var(--color-orange)" }}>reading my book</span>
            again.&rdquo;
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="rounded-full sticker" style={{ width: 52, height: 52, background: "var(--color-butter)", boxShadow: "3px 3px 0 var(--color-plum)" }} />
            <div>
              <div className="font-semibold">Valentina A.</div>
              <div className="text-[13px]" style={{ color: "var(--color-mute)" }}>Biology · 8 years teaching · Mexico City</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section id="schools" className="py-24" style={{ background: "var(--color-orange)", color: "var(--color-cream)" }}>
        <div className="mx-auto max-w-[1320px] px-6 md:px-10 text-center">
          <Star size={56} fill="var(--color-butter)" />
          <h2 className="font-display mt-6 m-0 mx-auto" style={{ fontSize: "clamp(48px, 7vw, 110px)", maxWidth: 1000 }}>
            Bring tiza to your <span style={{ fontStyle: "italic", color: "var(--color-blush)" }}>desk</span>.
          </h2>
          <p className="font-display mx-auto mt-6 max-w-[560px]" style={{ fontSize: 22, fontWeight: 400, color: "var(--color-cream)", opacity: 0.95 }}>
            Free for individual teachers. Schools — get in touch and we&rsquo;ll find you a calm Tuesday.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <Link to="/onboarding" className="btn-chunky btn-chunky-blush" style={{ padding: "18px 28px", fontSize: 17 }}>
              Set up my workspace →
            </Link>
            <a href="mailto:hello@tiza.app" className="btn-chunky" style={{ padding: "18px 28px", fontSize: 17, background: "var(--color-cream)" }}>
              Talk to schools team
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-[1320px] px-6 md:px-10 py-12 flex flex-wrap items-center justify-between gap-6">
        <Mark size={24} />
        <span className="text-[13px] font-semibold" style={{ color: "var(--color-mute)" }}>
          made with care for teachers · © {new Date().getFullYear()}
        </span>
        <span className="font-hand" style={{ fontSize: 22, color: "var(--color-orange)" }}>thank you for teaching ✿</span>
      </footer>
    </div>
  );
}

function FeatureCard({ span, bg, tag, title, body }: { span: string; bg: string; tag: string; title: string; body: string }) {
  return (
    <div className={`${span} sticker sticker-lg sticker-hover p-8`} style={{ background: bg }}>
      <span className="chip" style={{ background: "var(--color-paper)" }}>{tag}</span>
      <h3 className="font-display mt-5 m-0" style={{ fontSize: 36 }}>{title}</h3>
      <p className="mt-4 text-[15px] font-medium max-w-[460px]" style={{ color: "var(--color-plum)" }}>{body}</p>
    </div>
  );
}
