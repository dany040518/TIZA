export type AppRole = 'teacher' | 'coordinator' | 'admin';
export type PlanStatus = 'draft_saved' | 'pending_review' | 'approved' | 'rejected';
export type AttendanceStatus = 'present' | 'absent';
export type InstitutionType = 'preescolar' | 'primaria' | 'secundaria' | 'universidad' | 'otro';

// Days of week: 0=Sunday, 1=Monday … 6=Saturday
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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
  description?: string;
  is_archived?: boolean;
  days_of_week?: DayOfWeek[];
  start_time?: string | null; // "HH:MM"
  end_time?: string | null;   // "HH:MM"
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
  // Plan-class relationship
  parent_plan_id?: string | null;
  class_id?: string | null;
  // Core fields
  title: string;
  subject?: string;
  grade?: string;
  topic?: string;
  // Extended editable fields
  objectives?: string | null;
  methodology?: string | null;
  observations?: string | null;
  // AI-generated content blob
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
  role: 'teacher' | 'coordinator';
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
  role: string | null;
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

// ── Weekly schedule helpers ────────────────────────────────────────────────

export interface WeeklyEvent {
  classId: string;
  className: string;
  subject: string;
  day: DayOfWeek;
  startTime: string;  // "HH:MM"
  endTime: string;    // "HH:MM"
  color: string;
}