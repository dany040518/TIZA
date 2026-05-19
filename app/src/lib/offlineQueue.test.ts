import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mock de IndexedDB ──────────────────────────────────────────
// drainQueue llama openDB() internamente; simulamos IDBDatabase
// con callbacks síncronos para evitar timeouts.

function makeFakeDB(items: Map<string, any>) {
  const fakeObjectStore = {
    getAll: vi.fn(() => {
      const req: any = {}
      Promise.resolve().then(() => {
        req.result = [...items.values()]
        req.onsuccess?.()
      })
      return req
    }),
    delete: vi.fn((id: string) => {
      items.delete(id)
      const req: any = {}
      Promise.resolve().then(() => req.onsuccess?.())
      return req
    }),
    put: vi.fn((item: any) => {
      items.set(item.id, item)
      const req: any = {}
      Promise.resolve().then(() => req.onsuccess?.())
      return req
    }),
    add: vi.fn((item: any) => {
      items.set(item.id, item)
      const req: any = {}
      Promise.resolve().then(() => req.onsuccess?.())
      return req
    }),
  }

  return {
    transaction: vi.fn(() => ({
      objectStore: vi.fn(() => fakeObjectStore),
    })),
    createObjectStore: vi.fn(() => fakeObjectStore),
    _store: fakeObjectStore,
  }
}

const itemsInDB = new Map<string, any>()

vi.stubGlobal('indexedDB', {
  open: vi.fn(() => {
    const fakeDB = makeFakeDB(itemsInDB)
    const req: any = {}
    Promise.resolve().then(() => {
      req.result = fakeDB
      req.onsuccess?.()
    })
    return req
  }),
})

vi.stubGlobal('crypto', {
  randomUUID: vi.fn(() => 'uuid-' + Math.random().toString(36).slice(2, 8)),
})

// ── Importar después de los stubs ──────────────────────────────
import { registerReplay, drainQueue } from './offlineQueue'

beforeEach(() => {
  itemsInDB.clear()
  vi.mocked(indexedDB.open).mockClear()
  registerReplay(null as any) // resetear replay entre tests
})

// ── Tests ──────────────────────────────────────────────────────
describe('drainQueue()', () => {
  it('retorna 0 succeeded y 0 failed si no hay replay registrado', async () => {
    const result = await drainQueue()
    expect(result.succeeded).toBe(0)
    expect(result.failed).toBe(0)
  })

  it('ejecuta el replay y reporta succeeded', async () => {
    const replayFn = vi.fn().mockResolvedValue(undefined)
    registerReplay(replayFn)

    itemsInDB.set('action-1', {
      id: 'action-1',
      type: 'CREATE_CLASS',
      payload: { name: 'Clase A' },
      enqueuedAt: new Date().toISOString(),
      attempts: 0,
    })

    const result = await drainQueue()
    expect(result.succeeded).toBe(1)
    expect(result.failed).toBe(0)
    expect(replayFn).toHaveBeenCalledTimes(1)
  })

  it('cuenta como failed las acciones que superan MAX_ATTEMPTS y las elimina', async () => {
    registerReplay(vi.fn().mockResolvedValue(undefined))

    itemsInDB.set('action-old', {
      id: 'action-old',
      type: 'SAVE_LESSON_PLAN',
      payload: {},
      enqueuedAt: new Date().toISOString(),
      attempts: 5,
    })

    const result = await drainQueue()
    expect(result.failed).toBe(1)
    expect(result.succeeded).toBe(0)
    expect(itemsInDB.has('action-old')).toBe(false)
  })

  it('cuenta como failed y NO elimina si el replay lanza error', async () => {
    registerReplay(vi.fn().mockRejectedValue(new Error('network error')))

    itemsInDB.set('action-2', {
      id: 'action-2',
      type: 'UPDATE_CLASS',
      payload: {},
      enqueuedAt: new Date().toISOString(),
      attempts: 1,
    })

    const result = await drainQueue()
    expect(result.failed).toBe(1)
    expect(result.succeeded).toBe(0)
    // La acción sigue en DB (solo incrementó attempts)
    expect(itemsInDB.has('action-2')).toBe(true)
  })
})