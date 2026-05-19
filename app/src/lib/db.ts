import { supabase } from './supabaseClient';
import type {
  AppUser,
  Class,
  Student,
  ClassStudent,
  CsvStudentRow,
  ImportResult,
  AttendanceEntry,
  LessonPlan,
  Institution,
  InviteCode,
  ValidateInviteCodeResult,
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
  content: PlanIdea;
}) {
  const { data, error } = await supabase
    .from('lesson_plans')
    .insert({ ...plan, status: 'draft_saved' as PlanStatus })
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

export async function submitLessonPlanForReview(planId: string) {
  const { data, error } = await supabase
    .from('lesson_plans')
    .update({ status: 'pending_review' as PlanStatus, updated_at: new Date().toISOString() })
    .eq('id', planId)
    .select()
    .single();
  if (error) throw error;
  return data as LessonPlan;
}

export async function deleteLessonPlan(planId: string) {
  const { error } = await supabase.from('lesson_plans').delete().eq('id', planId);
  if (error) throw error;
}

export async function getPendingPlans(institutionId: string) {
  const { data, error } = await supabase
    .from('lesson_plans')
    .select('*')
    .eq('institution_id', institutionId)
    .neq('status', 'draft_saved')
    .order('updated_at', { ascending: true });
  if (error) throw error;
  return data as LessonPlan[];
}

export async function reviewLessonPlan(
  planId: string,
  reviewerId: string,
  decision: 'approved' | 'rejected',
  comment?: string,
) {
  const { data, error } = await supabase
    .from('lesson_plans')
    .update({
      status: decision as PlanStatus,
      coordinator_comment: comment ?? null,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', planId)
    .select()
    .single();
  if (error) throw error;
  return data as LessonPlan;
}

// ── Classes ────────────────────────────────────────────────────
export async function getClasses(teacherId: string) {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });
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

export async function deleteClass(classId: string) {
  const { error } = await supabase.from('classes').delete().eq('id', classId);
  if (error) throw error;
}

// ── Students ───────────────────────────────────────────────────

// Returns students enrolled in a class via class_students (M:M)
export async function getStudentsByClass(classId: string): Promise<Student[]> {
  const { data: enrollments, error: enrollErr } = await supabase
    .from('class_students')
    .select('student_id')
    .eq('class_id', classId);
  if (enrollErr) throw enrollErr;
  if (!enrollments?.length) return [];

  const ids = enrollments.map((e) => e.student_id as string);
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .in('id', ids)
    .order('full_name', { ascending: true });
  if (error) throw error;
  return data as Student[];
}

// Returns all students owned by a teacher, regardless of class
export async function getTeacherStudents(teacherId: string): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('full_name', { ascending: true });
  if (error) throw error;
  return data as Student[];
}

// Creates a student record (no class association — enroll separately)
export async function createStudent(
  student: Omit<Student, 'id' | 'created_at' | 'updated_at'>,
): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .insert(student)
    .select()
    .single();
  if (error) throw error;
  return data as Student;
}

// Enroll an existing student into a class
export async function enrollStudentInClass(
  classId: string,
  studentId: string,
): Promise<ClassStudent> {
  const { data, error } = await supabase
    .from('class_students')
    .insert({ class_id: classId, student_id: studentId })
    .select()
    .single();
  if (error) throw error;
  return data as ClassStudent;
}

// Remove a student from a class without deleting the student record
export async function unenrollStudentFromClass(
  classId: string,
  studentId: string,
): Promise<void> {
  const { error } = await supabase
    .from('class_students')
    .delete()
    .eq('class_id', classId)
    .eq('student_id', studentId);
  if (error) throw error;
}

// Permanently delete a student (cascades class_students + attendance_entries)
export async function deleteStudent(studentId: string): Promise<void> {
  const { error } = await supabase.from('students').delete().eq('id', studentId);
  if (error) throw error;
}

// Bulk-import students from CSV rows into a class.
// Dedup strategy (per teacher):
//   - student_code match (priority) → reuse existing student
//   - full_name match (normalized)  → reuse existing student
//   - duplicates within the same CSV are skipped
//   - already-enrolled students are skipped (no error)
export async function importStudentsToClass(
  classId: string,
  teacherId: string,
  institutionId: string,
  rows: CsvStudentRow[],
): Promise<ImportResult> {
  const result: ImportResult = { created: 0, enrolled: 0, skipped: 0, errors: [] };

  // 1. Fetch all students already owned by this teacher
  const { data: existing, error: existErr } = await supabase
    .from('students')
    .select('id, full_name, student_code')
    .eq('teacher_id', teacherId);
  if (existErr) throw existErr;

  const byCode = new Map<string, string>(); // normalized code → student id
  const byName = new Map<string, string>(); // normalized name → student id
  (existing ?? []).forEach((s) => {
    if (s.student_code?.trim()) byCode.set(s.student_code.trim().toLowerCase(), s.id as string);
    byName.set((s.full_name as string).trim().toLowerCase(), s.id as string);
  });

  // 2. Fetch already-enrolled students in this class
  const { data: enrolled, error: enrolledErr } = await supabase
    .from('class_students')
    .select('student_id')
    .eq('class_id', classId);
  if (enrolledErr) throw enrolledErr;
  const enrolledSet = new Set((enrolled ?? []).map((e) => e.student_id as string));

  // 3. Process each row, dedup within this CSV
  const seenInCsv = new Set<string>();
  const toCreate: Omit<Student, 'id' | 'created_at' | 'updated_at'>[] = [];
  const toEnrollIds: string[] = [];

  for (const row of rows) {
    const codeKey = row.student_code?.trim().toLowerCase();
    const nameKey = row.full_name.trim().toLowerCase();
    const csvKey  = codeKey || nameKey;

    if (seenInCsv.has(csvKey)) {
      result.skipped++;
      result.errors.push(`Duplicado en el archivo: "${row.full_name}"`);
      continue;
    }
    seenInCsv.add(csvKey);

    // Find existing student for this teacher
    const existingId = (codeKey ? byCode.get(codeKey) : undefined) ?? byName.get(nameKey);

    if (existingId) {
      if (enrolledSet.has(existingId)) {
        result.skipped++;
      } else {
        toEnrollIds.push(existingId);
      }
    } else {
      toCreate.push({
        institution_id:  institutionId,
        teacher_id:      teacherId,
        full_name:       row.full_name.trim(),
        student_code:    row.student_code?.trim() || undefined,
        email:           row.email?.trim()          || undefined,
        guardian_name:   row.guardian_name?.trim()  || undefined,
        guardian_phone:  row.guardian_phone?.trim() || undefined,
        is_active:       true,
      });
    }
  }

  // 4. Bulk create new students
  if (toCreate.length > 0) {
    const { data: created, error: createErr } = await supabase
      .from('students')
      .insert(toCreate)
      .select('id');
    if (createErr) throw createErr;
    result.created = created?.length ?? 0;
    (created ?? []).forEach((s) => toEnrollIds.push(s.id as string));
  }

  // 5. Bulk enroll (ON CONFLICT handled by unique constraint — safe to re-run)
  if (toEnrollIds.length > 0) {
    const { error: bulkErr } = await supabase
      .from('class_students')
      .insert(toEnrollIds.map((sid) => ({ class_id: classId, student_id: sid })));
    if (bulkErr) throw bulkErr;
    result.enrolled = toEnrollIds.length;
  }

  return result;
}

// ── Attendance ─────────────────────────────────────────────────
export async function getAttendanceForDate(classId: string, date: string) {
  const { data, error } = await supabase
    .from('attendance_entries')
    .select('*')
    .eq('class_id', classId)
    .eq('date', date);
  if (error) throw error;
  return data as AttendanceEntry[];
}

export async function upsertAttendance(entries: Omit<AttendanceEntry, 'id' | 'created_at' | 'task_id'>[]) {
  const { data, error } = await supabase
    .from('attendance_entries')
    .upsert(entries, { onConflict: 'class_id,student_id,date' })
    .select();
  if (error) throw error;
  return data as AttendanceEntry[];
}

// ── Invite codes ───────────────────────────────────────────────
export async function validateInviteCode(code: string): Promise<ValidateInviteCodeResult> {
  const { data, error } = await supabase.rpc('validate_invite_code', { p_code: code });
  if (error) throw error;
  const rows = data as ValidateInviteCodeResult[];
  return rows[0];
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

export async function createInviteCode(institutionId: string, code: string, maxUses = 999) {
  const { data, error } = await supabase
    .from('invite_codes')
    .insert({ institution_id: institutionId, code: code.toUpperCase(), max_uses: maxUses })
    .select()
    .single();
  if (error) throw error;
  return data as InviteCode;
}

// ── Bug Reports ────────────────────────────────────────────────
export async function submitBugReport(report: Omit<BugReport, 'id' | 'created_at'>) {
  const { error } = await supabase.from('bug_reports').insert(report);
  if (error) throw error;
}