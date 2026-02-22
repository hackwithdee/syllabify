import { User, Resource, StudySession } from './types';

const KEYS = {
  currentUser: 'syllabify_current_user',
  users: 'syllabify_users',
  resources: 'syllabify_resources',
  sessions: 'syllabify_sessions',
};

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Auth
export function getCurrentUser(): User | null {
  return get<User | null>(KEYS.currentUser, null);
}

export function setCurrentUser(user: User | null) {
  set(KEYS.currentUser, user);
}

export function getUsers(): User[] {
  return get<User[]>(KEYS.users, []);
}

export function signUp(name: string, email: string, password: string): User {
  const users = getUsers();
  if (users.find(u => u.email === email)) throw new Error('Email already registered');
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    learningGoal: '',
    studyTimeMinutes: 30,
    createdAt: new Date().toISOString(),
  };
  // Store password hash (simple for MVP)
  set(KEYS.users, [...users, { ...user, password }]);
  setCurrentUser(user);
  return user;
}

export function signIn(email: string, password: string): User {
  const users = get<(User & { password: string })[]>(KEYS.users, []);
  const found = users.find(u => u.email === email && u.password === password);
  if (!found) throw new Error('Invalid email or password');
  const { password: _, ...user } = found;
  setCurrentUser(user);
  return user;
}

export function signOut() {
  setCurrentUser(null);
}

export function updateUser(updates: Partial<User>): User {
  const current = getCurrentUser();
  if (!current) throw new Error('Not logged in');
  const updated = { ...current, ...updates };
  setCurrentUser(updated);
  const users = get<(User & { password: string })[]>(KEYS.users, []);
  set(KEYS.users, users.map(u => u.id === updated.id ? { ...u, ...updates } : u));
  return updated;
}

// Resources
export function getResources(userId: string): Resource[] {
  return get<Resource[]>(KEYS.resources, []).filter(r => r.userId === userId).sort((a, b) => a.order - b.order);
}

export function assignDifficulty(type: Resource['type'], url: string): Resource['difficulty'] {
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

export function addResource(userId: string, title: string, url: string, type: Resource['type']): Resource {
  const all = get<Resource[]>(KEYS.resources, []);
  const userResources = all.filter(r => r.userId === userId);
  const resource: Resource = {
    id: crypto.randomUUID(),
    userId,
    title,
    url,
    type,
    difficulty: assignDifficulty(type, url),
    completed: false,
    order: userResources.length,
    addedAt: new Date().toISOString(),
  };
  set(KEYS.resources, [...all, resource]);
  return resource;
}

export function toggleResourceComplete(resourceId: string): Resource {
  const all = get<Resource[]>(KEYS.resources, []);
  const idx = all.findIndex(r => r.id === resourceId);
  if (idx === -1) throw new Error('Resource not found');
  all[idx] = {
    ...all[idx],
    completed: !all[idx].completed,
    completedAt: !all[idx].completed ? new Date().toISOString() : undefined,
  };
  set(KEYS.resources, all);
  return all[idx];
}

export function deleteResource(resourceId: string) {
  const all = get<Resource[]>(KEYS.resources, []);
  set(KEYS.resources, all.filter(r => r.id !== resourceId));
}

// Sessions & Streaks
export function getSessions(userId: string): StudySession[] {
  return get<StudySession[]>(KEYS.sessions, []).filter(s => s.userId === userId);
}

export function logSession(userId: string, durationMinutes: number, resourceId?: string): StudySession {
  const all = get<StudySession[]>(KEYS.sessions, []);
  const session: StudySession = {
    id: crypto.randomUUID(),
    userId,
    date: new Date().toISOString().split('T')[0],
    durationMinutes,
    resourceId,
  };
  set(KEYS.sessions, [...all, session]);
  return session;
}

export function getStreak(userId: string): number {
  const sessions = getSessions(userId);
  const dates = [...new Set(sessions.map(s => s.date))].sort().reverse();
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

export function getProgress(userId: string): number {
  const resources = getResources(userId);
  if (resources.length === 0) return 0;
  return Math.round((resources.filter(r => r.completed).length / resources.length) * 100);
}
