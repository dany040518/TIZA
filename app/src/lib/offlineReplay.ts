/**
 * Maps queued offline actions back to their db.ts counterparts.
 * Imported once in main.tsx to register the replay function.
 */
import {
  createClass,
  updateClass,
  saveLessonPlan,
} from './db';
import { registerReplay, type OfflineAction } from './offlineQueue';

export function registerOfflineReplay() {
  registerReplay(async (action: OfflineAction) => {
    const p = action.payload as Record<string, unknown>;

    switch (action.type) {
      case 'CREATE_CLASS':
        await createClass(p as Parameters<typeof createClass>[0]);
        break;
      case 'UPDATE_CLASS':
        await updateClass(p.id as string, p.fields as Parameters<typeof updateClass>[1]);
        break;
      case 'SAVE_LESSON_PLAN':
        await saveLessonPlan(p as Parameters<typeof saveLessonPlan>[0]);
        break;
      default:
        throw new Error(`Unknown offline action type: ${action.type}`);
    }
  });
}
