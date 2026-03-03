import { supabase } from '@/integrations/supabase/client';
import type { LearningResource, StudySession, RoadmapStage, Friendship, ChatMessage, Notification } from './types';

export function assignDifficulty(type: LearningResource['type'], url: string, title?: string): LearningResource['difficulty'] {
  const combined = `${url} ${title || ''}`.toLowerCase();

  // Keyword-based classification (check title + url)
  const advancedKeywords = ['advanced', 'expert', 'mastery', 'deep dive', 'architecture', 'system design', 'optimization', 'performance'];
  const intermediateKeywords = ['intermediate', 'mid-level', 'practical', 'hands-on', 'project', 'building', 'real-world'];
  const beginnerKeywords = ['beginner', 'intro', 'getting started', 'basics', 'fundamentals', 'first steps', '101', 'for beginners'];

  if (beginnerKeywords.some(k => combined.includes(k))) return 'Beginner';
  if (advancedKeywords.some(k => combined.includes(k))) return 'Advanced';
  if (intermediateKeywords.some(k => combined.includes(k))) return 'Intermediate';

  // Type-based fallback
  if (type === 'course' || type === 'book') return 'Intermediate';
  if (type === 'tutorial') return 'Beginner';
  if (type === 'article' || type === 'podcast') return 'Beginner';
  if (type === 'video') return 'Beginner';
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
      difficulty: assignDifficulty(type, url, title),
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

// Roadmap stages
export async function getRoadmapStages(userId: string): Promise<RoadmapStage[]> {
  const { data, error } = await supabase
    .from('roadmap_stages')
    .select('*')
    .eq('user_id', userId)
    .order('stage_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as RoadmapStage[];
}

export async function addRoadmapStage(userId: string, stage: Omit<RoadmapStage, 'id' | 'user_id' | 'completed' | 'completed_at' | 'created_at'>): Promise<RoadmapStage> {
  const { data, error } = await supabase
    .from('roadmap_stages')
    .insert({ user_id: userId, ...stage })
    .select()
    .single();
  if (error) throw error;
  return data as RoadmapStage;
}

export async function toggleStageComplete(stageId: string, currentCompleted: boolean) {
  const { data, error } = await supabase
    .from('roadmap_stages')
    .update({
      completed: !currentCompleted,
      completed_at: !currentCompleted ? new Date().toISOString() : null,
    })
    .eq('id', stageId)
    .select()
    .single();
  if (error) throw error;
  return data as RoadmapStage;
}

export async function clearRoadmap(userId: string) {
  const { error } = await supabase.from('roadmap_stages').delete().eq('user_id', userId);
  if (error) throw error;
}

// Friends
export async function getFriendships(userId: string): Promise<Friendship[]> {
  const { data, error } = await supabase
    .from('friendships')
    .select('*')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
  if (error) throw error;
  return (data ?? []) as Friendship[];
}

export async function sendFriendRequest(requesterId: string, addresseeId: string) {
  const { data, error } = await supabase
    .from('friendships')
    .insert({ requester_id: requesterId, addressee_id: addresseeId })
    .select()
    .single();
  if (error) throw error;
  return data as Friendship;
}

export async function respondToFriendRequest(friendshipId: string, status: 'accepted' | 'declined') {
  const { data, error } = await supabase
    .from('friendships')
    .update({ status })
    .eq('id', friendshipId)
    .select()
    .single();
  if (error) throw error;
  return data as Friendship;
}

export async function searchProfiles(query: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, full_name')
    .ilike('full_name', `%${query}%`)
    .limit(10);
  if (error) throw error;
  return data ?? [];
}

// Chat
export async function getChatMessages(userId: string, friendId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as ChatMessage[];
}

export async function sendMessage(senderId: string, receiverId: string, content: string): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ sender_id: senderId, receiver_id: receiverId, content })
    .select()
    .single();
  if (error) throw error;
  return data as ChatMessage;
}

export async function markMessagesRead(userId: string, senderId: string) {
  await supabase
    .from('chat_messages')
    .update({ read: true })
    .eq('receiver_id', userId)
    .eq('sender_id', senderId)
    .eq('read', false);
}

// Notifications
export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as Notification[];
}

export async function markNotificationRead(notificationId: string) {
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
}

export async function markAllNotificationsRead(userId: string) {
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);
}

export async function createNotification(userId: string, type: string, title: string, message: string) {
  const { error } = await supabase
    .from('notifications')
    .insert({ user_id: userId, type, title, message });
  if (error) throw error;
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

export function getWeeklyMinutes(sessions: StudySession[]): number {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  return sessions
    .filter(s => s.session_date >= weekAgoStr)
    .reduce((sum, s) => sum + s.duration_minutes, 0);
}

export function getConsistencyScore(sessions: StudySession[]): number {
  // Score based on how many of the last 7 days had study sessions
  const now = new Date();
  const days = new Set<string>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() - i * 86400000).toISOString().split('T')[0];
    if (sessions.some(s => s.session_date === d)) days.add(d);
  }
  return Math.round((days.size / 7) * 100);
}
