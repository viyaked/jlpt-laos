export type Language = 'lo' | 'en';

export type JLPTLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5';

export interface FormQuotaStat {
  totalQuota: number;        // Total application forms available
  formsSold: number;         // Forms sold (distinct from registered applicants)
  totalRegistered: number;   // Actual examinees registered
  remainingForms: number;    // Forms available to sell
  remainingSeats: number;    // Seats available for registration (across all levels)
  isFormsFull: boolean;      // All forms sold
  isSeatsFull: boolean;      // All seats filled
  registrationOpen: boolean; // Manual toggle for registration status
}

export interface LevelStat {
  level: JLPTLevel;
  registered: number;
  quota: number;
  fee: number; // in LAK
  testTime: string;
}

export interface LevelsResponse {
  levels: LevelStat[];
  formQuota: FormQuotaStat;
  examYear: string;
  examDate: string;
  registrationDeadline?: string;
  campusMap?: string;
}

export interface Examinee {
  id: string;
  fullName?: string;
  firstName: string;
  lastName: string;
  registeredDate: string;
}

export interface ExamRoom {
  id: string;
  code: string;
  building: string;
  floor: string;
  level: JLPTLevel;
  capacity: number;
  examinees: Examinee[];
  examineeCount?: number;
  imageUrl?: string;
}

export interface RoomSearchResult {
  room: {
    id: string;
    code: string;
    building: string;
    floor: string;
    level: JLPTLevel;
    capacity: number;
    imageUrl?: string;
  };
}


export interface AdminUser {
  isAuthenticated: boolean;
  username: string;
  role: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt?: string;
}
