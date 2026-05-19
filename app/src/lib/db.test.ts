import { describe, it, expect, vi, beforeEach } from 'vitest'

// Simulamos Supabase para no necesitar conexión real
vi.mock('./supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { supabase } from './supabaseClient'
import { saveLessonPlan, getLessonPlans, upsertProfile } from './db'
import type { LessonPlan, Profile } from './db'

const mockPlan: Omit<LessonPlan, 'id' | 'created_at'> = {
  teacher_id: 'teacher-123',
  subject: 'Matemáticas',
  grade: '5to',
  topic: 'Fracciones',
  title: 'Fracciones con pizza',
  type: 'Gamified',
  objective: 'El estudiante comprenderá fracciones básicas',
  materials: ['pizarrón', 'marcadores'],
  sequence: [
    { phase: 'Opening', description: 'Inicio', duration: 10 },
    { phase: 'Development', description: 'Desarrollo', duration: 40 },
    { phase: 'Closing', description: 'Cierre', duration: 10 },
  ],
  evaluation: 'Quiz oral al final',
}

// Helper para construir el mock encadenado de Supabase
function mockSupabaseChain(finalResult: { data?: any; error?: any }) {
  const chain = {
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(finalResult),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(finalResult),
    upsert: vi.fn().mockResolvedValue(finalResult),
  }
  vi.mocked(supabase.from).mockReturnValue(chain as any)
  return chain
}

describe('saveLessonPlan()', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna el plan guardado cuando no hay error', async () => {
    const saved = { ...mockPlan, id: 'plan-abc', created_at: '2026-01-01' }
    mockSupabaseChain({ data: saved, error: null })

    const result = await saveLessonPlan(mockPlan)
    expect(result.id).toBe('plan-abc')
    expect(result.subject).toBe('Matemáticas')
  })

  it('lanza error si Supabase falla', async () => {
    mockSupabaseChain({ data: null, error: new Error('DB error') })
    await expect(saveLessonPlan(mockPlan)).rejects.toThrow('DB error')
  })
})

describe('getLessonPlans()', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna lista de planes del profesor', async () => {
    const plans = [{ ...mockPlan, id: '1' }, { ...mockPlan, id: '2' }]
    mockSupabaseChain({ data: plans, error: null })

    const result = await getLessonPlans('teacher-123')
    expect(result).toHaveLength(2)
    expect(result[0].teacher_id).toBe('teacher-123')
  })

  it('retorna lista vacía si el profesor no tiene planes', async () => {
    mockSupabaseChain({ data: [], error: null })
    const result = await getLessonPlans('teacher-sin-planes')
    expect(result).toEqual([])
  })

  it('lanza error si Supabase falla', async () => {
    mockSupabaseChain({ data: null, error: new Error('Sin conexión') })
    await expect(getLessonPlans('teacher-123')).rejects.toThrow('Sin conexión')
  })
})

describe('upsertProfile()', () => {
  beforeEach(() => vi.clearAllMocks())

  it('no lanza error con datos válidos', async () => {
    const chain = { upsert: vi.fn().mockResolvedValue({ error: null }) }
    vi.mocked(supabase.from).mockReturnValue(chain as any)

    const profile: Profile = {
      id: 'user-1',
      name: 'Daniela',
      institution: 'Colegio XYZ',
      email: 'daniela@mail.com',
      role: 'teacher',
    }

    await expect(upsertProfile(profile)).resolves.not.toThrow()
  })

  it('lanza error si Supabase falla', async () => {
    const chain = { upsert: vi.fn().mockResolvedValue({ error: new Error('Upsert fallido') }) }
    vi.mocked(supabase.from).mockReturnValue(chain as any)

    const profile: Profile = {
      id: 'user-2',
      name: 'Carlos',
      institution: 'Escuela ABC',
      email: 'carlos@mail.com',
      role: 'teacher',
    }

    await expect(upsertProfile(profile)).rejects.toThrow('Upsert fallido')
  })
})