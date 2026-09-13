import type { LevelStat, ExamRoom, FormQuotaStat } from '../types';

export const initialFormQuota: FormQuotaStat = {
  totalQuota: 500,
  totalRegistered: 432,
  remaining: 68,
  isFull: false,
};

export const initialLevelStats: LevelStat[] = [
  {
    level: 'N5',
    registered: 124,
    fee: 350000,
    testTime: '09:00 - 11:30'
  },
  {
    level: 'N4',
    registered: 98,
    fee: 380000,
    testTime: '09:00 - 11:45'
  },
  {
    level: 'N3',
    registered: 92,
    fee: 420000,
    testTime: '13:30 - 16:30'
  },
  {
    level: 'N2',
    registered: 80,
    fee: 480000,
    testTime: '13:30 - 16:45'
  },
  {
    level: 'N1',
    registered: 38,
    fee: 550000,
    testTime: '13:30 - 17:00'
  }
];

export const initialExamRooms: ExamRoom[] = [
  // ── N5 ─────────────────────────────────────────────────────
  {
    id: 'room-annex4',
    code: 'ຫ້ອງ Annex 4',
    building: 'Annex Building (ຊັ້ນທີ 2)',
    floor: 'ຊັ້ນທີ 2',
    level: 'N5',
    capacity: 35,
    examinees: [
      { id: 'ex-1', firstName: 'ອາລຸນ',   lastName: 'ສີສົມບັດ',  registeredDate: '2026-05-10' },
      { id: 'ex-2', firstName: 'ວິໄລພອນ', lastName: 'ວົງສະຫວັນ', registeredDate: '2026-05-10' },
      { id: 'ex-3', firstName: 'ສົມສັກ',   lastName: 'ແກ້ວມະນີ',  registeredDate: '2026-05-11' },
      { id: 'ex-4', firstName: 'ມະນີວັນ',  lastName: 'ພອນປະເສີດ', registeredDate: '2026-05-11' },
      { id: 'ex-5', firstName: 'Takeshi',   lastName: 'Yamamoto',   registeredDate: '2026-05-12' },
    ]
  },
  {
    id: 'room-annex5',
    code: 'ຫ້ອງ Annex 5',
    building: 'Annex Building (ຊັ້ນທີ 2)',
    floor: 'ຊັ້ນທີ 2',
    level: 'N5',
    capacity: 35,
    examinees: [
      { id: 'ex-6', firstName: 'ທິດາລັດ', lastName: 'ຈັນທະວົງ', registeredDate: '2026-05-12' },
      { id: 'ex-7', firstName: 'ແສງດາວ',   lastName: 'ຄຳມະນີ',   registeredDate: '2026-05-13' },
      { id: 'ex-8', firstName: 'ບຸນມີ',    lastName: 'ໄຊຍະວົງ',  registeredDate: '2026-05-13' },
    ]
  },
  {
    id: 'room-mba',
    code: 'ຫ້ອງ MBA',
    building: 'ອາຄານ MBA',
    floor: '-',
    level: 'N5',
    capacity: 40,
    examinees: [
      { id: 'ex-9',  firstName: 'ວັນໄຊ',    lastName: 'ພົມມະຈັນ', registeredDate: '2026-05-14' },
      { id: 'ex-10', firstName: 'ພຸດທະສອນ', lastName: 'ລັດຕະນະ',  registeredDate: '2026-05-15' },
    ]
  },
  // ── N4 ─────────────────────────────────────────────────────
  {
    id: 'room-annex1',
    code: 'ຫ້ອງ Annex 1',
    building: 'Annex Building (ຊັ້ນທີ 1)',
    floor: 'ຊັ້ນທີ 1',
    level: 'N4',
    capacity: 35,
    examinees: [
      { id: 'ex-13', firstName: 'ເກດສະໜາ',  lastName: 'ມະນີຈັນ',   registeredDate: '2026-05-15' },
      { id: 'ex-14', firstName: 'ຈັນສະໝອນ', lastName: 'ຫຼວງລາດ',   registeredDate: '2026-05-16' },
      { id: 'ex-15', firstName: 'ດາວວອນ',    lastName: 'ສຸວັນນະສີ', registeredDate: '2026-05-16' },
    ]
  },
  {
    id: 'room-annex2',
    code: 'ຫ້ອງ Annex 2',
    building: 'Annex Building (ຊັ້ນທີ 1)',
    floor: 'ຊັ້ນທີ 1',
    level: 'N4',
    capacity: 35,
    examinees: [
      { id: 'ex-21', firstName: 'ຄຳຫຼ້າ',   lastName: 'ແສງສຸລິຍາ', registeredDate: '2026-05-11' },
      { id: 'ex-22', firstName: 'ຈິດປະສົງ', lastName: 'ສີຫາລາດ',   registeredDate: '2026-05-11' },
      { id: 'ex-23', firstName: 'Sarah',      lastName: 'Jenkins',    registeredDate: '2026-05-12' },
    ]
  },
  {
    id: 'room-annex3',
    code: 'ຫ້ອງ Annex 3',
    building: 'Annex Building (ຊັ້ນທີ 1)',
    floor: 'ຊັ້ນທີ 1',
    level: 'N4',
    capacity: 35,
    examinees: [
      { id: 'ex-31', firstName: 'ຍອດແກ້ວ', lastName: 'ໂພທິສານ',  registeredDate: '2026-05-16' },
      { id: 'ex-32', firstName: 'ລັດຕະນະ', lastName: 'ສີສົມພອນ', registeredDate: '2026-05-16' },
    ]
  },
  // ── N3 ─────────────────────────────────────────────────────
  {
    id: 'room-seminar1',
    code: 'ຫ້ອງ Seminar 1',
    building: 'ອາຄານຂວາ',
    floor: '-',
    level: 'N3',
    capacity: 30,
    examinees: [
      { id: 'ex-36', firstName: 'ອະນຸວັດ', lastName: 'ສີຫາປັນຍາ', registeredDate: '2026-05-10' },
      { id: 'ex-37', firstName: 'Kenji',    lastName: 'Sato',        registeredDate: '2026-05-10' },
    ]
  },
  {
    id: 'room-laonea',
    code: 'ຫ້ອງລະເນາປະສົງ',
    building: 'ອາຄານຂວາ',
    floor: '-',
    level: 'N3',
    capacity: 30,
    examinees: [
      { id: 'ex-38', firstName: 'ສຸວັນນາ', lastName: 'ທຳມະວົງ', registeredDate: '2026-05-11' },
      { id: 'ex-39', firstName: 'Michael',  lastName: 'Chen',      registeredDate: '2026-05-11' },
    ]
  },
  // ── N2 ─────────────────────────────────────────────────────
  {
    id: 'room-seminar2',
    code: 'ຫ້ອງ Seminar 2',
    building: 'ອາຄານຫຼັກ',
    floor: '-',
    level: 'N2',
    capacity: 30,
    examinees: [
      { id: 'ex-44', firstName: 'ທອງສຸກ',   lastName: 'ສີວິໄຊ',   registeredDate: '2026-05-08' },
      { id: 'ex-45', firstName: 'ວົງເດືອນ', lastName: 'ລາດຊະວົງ', registeredDate: '2026-05-08' },
    ]
  },
  {
    id: 'room-incubation',
    code: 'ຫ້ອງ Incubation Room',
    building: 'ອາຄານຂວາ',
    floor: '-',
    level: 'N2',
    capacity: 25,
    examinees: [
      { id: 'ex-46', firstName: 'Elena', lastName: 'Rostova', registeredDate: '2026-05-09' },
    ]
  },
  // ── N1 ─────────────────────────────────────────────────────
  {
    id: 'room-annex6',
    code: 'ຫ້ອງ Annex 6',
    building: 'Annex Building (ຊັ້ນທີ 2)',
    floor: 'ຊັ້ນທີ 2',
    level: 'N1',
    capacity: 25,
    examinees: [
      { id: 'ex-50', firstName: 'ສາຍສະໝອນ', lastName: 'ສຸລິຍະວົງ', registeredDate: '2026-05-05' },
      { id: 'ex-51', firstName: 'David',      lastName: 'Armstrong', registeredDate: '2026-05-05' },
    ]
  },
];

