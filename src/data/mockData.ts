import type { LevelStat, ExamRoom, FormQuotaStat } from '../types';

export const initialFormQuota: FormQuotaStat = {
  totalQuota: 500,
  formsSold: 0,
  totalRegistered: 0,
  remainingForms: 500,
  remainingSeats: 500,
  isFormsFull: false,
  isSeatsFull: false,
  registrationOpen: true,
};

export const initialLevelStats: LevelStat[] = [
  { level: 'N5', registered: 0, quota: 150, fee: 350000, testTime: '09:00 - 11:30' },
  { level: 'N4', registered: 0, quota: 120, fee: 380000, testTime: '09:00 - 11:45' },
  { level: 'N3', registered: 0, quota: 100, fee: 420000, testTime: '13:30 - 16:30' },
  { level: 'N2', registered: 0, quota: 80, fee: 480000, testTime: '13:30 - 16:45' },
  { level: 'N1', registered: 0, quota: 50, fee: 550000, testTime: '13:30 - 17:00' },
];

export const initialExamRooms: ExamRoom[] = [
  // ── N5 ─────────────────────────────────────────────────────
  { id: 'room-annex4',     code: 'ຫ້ອງ Annex 4',         building: 'Annex Building', floor: '2', level: 'N5', capacity: 35, examinees: [] },
  { id: 'room-annex5',     code: 'ຫ້ອງ Annex 5',         building: 'Annex Building', floor: '2', level: 'N5', capacity: 35, examinees: [] },
  { id: 'room-mba',        code: 'ຫ້ອງ MBA',              building: 'ອາຄານ MBA',      floor: '1', level: 'N5', capacity: 40, examinees: [] },
  // ── N4 ─────────────────────────────────────────────────────
  { id: 'room-annex1',     code: 'ຫ້ອງ Annex 1',         building: 'Annex Building', floor: '1', level: 'N4', capacity: 35, examinees: [] },
  { id: 'room-annex2',     code: 'ຫ້ອງ Annex 2',         building: 'Annex Building', floor: '1', level: 'N4', capacity: 35, examinees: [] },
  { id: 'room-annex3',     code: 'ຫ້ອງ Annex 3',         building: 'Annex Building', floor: '1', level: 'N4', capacity: 35, examinees: [] },
  // ── N3 ─────────────────────────────────────────────────────
  { id: 'room-seminar1',   code: 'ຫ້ອງ Seminar 1',       building: 'ອາຄານຫຼັກ',      floor: '1', level: 'N3', capacity: 30, examinees: [] },
  { id: 'room-laonea',     code: 'ຫ້ອງອະເນກປະສົງ',       building: 'ອາຄານຫຼັກ',      floor: '1', level: 'N3', capacity: 30, examinees: [] },
  // ── N2 ─────────────────────────────────────────────────────
  { id: 'room-seminar2',   code: 'ຫ້ອງ Seminar 2',       building: 'ອາຄານຫຼັກ',      floor: '1', level: 'N2', capacity: 30, examinees: [] },
  { id: 'room-incubation', code: 'ຫ້ອງ Incubation Room', building: 'ອາຄານຫຼັກ',      floor: '1', level: 'N2', capacity: 25, examinees: [] },
  // ── N1 ─────────────────────────────────────────────────────
  { id: 'room-annex6',     code: 'ຫ້ອງ Annex 6',         building: 'Annex Building', floor: '2', level: 'N1', capacity: 25, examinees: [] },
];
