export type AppRole = 'teacher' | 'coordinator' | 'admin';
export type PlanStatus = 'draft_saved' | 'pending_review' | 'approved' | 'rejected';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type InstitutionType = 'preescolar' | 'primaria' | 'secundaria' | 'universidad' | 'otro';

export interface AppUser {
  id: string;
  institution_id: string | null;
  full_name: string;
  email: string;
  role: AppRole;
  avatar_url?: string | null;
  phone?: string | null;
  subject_area?: string | null;
  grade_levels?: string[] | null;
  preferences?: Record<string, unknown> | null;
  is_active?: boolean;
  last_seen_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Institution {
  id: string;
  name: string;
  slug: string;
  type: InstitutionType;
  country: string;
  city: string;
  is_active: boolean;
  created_at?: string;
}

export interface Class {
  id: string;
  institution_id: string;
  teacher_id: string;
  name: string;
  subject: string;
  grade_level: string;
  academic_period?: string;
  schedule?: Record<string, unknown>;
  created_at?: string;
}

export interface Student {
  id: string;
  institution_id: string;
  teacher_id: string;
  full_name: string;
  student_code?: string;
  email?: string;
  guardian_name?: string;
  guardian_phone?: string;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ClassStudent {
  id: string;
  class_id: string;
  student_id: string;
  enrolled_at?: string;
  created_at?: string;
}

export interface CsvStudentRow {
  full_name: string;
  student_code?: string;
  email?: string;
  guardian_name?: string;
  guardian_phone?: string;
}

export interface ImportResult {
  created: number;
  enrolled: number;
  skipped: number;
  errors: string[];
}

export interface AttendanceEntry {
  id: string;
  institution_id: string;
  class_id: string;
  teacher_id: string;
  student_id: string;
  date: string;
  status: AttendanceStatus;
  task_id?: string;
  created_at?: string;
}

export interface PlanPhase {
  phase: string;
  description: string;
  duration: number;
}

export interface PlanIdea {
  title: string;
  type: string;
  objective: string;
  description: string;
  duration: number;
  materials: string[];
  sequence: PlanPhase[];
  evaluation: string;
}

export interface LessonPlan {
  id?: string;
  teacher_id: string;
  institution_id?: string | null;
  title: string;
  subject?: string;
  grade?: string;
  topic?: string;
  content: PlanIdea;
  status: PlanStatus;
  coordinator_comment?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  export_data?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface InviteCode {
  id: string;
  institution_id: string;
  code: string;
  created_by?: string | null;
  max_uses: number;
  use_count: number;
  expires_at?: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface ValidateInviteCodeResult {
  institution_id: string | null;
  institution_name: string | null;
  institution_type: string | null;
  is_valid: boolean;
}

export type BugCategory = 'ui' | 'funcionalidad' | 'datos' | 'rendimiento' | 'otro';

export interface BugReport {
  id?: string;
  user_id?: string;
  title: string;
  description: string;
  category: BugCategory;
  page_url?: string;
  user_agent?: string;
  created_at?: string;
}