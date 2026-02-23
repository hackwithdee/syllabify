import { supabase } from '@/integrations/supabase/client';
import type { LearningResource, StudySession } from './types';

export function assignDifficulty(type: LearningResource['type'], url: string): LearningResource['difficulty'] {
  const lower = url.toLowerCase();
  if (type === 'course' || type === 'book') return 'Advanced';
  if (type === 'tutorial' || type === 'video') {
    if (lower.includes('advanced') || lower.includes('expert')) return 'Advanced';
    if (lower.includes('intermediate') || lower.includes('mid')) return 'Intermediate';
    return 'Beginner';
  }
  if (type === 'article' || type === 'podcast') {
    if (lower.includes('advanced')) return 'Advanced';
    if (lower.includes('intermediate')) return 'Intermediate';
    return 'Beginner';
  }
  return 'Beginner';
}

// Resources
export async function getResources(userId: string): Promise<LearningResource[]> {
  const { data, error } = await supabase
    .from('learning_resources')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as LearningResource[];
}

export async function addResource(userId: string, title: string, url: string, type: LearningResource['type']): Promise<LearningResource> {
  const { count } = await supabase
    .from('learning_resources')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const { data, error } = await supabase
    .from('learning_resources')
    .insert({
      user_id: userId,
      title,
      url,
      type,
      difficulty: assignDifficulty(type, url),
      sort_order: count ?? 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data as LearningResource;
}

export async function toggleResourceComplete(resourceId: string, currentCompleted: boolean) {
  const { data, error } = await supabase
    .from('learning_resources')
    .update({
      completed: !currentCompleted,
      completed_at: !currentCompleted ? new Date().toISOString() : null,
    })
    .eq('id', resourceId)
    .select()
    .single();
  if (error) throw error;
  return data as LearningResource;
}

export async function deleteResource(resourceId: string) {
  const { error } = await supabase.from('learning_resources').delete().eq('id', resourceId);
  if (error) throw error;
}

// Sessions
export async function getSessions(userId: string): Promise<StudySession[]> {
  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('session_date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as StudySession[];
}

export async function logSession(userId: string, durationMinutes: number, resourceId?: string): Promise<StudySession> {
  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: userId,
      duration_minutes: durationMinutes,
      resource_id: resourceId || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as StudySession;
}

// Computed
export function getStreak(sessions: StudySession[]): number {
  const dates = [...new Set(sessions.map(s => s.session_date))].sort().reverse();
  if (dates.length === 0) return 0;
  
  const today = new Date().toISOString().split('T')[0];
  if (dates[0] !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dates[0] !== yesterday) return 0;
  }
  
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const curr = new Date(dates[i - 1]);
    const prev = new Date(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export function getProgress(resources: LearningResource[]): number {
  if (resources.length === 0) return 0;
  return Math.round((resources.filter(r => r.completed).length / resources.length) * 100);
}
