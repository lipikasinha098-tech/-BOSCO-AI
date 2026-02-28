
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  CREATIVE = 'CREATIVE',
  VOICE = 'VOICE',
  NOTES = 'NOTES',
  ABOUT = 'ABOUT',
  ADMIN = 'ADMIN'
}

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  username: string;
  role: UserRole;
  profilePhoto?: string; 
  level?: number;
  xp?: number;
  isPrivate?: boolean;
}

export interface Note {
  id: string;
  content: string;
  timestamp: Date;
  title: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  sources?: GroundingSource[];
  imageUrl?: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: Date;
}

export interface LogEntry {
  id: string;
  user: string;
  query: string;
  timestamp: Date;
  flagged: boolean;
}

export interface SystemConfig {
  instruction: string;
  safetyLevel: 'Standard' | 'Strict' | 'Relaxed';
  featuredPrompts: string[];
}

// Added GovernanceState interface to resolve the import error in components/FocusLock.tsx
export interface GovernanceState {
  isLocked: boolean;
  studyTimeRemaining: number;
  playTimeRemaining: number;
}
