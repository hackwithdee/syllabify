export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  learning_goal: string;
  study_time_minutes: number;
  proficiency_level: string;
  weekly_hours: number;
  is_student: boolean;
  student_level: string;
  onboarding_completed: boolean;
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

export interface RoadmapStage {
  id: string;
  user_id: string;
  title: string;
  description: string;
  phase: 'foundation' | 'intermediate' | 'advanced' | 'certification';
  stage_order: number;
  completed: boolean;
  completed_at?: string | null;
  created_at: string;
}

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  metadata: Record<string, any>;
  created_at: string;
}

export type ResourceType = LearningResource['type'];
export type Difficulty = LearningResource['difficulty'];
export type Phase = RoadmapStage['phase'];
