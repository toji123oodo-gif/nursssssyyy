
export type ContentType = 'audio' | 'pdf' | 'video' | 'article';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  // New Fields
  timeLimit?: number; // in minutes
  passingScore?: number; // percentage
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  url: string;
  duration?: string;
  fileSize?: string;
  // For articles
  textContent?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string; // New
  duration?: string;
  contents: ContentItem[];
  quiz?: Quiz;
  isLocked?: boolean;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  subject: string;
  image: string;
  lessons: Lesson[];
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: 'admin' | 'student';
  xp: number;
  completedLessons?: string[];
  subscriptionTier: 'free' | 'pro';
  level?: number;
  streak?: number;
  joinedAt?: string;
  completedExams?: string[];
  lastDevice?: string;
  lastSeen?: string;
  quizGrades?: Record<string, number>;
  
  university?: string;
  faculty?: string;
  academicYear?: string;
  isBlocked?: boolean;
  adminNotes?: string;
  walletBalance?: number;
  subscriptionExpiry?: string;
}

export interface ActivationCode {
  id: string;
  code: string;
  isUsed: boolean;
  days: number;
  createdAt: string;
}

export interface Exam {
  id: string;
  title: string;
  code: string;
  date: string;
  time: string;
  location: string;
}
