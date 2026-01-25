export enum AppView {
  CHAT = 'CHAT',
  CREATIVE = 'CREATIVE',
  VOICE = 'VOICE',
  ABOUT = 'ABOUT',
  ADMIN = 'ADMIN'
}

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  username: string;
  role: UserRole;
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