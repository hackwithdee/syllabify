export interface User {
  id: string;
  name: string;
  email: string;
  learningGoal: string;
  studyTimeMinutes: number;
  createdAt: string;
}

export interface Resource {
  id: string;
  userId: string;
  title: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'book' | 'podcast' | 'tutorial';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  order: number;
  addedAt: string;
  completedAt?: string;
}

export interface StudySession {
  id: string;
  userId: string;
  date: string;
  durationMinutes: number;
  resourceId?: string;
}

export type ResourceType = Resource['type'];
export type Difficulty = Resource['difficulty'];
