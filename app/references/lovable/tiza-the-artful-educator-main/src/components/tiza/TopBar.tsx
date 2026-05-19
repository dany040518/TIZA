import { Link } from "@tanstack/react-router";
import { Mark } from "./Mark";

export function TopBar({ active }: { active?: "home" | "workspace" }) {
  return (
    <header>
      <div className="mx-auto max-w-[1320px] px-6 md:px-10 pt-6 md:pt-8 pb-4 flex items-center justify-between gap-4">
        <Link to="/" className="no-underline text-plum"><Mark /></Link>

        <nav className="hidden md:flex items-center gap-2 sticker px-2 py-1.5" style={{ boxShadow: "3px 3px 0 var(--color-plum)" }}>
          <Link to="/" className="px-4 py-2 rounded-full no-underline font-semibold text-[14px]"
            style={{ background: active === "home" ? "var(--color-blush)" : "transparent", color: "var(--color-plum)" }}>
            Manifesto
          </Link>
          <Link to="/workspace" className="px-4 py-2 rounded-full no-underline font-semibold text-[14px]"
            style={{ background: active === "workspace" ? "var(--color-mint)" : "transparent", color: "var(--color-plum)" }}>
            Workspace
          </Link>
          <a href="#stories" className="px-4 py-2 rounded-full no-underline font-semibold text-[14px]" style={{ color: "var(--color-plum)" }}>Stories</a>
          <a href="#schools" className="px-4 py-2 rounded-full no-underline font-semibold text-[14px]" style={{ color: "var(--color-plum)" }}>For schools</a>
        </nav>

        <Link to="/onboarding" className="btn-chunky btn-chunky-primary">
          Begin <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  );
}
