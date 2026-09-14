import type { LevelStat, ExamRoom, FormQuotaStat } from '../types';

export const initialFormQuota: FormQuotaStat = {
  totalQuota: 500,
  formsSold: 0,
  totalRegistered: 0,
  remainingForms: 500,
  remainingSeats: 350,
  isFormsFull: false,
  isSeatsFull: false,
  registrationOpen: true,
};

export const initialLevelStats: LevelStat[] = [
  { level: 'N5', registered: 0, quota: 110, fee: 300000, testTime: '09:00 - 11:30' },
  { level: 'N4', registered: 0, quota: 105, fee: 300000, testTime: '09:00 - 11:45' },
  { level: 'N3', registered: 0, quota: 60, fee: 350000, testTime: '13:30 - 16:30' },
  { level: 'N2', registered: 0, quota: 55, fee: 350000, testTime: '13:30 - 16:45' },
  { level: 'N1', registered: 0, quota: 25, fee: 350000, testTime: '13:30 - 17:00' },
];

export const initialExamRooms: ExamRoom[] = [
  // ── N5 ─────────────────────────────────────────────────────
  { id: 'room-annex4',     code: 'ຫ້ອງ Annex 4',         building: 'Annex Building (ຊັ້ນທີ 2)', floor: 'ຊັ້ນທີ 2', level: 'N5', capacity: 35, examinees: [] },
  { id: 'room-annex5',     code: 'ຫ້ອງ Annex 5',         building: 'Annex Building (ຊັ້ນທີ 2)', floor: 'ຊັ້ນທີ 2', level: 'N5', capacity: 35, examinees: [] },
  { id: 'room-mba',        code: 'ຫ້ອງ MBA',              building: 'ອາຄານ MBA',                 floor: '-',         level: 'N5', capacity: 40, examinees: [] },
  // ── N4 ─────────────────────────────────────────────────────
  { id: 'room-annex1',     code: 'ຫ້ອງ Annex 1',         building: 'Annex Building (ຊັ້ນທີ 1)', floor: 'ຊັ້ນທີ 1', level: 'N4', capacity: 35, examinees: [] },
  { id: 'room-annex2',     code: 'ຫ້ອງ Annex 2',         building: 'Annex Building (ຊັ້ນທີ 1)', floor: 'ຊັ້ນທີ 1', level: 'N4', capacity: 35, examinees: [] },
  { id: 'room-annex3',     code: 'ຫ້ອງ Annex 3',         building: 'Annex Building (ຊັ້ນທີ 1)', floor: 'ຊັ້ນທີ 1', level: 'N4', capacity: 35, examinees: [] },
  // ── N3 ─────────────────────────────────────────────────────
  { id: 'room-seminar1',   code: 'ຫ້ອງ Seminar 1',       building: 'ອາຄານຂວາ',                  floor: '-',         level: 'N3', capacity: 30, examinees: [] },
  { id: 'room-laonea',     code: 'ຫ້ອງລະເນາປະສົງ',       building: 'ອາຄານຂວາ',                  floor: '-',         level: 'N3', capacity: 30, examinees: [] },
  // ── N2 ─────────────────────────────────────────────────────
  { id: 'room-seminar2',   code: 'ຫ້ອງ Seminar 2',       building: 'ອາຄານຫຼັກ',                  floor: '-',         level: 'N2', capacity: 30, examinees: [] },
  { id: 'room-incubation', code: 'ຫ້ອງ Incubation Room', building: 'ອາຄານຂວາ',                  floor: '-',         level: 'N2', capacity: 25, examinees: [] },
  // ── N1 ─────────────────────────────────────────────────────
  { id: 'room-annex6',     code: 'ຫ້ອງ Annex 6',         building: 'Annex Building (ຊັ້ນທີ 2)', floor: 'ຊັ້ນທີ 2', level: 'N1', capacity: 25, examinees: [] },
];
