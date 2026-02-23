export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  learning_goal: string;
  study_time_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface LearningResource {
  id: string;
  user_id: string;
  title: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'book' | 'podcast' | 'tutorial';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  sort_order: number;
  added_at: string;
  completed_at?: string | null;
}

export interface StudySession {
  id: string;
  user_id: string;
  session_date: string;
  duration_minutes: number;
  resource_id?: string | null;
  created_at: string;
}

export type ResourceType = LearningResource['type'];
export type Difficulty = LearningResource['difficulty'];
