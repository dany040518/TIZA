import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateLessonPlan = async (
  subject: string,
  grade: string,
  topic: string,
  context?: string
) => {

  const prompt = `
You are an expert instructional designer helping a teacher create complete, practical lesson plans.

Your goal is to generate 3 VERY DIFFERENT lesson plans based on:

- Subject: ${subject}
- Grade Level: ${grade}
- Topic: ${topic}
${context ? `- Classroom context: ${context}` : ""}

---

Each lesson must use a DIFFERENT teaching approach:
1. Gamified / game-based 🎮
2. Collaborative / discussion 💬
3. Experiential / hands-on 🧪

---

Each lesson plan must be REALISTIC and ready to use in a classroom.

Avoid generic explanations. Be concrete and practical.

---

For EACH lesson, generate:

- title: engaging and clear
- type: (Gamified, Debate, Experimental, etc.)
- objective: what students will learn (1 sentence, clear and measurable)
- description: short explanation of the class (2–3 sentences)

- duration: total class time in minutes

- materials: array of specific materials needed

- sequence:
  - Opening:
      description: how the class starts (hook or engagement)
      duration: minutes
  - Development:
      description: main activity with clear steps
      duration: minutes
  - Closing:
      description: reflection or assessment activity
      duration: minutes

- evaluation:
  - how the teacher checks learning (practical, not abstract)

---

IMPORTANT:
- Make each idea VERY different
- Use natural teacher-friendly language
- Be specific (no vague phrases like "students understand")
- Keep it concise but actionable

---

Return ONLY valid JSON in this format:

{
  "ideas": [
    {
      "title": "string",
      "type": "string",
      "objective": "string",
      "description": "string",
      "duration": number,
      "materials": ["string"],
      "sequence": [
        { "phase": "Opening", "description": "string", "duration": number },
        { "phase": "Development", "description": "string", "duration": number },
        { "phase": "Closing", "description": "string", "duration": number }
      ],
      "evaluation": "string"
    }
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = response.text || "";
    // Clean up the response if it contains markdown code blocks
    const cleanText = text.replace(/```json|```/g, '').trim();

    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed; // ya tiene { ideas: [...] }
    }

return null;
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    throw error;
  }
};
