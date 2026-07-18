export type AppRole = 'teacher' | 'admin';
export type PlanStatus = 'draft_saved' | 'pending_review' | 'approved' | 'rejected';
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

export interface Class {
  id: string;
  teacher_id: string;
  name: string;
  subject?: string | null;
  grade_level?: string | null;
  academic_period?: string | null;
  description?: string | null;
  observations?: string | null;
  color?: string | null;
  estimated_students?: number | null;
  has_special_needs?: boolean | null;
  is_archived?: boolean;
  days_of_week?: DayOfWeek[];
  start_time?: string | null;
  end_time?: string | null;
  schedule?: { day: DayOfWeek; start_time: string; end_time: string }[] | null;
  created_at?: string;
}

export interface PlanPhase {
  phase: string;
  description: string;
  duration: number;
}

export type SectionKey =
  | 'objective'
  | 'specific_objectives'
  | 'materials'
  | 'sequence'
  | 'evaluation'
  | 'reflection'
  | 'adaptations'
  | 'homework';

export const SECTION_LABELS: Record<SectionKey, string> = {
  objective:           'Objetivo general',
  specific_objectives: 'Objetivos específicos',
  materials:           'Materiales',
  sequence:            'Secuencia didáctica',
  evaluation:          'Criterios de evaluación',
  reflection:          'Reflexión pedagógica',
  adaptations:         'Adaptaciones especiales',
  homework:            'Tarea / trabajo en casa',
};

// sequence is mandatory and cannot be deselected — it's the heart of the plan
export const MANDATORY_SECTIONS: SectionKey[] = ['sequence'];

export const SECTION_PRESETS: { label: string; sections: SectionKey[] }[] = [
  {
    label: 'Completa',
    sections: ['objective', 'specific_objectives', 'materials', 'sequence', 'evaluation', 'reflection', 'adaptations', 'homework'],
  },
  {
    label: 'Express',
    sections: ['objective', 'sequence'],
  },
  {
    label: 'Con evaluación',
    sections: ['objective', 'sequence', 'evaluation'],
  },
  {
    label: 'Detallada',
    sections: ['objective', 'specific_objectives', 'materials', 'sequence', 'evaluation', 'reflection'],
  },
];

export interface PlanIdea {
  title: string;
  type: string;
  description: string;
  duration: number;
  // All content sections are optional — only present if selected
  objective?:           string;
  specific_objectives?: string[];
  materials?:           string[];
  sequence?:            PlanPhase[];
  evaluation?:          string;
  reflection?:          string;
  adaptations?:         string[];
  homework?:            string;
}

export interface LessonPlan {
  id?: string;
  teacher_id: string;
  institution_id?: string | null;
  parent_plan_id?: string | null;
  class_id?: string | null;
  title: string;
  subject?: string;
  grade?: string;
  topic?: string;
  objectives?: string | null;
  methodology?: string | null;
  observations?: string | null;
  content: PlanIdea;
  status: PlanStatus;
  selected_sections?: string[] | null;
  export_data?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
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
  subject?: string | null;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  color: string;
}
