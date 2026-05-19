import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de Supabase auth
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}))

// Mock de fetch global
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { supabase } from '@/lib/supabaseClient'
import { generateLessonPlan } from './aiService'

const mockIdeas = {
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
}

beforeEach(() => vi.clearAllMocks())

describe('generateLessonPlan()', () => {
  it('lanza error si no hay sesión activa', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
    } as any)

    await expect(
      generateLessonPlan('Matemáticas', '5to', 'Fracciones')
    ).rejects.toThrow('Debes iniciar sesión')
  })

  it('retorna ideas cuando la petición es exitosa', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { access_token: 'token-123' } },
    } as any)

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockIdeas),
    })

    const result = await generateLessonPlan('Matemáticas', '5to', 'Fracciones')
    expect(result).toHaveProperty('ideas')
    expect(result?.ideas).toHaveLength(1)
  })

  it('lanza error amigable cuando el servidor responde 429 (rate limit)', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { access_token: 'token-123' } },
    } as any)

    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
      json: () => Promise.resolve({ error: 'Alcanzaste el límite de generaciones por hora. Intenta más tarde.' }),
    })

    await expect(
      generateLessonPlan('Matemáticas', '5to', 'Fracciones')
    ).rejects.toThrow('Alcanzaste el límite')
  })

  it('lanza error genérico cuando el servidor falla con otro error', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { access_token: 'token-123' } },
    } as any)

    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Error interno' }),
    })

    await expect(
      generateLessonPlan('Historia', '6to', 'Independencia')
    ).rejects.toThrow('Error interno')
  })
})