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
  {
    id: 'room-101',
    code: 'A-101',
    building: 'Building A (ອາຄານ ອາ)',
    floor: 'Floor 1 (ຊັ້ນ 1)',
    level: 'N5',
    capacity: 35,
    examinees: [
      { id: 'ex-1', firstName: 'ອາລຸນ', lastName: 'ສີສົມບັດ', registeredDate: '2026-05-10' },
      { id: 'ex-2', firstName: 'ວິໄລພອນ', lastName: 'ວົງສະຫວັນ', registeredDate: '2026-05-10' },
      { id: 'ex-3', firstName: 'ສົມສັກ', lastName: 'ແກ້ວມະນີ', registeredDate: '2026-05-11' },
      { id: 'ex-4', firstName: 'ມະນີວັນ', lastName: 'ພອນປະເສີດ', registeredDate: '2026-05-11' },
      { id: 'ex-5', firstName: 'ທິດາລັດ', lastName: 'ຈັນທະວົງ', registeredDate: '2026-05-12' },
      { id: 'ex-6', firstName: 'ບຸນມີ', lastName: 'ໄຊຍະວົງ', registeredDate: '2026-05-12' },
      { id: 'ex-7', firstName: 'ແສງດາວ', lastName: 'ຄຳມະນີ', registeredDate: '2026-05-13' },
      { id: 'ex-8', firstName: 'ພຸດທະສອນ', lastName: 'ລັດຕະນະ', registeredDate: '2026-05-13' },
      { id: 'ex-9', firstName: 'ອານຸສອນ', lastName: 'ວໍລະຈິດ', registeredDate: '2026-05-14' },
      { id: 'ex-10', firstName: 'ສຸພັດຕຣາ', lastName: 'ໄຊສຸລິນ', registeredDate: '2026-05-14' },
      { id: 'ex-11', firstName: 'Takeshi', lastName: 'Yamamoto', registeredDate: '2026-05-15' },
      { id: 'ex-12', firstName: 'ວັນໄຊ', lastName: 'ພົມມະຈັນ', registeredDate: '2026-05-15' }
    ]
  },
  {
    id: 'room-102',
    code: 'A-102',
    building: 'Building A (ອາຄານ ອາ)',
    floor: 'Floor 1 (ຊັ້ນ 1)',
    level: 'N5',
    capacity: 35,
    examinees: [
      { id: 'ex-13', firstName: 'ເກດສະໜາ', lastName: 'ມະນີຈັນ', registeredDate: '2026-05-15' },
      { id: 'ex-14', firstName: 'ຈັນສະໝອນ', lastName: 'ຫຼວງລາດ', registeredDate: '2026-05-16' },
      { id: 'ex-15', firstName: 'ດາວວອນ', lastName: 'ສຸວັນນະສີ', registeredDate: '2026-05-16' },
      { id: 'ex-16', firstName: 'ບຸນທະວີ', lastName: 'ອິນທະວົງ', registeredDate: '2026-05-17' },
      { id: 'ex-17', firstName: 'ພອນໄຊ', lastName: 'ວົງວິຈິດ', registeredDate: '2026-05-17' },
      { id: 'ex-18', firstName: 'Michael', lastName: 'Chen', registeredDate: '2026-05-18' },
      { id: 'ex-19', firstName: 'ລັດສະໝີ', lastName: 'ສິງຫາລາດ', registeredDate: '2026-05-18' },
      { id: 'ex-20', firstName: 'ສອນເພັດ', lastName: 'ທຳມະວົງສາ', registeredDate: '2026-05-19' }
    ]
  },
  {
    id: 'room-201',
    code: 'A-201',
    building: 'Building A (ອາຄານ ອາ)',
    floor: 'Floor 2 (ຊັ້ນ 2)',
    level: 'N4',
    capacity: 35,
    examinees: [
      { id: 'ex-21', firstName: 'ຄຳຫຼ້າ', lastName: 'ແສງສຸລິຍາ', registeredDate: '2026-05-11' },
      { id: 'ex-22', firstName: 'ຈິດປະສົງ', lastName: 'ສີຫາລາດ', registeredDate: '2026-05-11' },
      { id: 'ex-23', firstName: 'ຊົມພູ', lastName: 'ພົມວິຫານ', registeredDate: '2026-05-12' },
      { id: 'ex-24', firstName: 'ດວງໃຈ', lastName: 'ວຽງສະຫວັດ', registeredDate: '2026-05-12' },
      { id: 'ex-25', firstName: 'ຕຸລາ', lastName: 'ຈັນທະລາ', registeredDate: '2026-05-13' },
      { id: 'ex-26', firstName: 'ທະນົງສັກ', lastName: 'ເພັງສະຫວັດ', registeredDate: '2026-05-13' },
      { id: 'ex-27', firstName: 'ບຸນເລີດ', lastName: 'ສຸລິວົງ', registeredDate: '2026-05-14' },
      { id: 'ex-28', firstName: 'Sarah', lastName: 'Jenkins', registeredDate: '2026-05-14' },
      { id: 'ex-29', firstName: 'ພູວຽງ', lastName: 'ສີວິໄລ', registeredDate: '2026-05-15' },
      { id: 'ex-30', firstName: 'ມະລິວັນ', lastName: 'ໄຊປັນຍາ', registeredDate: '2026-05-15' }
    ]
  },
  {
    id: 'room-202',
    code: 'A-202',
    building: 'Building A (ອາຄານ ອາ)',
    floor: 'Floor 2 (ຊັ້ນ 2)',
    level: 'N4',
    capacity: 35,
    examinees: [
      { id: 'ex-31', firstName: 'ຍອດແກ້ວ', lastName: 'ໂພທິສານ', registeredDate: '2026-05-16' },
      { id: 'ex-32', firstName: 'ລັດຕະນະ', lastName: 'ສີສົມພອນ', registeredDate: '2026-05-16' },
      { id: 'ex-33', firstName: 'ວຽງຄຳ', lastName: 'ບົວລະພັນ', registeredDate: '2026-05-17' },
      { id: 'ex-34', firstName: 'ສຸລິຍາ', lastName: 'ຈັນທະຄູນ', registeredDate: '2026-05-17' },
      { id: 'ex-35', firstName: 'ຫົງຄຳ', lastName: 'ວົງໄຊ', registeredDate: '2026-05-18' }
    ]
  },
  {
    id: 'room-301',
    code: 'B-101',
    building: 'Building B (ອາຄານ ເບ)',
    floor: 'Floor 1 (ຊັ້ນ 1)',
    level: 'N3',
    capacity: 30,
    examinees: [
      { id: 'ex-36', firstName: 'ອະນຸວັດ', lastName: 'ສີຫາປັນຍາ', registeredDate: '2026-05-10' },
      { id: 'ex-37', firstName: 'ເກສອນ', lastName: 'ໄຊຍະເສນ', registeredDate: '2026-05-10' },
      { id: 'ex-38', firstName: 'ຄຳເຜີຍ', lastName: 'ລັດຕະນະວົງ', registeredDate: '2026-05-11' },
      { id: 'ex-39', firstName: 'ງາມພອນ', lastName: 'ບຸນທະມາລີ', registeredDate: '2026-05-11' },
      { id: 'ex-40', firstName: 'ຈັນດີ', lastName: 'ວົງພະຈັນ', registeredDate: '2026-05-12' },
      { id: 'ex-41', firstName: 'Kenji', lastName: 'Sato', registeredDate: '2026-05-12' },
      { id: 'ex-42', firstName: 'ສຸວັນນາ', lastName: 'ທຳມະວົງ', registeredDate: '2026-05-13' },
      { id: 'ex-43', firstName: 'ບົວວອນ', lastName: 'ສີສຸວັນ', registeredDate: '2026-05-13' }
    ]
  },
  {
    id: 'room-401',
    code: 'B-201',
    building: 'Building B (ອາຄານ ເບ)',
    floor: 'Floor 2 (ຊັ້ນ 2)',
    level: 'N2',
    capacity: 30,
    examinees: [
      { id: 'ex-44', firstName: 'ທອງສຸກ', lastName: 'ສີວິໄຊ', registeredDate: '2026-05-08' },
      { id: 'ex-45', firstName: 'ນ້ອຍ', lastName: 'ພົມມະວົງສາ', registeredDate: '2026-05-08' },
      { id: 'ex-46', firstName: 'ບຸນຊູ', lastName: 'ຈັນທະພອນ', registeredDate: '2026-05-09' },
      { id: 'ex-47', firstName: 'ປະກາຍດາວ', lastName: 'ມະນີວົງ', registeredDate: '2026-05-09' },
      { id: 'ex-48', firstName: 'Elena', lastName: 'Rostova', registeredDate: '2026-05-10' },
      { id: 'ex-49', firstName: 'ວົງເດືອນ', lastName: 'ລາດຊະວົງ', registeredDate: '2026-05-10' }
    ]
  },
  {
    id: 'room-501',
    code: 'B-301',
    building: 'Building B (ອາຄານ ເບ)',
    floor: 'Floor 3 (ຊັ້ນ 3)',
    level: 'N1',
    capacity: 25,
    examinees: [
      { id: 'ex-50', firstName: 'ສາຍສະໝອນ', lastName: 'ສຸລິຍະວົງ', registeredDate: '2026-05-05' },
      { id: 'ex-51', firstName: 'ອາລຸນໄຊ', lastName: 'ພົມມະເສນ', registeredDate: '2026-05-05' },
      { id: 'ex-52', firstName: 'ຄຳຜົງ', lastName: 'ແກ້ວດວງດີ', registeredDate: '2026-05-06' },
      { id: 'ex-53', firstName: 'ດາວເຮືອງ', lastName: 'ຈັນທະສຸກ', registeredDate: '2026-05-06' },
      { id: 'ex-54', firstName: 'David', lastName: 'Armstrong', registeredDate: '2026-05-07' }
    ]
  }
];
