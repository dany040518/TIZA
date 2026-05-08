import { supabase } from './supabaseClient'

export interface LessonPlanSequence {
  phase: string
  description: string
  duration: number
}

export interface LessonPlan {
  id?: string
  teacher_id: string
  subject: string
  grade: string
  topic: string
  title: string
  type: string
  objective: string
  materials: string[]
  sequence: LessonPlanSequence[]
  evaluation: string
  created_at?: string
}

export async function saveLessonPlan(plan: Omit<LessonPlan, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('lesson_plans')
    .insert(plan)
    .select()
    .single()
  if (error) throw error
  return data as LessonPlan
}

export async function getLessonPlans(teacherId: string) {
  const { data, error } = await supabase
    .from('lesson_plans')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as LessonPlan[]
}

export interface Profile {
  id: string
  name: string
  institution: string
  email: string
  role: string
  created_at?: string
}

export async function upsertProfile(profile: Profile) {
  const { error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
  if (error) throw error
}
