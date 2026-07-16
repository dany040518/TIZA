import { supabase } from './supabaseClient';
import type {
  AppUser,
  Class,
  LessonPlan,
  Institution,
  InviteCode,
  PlanIdea,
  PlanStatus,
  BugReport,
} from '@/types';

export type { LessonPlan };

// ── App Users ──────────────────────────────────────────────────
export async function getProfile(userId: string): Promise<AppUser | null> {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data as AppUser;
}

export async function updateAppUser(
  userId: string,
  fields: Partial<Pick<AppUser, 'full_name' | 'phone' | 'subject_area' | 'grade_levels' | 'avatar_url'>>,
) {
  const { data, error } = await supabase
    .from('app_users')
    .update(fields)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data as AppUser;
}

// ── Lesson Plans ───────────────────────────────────────────────
export async function saveLessonPlan(plan: {
  teacher_id: string;
  institution_id?: string | null;
  title: string;
  subject?: string;
  grade?: string;
  topic?: string;
  objectives?: string;
  methodology?: string;
  observations?: string;
  content: PlanIdea;
  selected_sections?: string[] | null;
  class_id?: string | null;
}) {
  const { data, error } = await supabase
    .from('lesson_plans')
    .insert({ ...plan, status: 'draft_saved' as PlanStatus })
    .select()
    .single();
  if (error) throw error;
  return data as LessonPlan;
}

export async function updateLessonPlan(
  planId: string,
  fields: Partial<Pick<LessonPlan,
    'title' | 'subject' | 'grade' | 'topic' |
    'objectives' | 'methodology' | 'observations' | 'content'
  >>,
) {
  const { data, error } = await supabase
    .from('lesson_plans')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', planId)
    .select()
    .single();
  if (error) throw error;
  return data as LessonPlan;
}

export async function duplicateLessonPlan(plan: LessonPlan, classId?: string): Promise<LessonPlan> {
  const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = plan;
  const { data, error } = await supabase
    .from('lesson_plans')
    .insert({
      ...rest,
      title: classId ? rest.title : `${rest.title} (copia)`,
      parent_plan_id: classId ? (plan.id ?? null) : null,
      class_id: classId ?? null,
      status: 'draft_saved' as PlanStatus,
      coordinator_comment: null,
      reviewed_by: null,
      reviewed_at: null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as LessonPlan;
}

export async function getLessonPlans(teacherId: string) {
  const { data, error } = await supabase
    .from('lesson_plans')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as LessonPlan[];
}

export async function getLinkedPlans(parentPlanId: string): Promise<LessonPlan[]> {
  const { data, error } = await supabase
    .from('lesson_plans')
    .select('*')
    .eq('parent_plan_id', parentPlanId);
  if (error) throw error;
  return data as LessonPlan[];
}

export async function deleteLessonPlan(planId: string) {
  const { error } = await supabase.from('lesson_plans').delete().eq('id', planId);
  if (error) throw error;
}

// ── Classes ────────────────────────────────────────────────────
export async function getClasses(teacherId: string, includeArchived = false) {
  let query = supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (!includeArchived) {
    query = query.eq('is_archived', false);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Class[];
}

export async function createClass(cls: Omit<Class, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('classes')
    .insert(cls)
    .select()
    .single();
  if (error) throw error;
  return data as Class;
}

export async function updateClass(classId: string, fields: Partial<Omit<Class, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('classes')
    .update(fields)
    .eq('id', classId)
    .select()
    .single();
  if (error) throw error;
  return data as Class;
}

export async function archiveClass(classId: string): Promise<Class> {
  return updateClass(classId, { is_archived: true });
}

export async function unarchiveClass(classId: string): Promise<Class> {
  return updateClass(classId, { is_archived: false });
}

export async function deleteClass(classId: string) {
  const { error } = await supabase.from('classes').delete().eq('id', classId);
  if (error) throw error;
}

// ── Institutions (admin) ───────────────────────────────────────
export async function getInstitutionsWithCodes() {
  const { data: institutions, error: instErr } = await supabase
    .from('institutions')
    .select('*')
    .order('created_at', { ascending: false });
  if (instErr) throw instErr;

  const ids = (institutions ?? []).map((i) => i.id as string);
  const { data: codes, error: codesErr } = ids.length
    ? await supabase.from('invite_codes').select('*').in('institution_id', ids)
    : { data: [], error: null };
  if (codesErr) throw codesErr;

  return (institutions ?? []).map((inst) => ({
    ...(inst as Institution),
    invite_codes: (codes ?? []).filter((c) => c.institution_id === inst.id) as InviteCode[],
  }));
}

export async function createInstitution(fields: Omit<Institution, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('institutions')
    .insert(fields)
    .select()
    .single();
  if (error) throw error;
  return data as Institution;
}

export async function createInviteCode(
  institutionId: string,
  code: string,
  role: 'teacher' | 'coordinator' = 'teacher',
  maxUses = 99999,
) {
  const { data, error } = await supabase
    .from('invite_codes')
    .insert({ institution_id: institutionId, code: code.toUpperCase(), role, max_uses: maxUses })
    .select()
    .single();
  if (error) throw error;
  return data as InviteCode;
}

export async function deleteInstitution(institutionId: string) {
  const { error } = await supabase.rpc('delete_institution_cascade', { p_institution_id: institutionId });
  if (error) throw error;
}

// ── Feature Interest ───────────────────────────────────────────
export async function saveFeatureInterest(userId: string, featureName: string): Promise<void> {
  await supabase.from('feature_interest').insert({ user_id: userId, feature_name: featureName });
}

// ── Bug Reports ────────────────────────────────────────────────
export async function submitBugReport(report: Omit<BugReport, 'id' | 'created_at'>) {
  const { error } = await supabase.from('bug_reports').insert(report);
  if (error) throw error;
}
