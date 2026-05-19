/**
 * Offline action queue backed by IndexedDB.
 *
 * Any mutation that fails due to network unavailability is stored here.
 * When the browser regains connectivity, the queue drains automatically.
 *
 * Supported action types mirror the db.ts functions used for writes.
 */

export type OfflineActionType =
  | 'CREATE_CLASS'
  | 'UPDATE_CLASS'
  | 'CREATE_STUDENT'
  | 'ENROLL_STUDENT'
  | 'UPSERT_ATTENDANCE'
  | 'SAVE_LESSON_PLAN';

export interface OfflineAction {
  id: string;
  type: OfflineActionType;
  payload: unknown;
  enqueuedAt: string;
  attempts: number;
}

const DB_NAME    = 'tiza_offline';
const STORE_NAME = 'action_queue';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

export async function enqueue(type: OfflineActionType, payload: unknown): Promise<void> {
  const db = await openDB();
  const action: OfflineAction = {
    id:          crypto.randomUUID(),
    type,
    payload,
    enqueuedAt:  new Date().toISOString(),
    attempts:    0,
  };
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).add(action);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

export async function dequeue(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).delete(id);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

export async function getAllPending(): Promise<OfflineAction[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result as OfflineAction[]);
    req.onerror   = () => reject(req.error);
  });
}

async function incrementAttempts(action: OfflineAction): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const updated = { ...action, attempts: action.attempts + 1 };
    const tx  = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).put(updated);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

// ── Replay logic ───────────────────────────────────────────────

type Replayer = (action: OfflineAction) => Promise<void>;

// Registered at init time by the app so the queue doesn't import db.ts directly
let replayFn: Replayer | null = null;

export function registerReplay(fn: Replayer) {
  replayFn = fn;
}

const MAX_ATTEMPTS = 5;

export async function drainQueue(): Promise<{ succeeded: number; failed: number }> {
  if (!replayFn) return { succeeded: 0, failed: 0 };
  const pending = await getAllPending();
  let succeeded = 0;
  let failed    = 0;

  for (const action of pending) {
    if (action.attempts >= MAX_ATTEMPTS) {
      await dequeue(action.id);
      failed++;
      continue;
    }
    try {
      await replayFn(action);
      await dequeue(action.id);
      succeeded++;
    } catch {
      await incrementAttempts(action);
      failed++;
    }
  }
  return { succeeded, failed };
}

// ── Online/offline listener ────────────────────────────────────

let draining = false;

async function onOnline() {
  if (draining) return;
  draining = true;
  try {
    const result = await drainQueue();
    if (result.succeeded > 0 || result.failed > 0) {
      console.info('[TIZA offline] sync complete', result);
    }
  } finally {
    draining = false;
  }
}

export function initOfflineSync() {
  window.addEventListener('online', onOnline);
  // Attempt drain on startup in case there are queued actions from a previous session
  if (navigator.onLine) onOnline();
}