import { describe, it, expect, vi } from 'vitest'

vi.mock('@google/genai', () => ({
  GoogleGenAI: function () {
    return {
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: JSON.stringify({
            ideas: [
              {
                title: 'Fracciones con pizza',
                type: 'Gamified',
                objective: 'Aprender fracciones',
                description: 'Clase lúdica',
                duration: 60,
                materials: ['pizarrón'],
                sequence: [
                  { phase: 'Opening', description: 'Inicio', duration: 10 },
                  { phase: 'Development', description: 'Desarrollo', duration: 40 },
                  { phase: 'Closing', description: 'Cierre', duration: 10 },
                ],
                evaluation: 'Quiz oral',
              },
            ],
          }),
        }),
      },
    }
  },
}))

import { generateLessonPlan } from './geminiService'

describe('generateLessonPlan()', () => {
  it('retorna un objeto con ideas', async () => {
    const result = await generateLessonPlan('Matemáticas', '5to', 'Fracciones')
    expect(result).toHaveProperty('ideas')
  })

  it('las ideas son un array', async () => {
    const result = await generateLessonPlan('Ciencias', '3ro', 'El agua')
    expect(Array.isArray(result?.ideas)).toBe(true)
  })

  it('cada idea tiene los campos requeridos', async () => {
    const result = await generateLessonPlan('Historia', '6to', 'Independencia')
    const idea = result!.ideas[0]
    expect(idea).toHaveProperty('title')
    expect(idea).toHaveProperty('objective')
    expect(idea).toHaveProperty('duration')
    expect(idea).toHaveProperty('materials')
    expect(idea).toHaveProperty('sequence')
    expect(idea).toHaveProperty('evaluation')
  })

  it('la secuencia tiene 3 fases', async () => {
    const result = await generateLessonPlan('Arte', '4to', 'Color')
    expect(result!.ideas[0].sequence).toHaveLength(3)
  })
})