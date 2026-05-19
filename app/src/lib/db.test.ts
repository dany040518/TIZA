import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./supabaseClient', () => ({
  supabase: { from: vi.fn() },
}))

import { supabase } from './supabaseClient'
import {
  saveLessonPlan,
  getLessonPlans,
  deleteLessonPlan,
  submitLessonPlanForReview,
  getProfile,
} from './db'

// Helper que construye el mock encadenado de Supabase
function mockChain(final: { data?: any; error?: any }) {
  const chain: any = {}
  const methods = ['select', 'insert', 'update', 'delete', 'upsert', 'eq', 'neq', 'order', 'in']
  methods.forEach(m => { chain[m] = vi.fn().mockReturnValue(chain) })
  chain.single = vi.fn().mockResolvedValue(final)
  chain.then = undefined // evita que se trate como Promise
  // Para casos sin .single() (como getLessonPlans, deleteLessonPlan)
  chain.order = vi.fn().mockResolvedValue(final)
  chain.eq = vi.fn().mockReturnValue(chain)
  chain.delete = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue(final) })
  vi.mocked(supabase.from).mockReturnValue(chain)
  return chain
}

const mockPlan = {
  teacher_id: 'teacher-1',
  institution_id: 'inst-1',
  title: 'Fracciones con pizza',
  subject: 'Matemáticas',
  grade: '5to',
  topic: 'Fracciones',
  content: {
    title: 'Fracciones con pizza',
    type: 'Gamified',
    objective: 'Aprender fracciones',
    description: 'Clase lúdica',
    duration: 60,
    materials: ['pizarrón'],
    sequence: [],
    evaluation: 'Quiz oral',
  },
}

beforeEach(() => vi.clearAllMocks())

// ── saveLessonPlan ─────────────────────────────────────────────
describe('saveLessonPlan()', () => {
  it('retorna el plan guardado cuando no hay error', async () => {
    const saved = { ...mockPlan, id: 'plan-1', status: 'draft_saved', created_at: '2026-01-01' }
    mockChain({ data: saved, error: null })
    const result = await saveLessonPlan(mockPlan)
    expect(result.id).toBe('plan-1')
    expect(result.status).toBe('draft_saved')
  })

  it('lanza error si Supabase falla', async () => {
    mockChain({ data: null, error: new Error('DB error') })
    await expect(saveLessonPlan(mockPlan)).rejects.toThrow('DB error')
  })
})

// ── getLessonPlans ─────────────────────────────────────────────
describe('getLessonPlans()', () => {
  it('retorna lista de planes del profesor', async () => {
    const chain: any = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [{ ...mockPlan, id: '1' }, { ...mockPlan, id: '2' }],
        error: null,
      }),
    }
    vi.mocked(supabase.from).mockReturnValue(chain)
    const result = await getLessonPlans('teacher-1')
    expect(result).toHaveLength(2)
  })

  it('lanza error si Supabase falla', async () => {
    const chain: any = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: new Error('Sin conexión') }),
    }
    vi.mocked(supabase.from).mockReturnValue(chain)
    await expect(getLessonPlans('teacher-1')).rejects.toThrow('Sin conexión')
  })
})

// ── deleteLessonPlan ───────────────────────────────────────────
describe('deleteLessonPlan()', () => {
  it('no lanza error al eliminar correctamente', async () => {
    const chain: any = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }
    vi.mocked(supabase.from).mockReturnValue(chain)
    await expect(deleteLessonPlan('plan-1')).resolves.not.toThrow()
  })

  it('lanza error si Supabase falla', async () => {
    const chain: any = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: new Error('No se pudo eliminar') }),
    }
    vi.mocked(supabase.from).mockReturnValue(chain)
    await expect(deleteLessonPlan('plan-1')).rejects.toThrow('No se pudo eliminar')
  })
})

// ── submitLessonPlanForReview ──────────────────────────────────
describe('submitLessonPlanForReview()', () => {
  it('cambia el estado a pending_review', async () => {
    const updated = { ...mockPlan, id: 'plan-1', status: 'pending_review' }
    const chain: any = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: updated, error: null }),
    }
    vi.mocked(supabase.from).mockReturnValue(chain)
    const result = await submitLessonPlanForReview('plan-1')
    expect(result.status).toBe('pending_review')
  })
})

// ── getProfile ─────────────────────────────────────────────────
describe('getProfile()', () => {
  it('retorna null si el usuario no existe', async () => {
    const chain: any = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
    }
    vi.mocked(supabase.from).mockReturnValue(chain)
    const result = await getProfile('usuario-inexistente')
    expect(result).toBeNull()
  })

  it('retorna el perfil si existe', async () => {
    const profile = { id: 'u-1', full_name: 'Daniela', email: 'daniela@mail.com' }
    const chain: any = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: profile, error: null }),
    }
    vi.mocked(supabase.from).mockReturnValue(chain)
    const result = await getProfile('u-1')
    expect(result?.full_name).toBe('Daniela')
  })
})