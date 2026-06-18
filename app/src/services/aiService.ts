import { supabase } from "@/lib/supabaseClient";
import type { PlanIdea } from "@/types";

export type { PlanIdea };

// ── generateLessonPlan ─────────────────────────────────────────
// API key (OPENROUTER_API_KEY) lives only as a Supabase Edge Function secret.
// The browser never sees it — all AI calls go through /functions/v1/generate-plan.

export const generateLessonPlan = async (
  subject: string,
  grade: string,
  topic: string,
  context?: string,
): Promise<{ ideas: PlanIdea[] } | null> => {
  // Require an active session — the JWT authenticates the Edge Function
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Debes iniciar sesión para generar planeaciones.");
  }

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-plan`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ subject, grade, topic, context }),
    },
  );

  // Surface rate-limit as a user-friendly message
  if (res.status === 429) {
    const { error } = await res.json().catch(() => ({
      error: "Alcanzaste el límite de generaciones por hora. Intenta más tarde.",
    }));
    throw new Error(error);
  }

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({
      error: "Error al generar la planeación. Intenta de nuevo.",
    }));
    throw new Error(error ?? "Error desconocido");
  }

  return res.json() as Promise<{ ideas: PlanIdea[] }>;
};