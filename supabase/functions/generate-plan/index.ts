import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENROUTER_API_KEY    = Deno.env.get("OPENROUTER_API_KEY")!;
const SUPABASE_URL          = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Configurable via Supabase secret MODEL=<openrouter-model-id>
const MODEL = Deno.env.get("MODEL") ?? "qwen/qwen-2.5-72b-instruct";

const RATE_LIMIT_PER_HOUR = 10;

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS });
  }

  try {
    // 1. Verify JWT ───────────────────────────────────────────
    const token = (req.headers.get("Authorization") ?? "")
      .replace("Bearer ", "").trim();
    if (!token) return fail(401, "Authorization header required");

    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
      auth: { persistSession: false },
    });

    const { data: { user }, error: authErr } = await db.auth.getUser(token);
    if (authErr || !user) return fail(401, "Token inválido o expirado");

    // 2. Rate limiting ────────────────────────────────────────
    const hourBucket = new Date();
    hourBucket.setMinutes(0, 0, 0);

    const { data: newCount, error: rateErr } = await db.rpc("increment_ai_usage", {
      p_user_id:     user.id,
      p_hour_bucket: hourBucket.toISOString(),
    });

    if (rateErr) {
      console.error("rate-limit rpc error:", rateErr);
      return fail(500, "Error interno. Intenta de nuevo.");
    }

    if ((newCount as number) > RATE_LIMIT_PER_HOUR) {
      await db.rpc("decrement_ai_usage", {
        p_user_id:     user.id,
        p_hour_bucket: hourBucket.toISOString(),
      });
      return fail(
        429,
        `Alcanzaste el límite de ${RATE_LIMIT_PER_HOUR} generaciones por hora. Intenta en un momento.`
      );
    }

    // 3. Parse + validate body ────────────────────────────────
    const {
      subject = "",
      grade = "",
      topic = "",
      context = "",
      selected_sections = null,
    } = await req.json().catch(() => ({}));

    if (!topic.trim()) return fail(400, "El campo 'topic' es requerido");

    // 4. Call OpenRouter ──────────────────────────────────────
    const result = await callAI({ subject, grade, topic, context, selected_sections });

    return new Response(JSON.stringify(result), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-plan error:", err);
    return fail(500, "Error interno. Por favor intenta de nuevo.");
  }
});

// ── OpenRouter call (OpenAI-compatible) ───────────────────────
async function callAI(params: {
  subject: string;
  grade: string;
  topic: string;
  context: string;
  selected_sections: string[] | null;
}): Promise<unknown> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer":  "https://tiza.app",
      "X-Title":       "TIZA",
    },
    body: JSON.stringify({
      model:       MODEL,
      messages:    [{ role: "user", content: buildPrompt(params) }],
      temperature: 0.7,
      max_tokens:  2500,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`OpenRouter error ${res.status}:`, body.slice(0, 500));

    if (res.status === 429) {
      throw new Error("El servicio de IA está ocupado. Espera un momento e intenta de nuevo.");
    }
    if (res.status === 402) {
      throw new Error("Error de configuración del servicio. Contacta al administrador.");
    }
    throw new Error(`Error del servicio de IA (${res.status}). Intenta de nuevo.`);
  }

  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? "";

  const clean = text.replace(/```json|```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) {
    console.error("Non-JSON response from model:", text.slice(0, 300));
    throw new Error("El modelo devolvió una respuesta inesperada. Intenta de nuevo.");
  }

  return JSON.parse(match[0]);
}

// ── Prompt ────────────────────────────────────────────────────
function buildPrompt({
  subject,
  grade,
  topic,
  context,
  selected_sections,
}: {
  subject: string;
  grade: string;
  topic: string;
  context: string;
  selected_sections: string[] | null;
}): string {
  const allSections = [
    "objective",
    "specific_objectives",
    "materials",
    "sequence",
    "evaluation",
    "reflection",
    "adaptations",
    "homework",
  ];

  const sections = selected_sections && selected_sections.length > 0
    ? selected_sections
    : allSections;

  const sectionInstructions = buildSectionInstructions(sections, grade, context);

  return `You are an expert instructional designer helping a teacher create complete, practical lesson plans.

Your goal is to generate 3 VERY DIFFERENT lesson plans based on:

- Subject: ${subject}
- Grade Level: ${grade}
- Topic: ${topic}
${context ? `- Classroom context: ${context}` : ""}

Each lesson must use a DIFFERENT teaching approach:
1. Gamified / game-based 🎮
2. Collaborative / discussion 💬
3. Experiential / hands-on 🧪

Each lesson plan must be REALISTIC and ready to use in a classroom.
Avoid generic explanations. Be concrete and practical.

For EACH lesson, generate ONLY the following fields:
- title: engaging and clear
- type: (Gamified, Debate, Experimental, etc.)
- description: short explanation of the class (2–3 sentences)
- duration: total class time in minutes
${sectionInstructions}

IMPORTANT:
- Make each idea VERY different
- Use natural teacher-friendly language
- Be specific (no vague phrases like "students understand")
- Keep it concise but actionable
- Give me the whole answer in Spanish
- ONLY include the sections listed above — do not add extra fields

Return ONLY valid JSON:
{
  "ideas": [
    {
      "title": "string",
      "type": "string",
      "description": "string",
      "duration": number${buildJsonShape(sections)}
    }
  ]
}`;
}

function buildSectionInstructions(sections: string[], grade: string, context: string): string {
  const gradeRef = grade || "the indicated grade level";
  const hasContext = context?.trim().length > 0;

  const map: Record<string, string> = {
    objective: "- objective: what students will learn (1 sentence, clear and measurable)",
    specific_objectives: "- specific_objectives: array of 2-3 specific learning objectives",
    materials: "- materials: array of specific materials needed",
    sequence: `- sequence:
    [ { "phase": "Opening",     "description": "...", "duration": number },
      { "phase": "Development", "description": "...", "duration": number },
      { "phase": "Closing",     "description": "...", "duration": number } ]`,
    evaluation: `- evaluation: how the teacher checks learning — must be proportional to ${gradeRef}: for Preescolar use simple observation or oral questions; for Primaria use brief written exercises or group demonstrations; for Secundaria use quizzes, oral presentations, or rubric-based tasks; for Universidad use analysis, projects, or oral defense. Be concrete, not abstract.${hasContext ? " Consider any special needs or group characteristics mentioned in the classroom context." : ""}`,
    reflection: "- reflection: pedagogical reflection / closing thoughts for the teacher (2-3 sentences)",
    adaptations: "- adaptations: array of adjustments for students with special needs",
    homework: `- homework: take-home task appropriate for ${gradeRef}. Preescolar: brief playful activity (≤15 min) with family involvement. Primaria: guided practice or short reading (≤20 min). Secundaria: autonomous task or short research (≤30 min). Universidad: project, essay, or problem set. Keep it manageable and purposeful.`,
  };

  return sections
    .filter((s) => map[s])
    .map((s) => map[s])
    .join("\n");
}

function buildJsonShape(sections: string[]): string {
  const map: Record<string, string> = {
    objective: ',\n      "objective": "string"',
    specific_objectives: ',\n      "specific_objectives": ["string"]',
    materials: ',\n      "materials": ["string"]',
    sequence: ',\n      "sequence": [{ "phase": "string", "description": "string", "duration": number }]',
    evaluation: ',\n      "evaluation": "string"',
    reflection: ',\n      "reflection": "string"',
    adaptations: ',\n      "adaptations": ["string"]',
    homework: ',\n      "homework": "string"',
  };

  return sections
    .filter((s) => map[s])
    .map((s) => map[s])
    .join("");
}

// ── Helper ────────────────────────────────────────────────────
function fail(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
