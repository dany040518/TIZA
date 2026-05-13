import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Mark, Star } from "@/components/tiza/Mark";

export const Route = createFileRoute("/workspace")({
  component: WorkspaceLayout,
  head: () => ({ meta: [{ title: "Workspace · tiza" }] }),
});

function WorkspaceLayout() {
  const { pathname } = useLocation();
  const tabs = [
    { to: "/workspace", label: "Today", emoji: "✿", bg: "var(--color-blush)" },
    { to: "/workspace/planning", label: "Planning", emoji: "✎", bg: "var(--color-butter)" },
    { to: "/workspace/save", label: "Save & share", emoji: "★", bg: "var(--color-mint)" },
  ] as const;

  return (
    <div className="min-h-screen text-plum">
      {/* Top bar with chunky pill tabs */}
      <header className="mx-auto max-w-[1320px] px-6 md:px-10 pt-7 pb-2 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="no-underline text-plum"><Mark /></Link>

        <nav className="sticker flex items-center gap-1.5 p-1.5" style={{ boxShadow: "3px 3px 0 var(--color-plum)" }}>
          {tabs.map(t => {
            const active = t.to === "/workspace" ? pathname === "/workspace" : pathname.startsWith(t.to);
            return (
              <Link key={t.to} to={t.to} className="px-4 py-2 rounded-full no-underline font-semibold text-[14px] flex items-center gap-2"
                style={{ background: active ? t.bg : "transparent", color: "var(--color-plum)" }}>
                <span aria-hidden style={{ color: "var(--color-orange)" }}>{t.emoji}</span>
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 chip" style={{ background: "var(--color-paper)" }}>
            <span className="rounded-full" style={{ width: 28, height: 28, background: "var(--color-butter)", border: "2px solid var(--color-plum)" }} />
            <div className="leading-tight">
              <div className="font-semibold text-[13px]">Valentina A.</div>
              <div className="text-[11px]" style={{ color: "var(--color-mute)" }}>Biology · 9A 9B 10A</div>
            </div>
          </div>
          <button className="btn-chunky btn-chunky-blush" style={{ padding: "10px 16px", fontSize: 13 }}>
            <Star size={16} fill="var(--color-orange)" /> Focus
          </button>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
