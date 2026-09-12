export type Language = 'lo' | 'en';

export type JLPTLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5';

export interface FormQuotaStat {
  totalQuota: number;
  totalRegistered: number;
  remaining: number;
  isFull: boolean;
}

export interface LevelStat {
  level: JLPTLevel;
  registered: number;
  fee: number; // in LAK
  testTime: string;
}

export interface Examinee {
  id: string;
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
}


export interface AdminUser {
  isAuthenticated: boolean;
  username: string;
  role: string;
}
