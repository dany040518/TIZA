import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Blob } from "@/components/tiza/Mark";

export const Route = createFileRoute("/workspace/save")({
  component: Saved,
  head: () => ({ meta: [{ title: "Saved · tiza" }] }),
});

function Saved() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 md:px-10 py-16 relative">
      <Blob color="var(--color-blush)" className="absolute -z-10" style={{ top: 40, right: -100, width: 320, height: 320, transform: "rotate(15deg)" }} />
      <Blob color="var(--color-mint)" className="absolute -z-10" style={{ top: 320, left: -120, width: 280, height: 280, transform: "rotate(-20deg)" }} />

      <div className="sticker sticker-lg p-10 md:p-16 text-center" style={{ background: "var(--color-butter)" }}>
        <Star size={64} fill="var(--color-orange)" />
        <h1 className="font-display mt-6 m-0 mx-auto" style={{ fontSize: "clamp(56px, 8vw, 120px)" }}>
          Done.
        </h1>
        <p className="font-display mt-3" style={{ fontSize: "clamp(24px, 3vw, 36px)", fontStyle: "italic", color: "var(--color-orange)" }}>
          Plan published to 9A.
        </p>
        <p className="font-display mt-6 mx-auto max-w-[520px]" style={{ fontSize: 20, fontWeight: 400, color: "var(--color-plum)" }}>
          Saved at 09:14, ready for Thursday. We won&rsquo;t bother you about it again.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[
          { k: "Format", v: "PDF · printable", c: "var(--color-blush)" },
          { k: "Shared with", v: "9A · 28 students", c: "var(--color-mint)" },
          { k: "Backup", v: "Library · auto", c: "var(--color-lilac)" },
        ].map(d => (
          <div key={d.k} className="sticker p-6" style={{ background: d.c }}>
            <div className="label" style={{ color: "var(--color-mute)" }}>{d.k}</div>
            <div className="font-display mt-3" style={{ fontSize: 26 }}>{d.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center gap-3 flex-wrap">
        <a href="#" className="btn-chunky btn-chunky-primary" style={{ padding: "16px 24px", fontSize: 15 }}>Download PDF ↓</a>
        <a href="#" className="btn-chunky btn-chunky-blush" style={{ padding: "16px 24px", fontSize: 15 }}>Email to myself</a>
        <Link to="/workspace" className="btn-chunky btn-chunky-ghost" style={{ padding: "16px 24px", fontSize: 15 }}>Back to today</Link>
      </div>

      <p className="font-hand text-center mt-16" style={{ fontSize: 32, color: "var(--color-orange)" }}>
        47 lesson plans this semester. ✿
      </p>
    </main>
  );
}
