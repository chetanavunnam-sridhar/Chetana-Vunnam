export interface Exam {
  id: string;
  title: string;
  date: Date;
  duration: number; // in minutes
  status: 'upcoming' | 'completed' | 'ongoing';
  score?: number;
}

export interface StudentStats {
  id: string;
  name: string;
  examsTaken: number;
  averageScore: number;
  tabSwitches: number;
  performanceData: { month: string; score: number }[];
}

export type View = 'home' | 'exams' | 'calendar' | 'admin' | 'login' | 'exam-session';
