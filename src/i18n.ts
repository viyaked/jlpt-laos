import type { Language } from './types';

export function getAnnualExamTitle(lang: Language, year: string = '2026'): string {
  return lang === 'lo'
    ? `ການສອບເສັງວັດລະດັບພາສາຍີ່ປຸ່ນ JLPT ປະຈຳປີ ${year}`
    : `Annual Japanese Language Proficiency Test (JLPT) ${year}`;
}

export function getAnnualExamShort(lang: Language, year: string = '2026'): string {
  return lang === 'lo'
    ? `JLPT ປະຈຳປີ ${year}`
    : `Annual JLPT ${year}`;
}

export function formatExamDate(dateStr: string = '2026-07-05', lang: Language = 'lo'): { longDate: string; shortDate: string } {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    const dateObj = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

    const pad = (n: number) => String(n).padStart(2, '0');
    const shortDate = `${pad(d)}/${pad(m)}/${y}`;

    if (lang === 'lo') {
      const laoDays = ["ວັນອາທິດ", "ວັນຈັນ", "ວັນອັງຄານ", "ວັນພຸດ", "ວັນພະຫັດ", "ວັນສຸກ", "ວັນເສົາ"];
      const laoMonths = ["ມັງກອນ", "ກຸມພາ", "ມີນາ", "ເມສາ", "ພຶດສະພາ", "ມິຖຸນາ", "ກໍລະກົດ", "ສິງຫາ", "ກັນຍາ", "ຕຸລາ", "ພະຈິກ", "ທັນວາ"];
      const dayName = laoDays[dateObj.getUTCDay()];
      const monthName = laoMonths[m - 1] || "ກໍລະກົດ";
      return {
        longDate: `${dayName}, ${d} ${monthName} ${y}`,
        shortDate,
      };
    } else {
      const enDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const enMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const dayName = enDays[dateObj.getUTCDay()];
      const monthName = enMonths[m - 1] || "July";
      return {
        longDate: `${dayName}, ${monthName} ${d}, ${y}`,
        shortDate,
      };
    }
  }

  return {
    longDate: dateStr,
    shortDate: dateStr,
  };
}

export function formatRoomName(code: string, lang: Language = 'lo'): string {
  if (!code) return '';
  const trimmed = code.trim();
  if (trimmed.startsWith('ຫ້ອງ') || trimmed.toLowerCase().startsWith('room')) {
    return trimmed;
  }
  return lang === 'lo' ? `ຫ້ອງ ${trimmed}` : `Room ${trimmed}`;
}

export const translations = {
  lo: {
    // Header & Meta
    instituteName: "ສະຖາບັນລາວ-ຍີ່ປຸ່ນ",
    instituteSubtitle: "ສູນສອບເສັງມາດຕະຖານສາກົນ",
    annualExamTitle: "ການສອບເສັງວັດລະດັບພາສາຍີ່ປຸ່ນ JLPT ປະຈຳປີ 2026",
    annualExamShort: "JLPT ປະຈຳປີ 2026",
    examDate: "ວັນອາທິດ, 5 ກໍລະກົດ 2026",
    examDateLabel: "ວັນທີສອບເສັງ",
    publicView: "ໜ້າສາທາລະນະ",
    adminView: "ລະບົບເຈົ້າໜ້າທີ່ (Admin)",
    languageSwitch: "ປ່ຽນພາສາ / Language",
    logout: "ອອກຈາກລະບົບ",
    login: "ເຂົ້າສູ່ລະບົບ",
    adminBadge: "ເຈົ້າໜ້າທີ່ສະຖາບັນ",
    switchLanguagePrompt: "English",

    // Exam Schedule & Year Configuration
    editExamYearBtn: "ແກ້ໄຂປີສອບເສັງ",
    editExamScheduleBtn: "ຕັ້ງຄ່າວັນທີ & ປີສອບເສັງ",
    editExamYearModalTitle: "ແກ້ໄຂປີສອບເສັງ JLPT",
    editExamScheduleModalTitle: "ຕັ້ງຄ່າປີ ແລະ ວັນທີສອບເສັງ JLPT",
    examYearLabel: "ປີສອບເສັງ (ຄ.ສ.)",
    examYearHelp: "ປ່ຽນແປງຕົວເລກປີສອບເສັງໃນຫົວຂໍ້ ແລະ ລະບົບທັງໝົດ",
    examDateInputLabel: "ວັນທີສອບເສັງ (Exam Date)",
    examDateInputHelp: "ເລືອກວັນທີສອບເສັງຕົວຈິງ (ລະບົບຈະຄິດໄລ່ວັນໃນສັບປະດາ ແລະ ເດືອນໃຫ້ອັດຕະໂນມັດ)",
    examYearSuccess: "ອັບເດດປີສອບເສັງສຳເລັດແລ້ວ",
    examScheduleSuccess: "ອັບເດດກຳນົດການສອບເສັງສຳເລັດແລ້ວ",
    examYearCardTitle: "ກຳນົດການສອບເສັງ",
    examYearCardDesc: "ປີ ແລະ ວັນທີສຳລັບຫົວຂໍ້ການສອບເສັງ ແລະ ປ້າຍປະກາດທັງໝົດ",
    examYearPreviewLabel: "ຕົວຢ່າງຫົວຂໍ້ທີ່ຈະສະແດງ",
    examYearPlaceholder: "2026",

    // Public Dashboard
    publicWelcomeTitle: "ຂໍ້ມູນການສະໝັກ ແລະ ຫ້ອງສອບເສັງ JLPT",
    publicWelcomeSubtitle: "ຄົ້ນຫາດ້ວຍຊື່ຂອງທ່ານເພື່ອກວດເບິ່ງຫ້ອງສອບເສັງ. ຊື່ຜູ້ສອບຄົນອື່ນບໍ່ຖືກສະແດງຕໍ່ສາທາລະນະ.",
    realtimeBadge: "ອັບເດດສົດ (Real-time)",
    statusOpen: "ເປີດຮັບສະໝັກ",
    statusAlmostFull: "ໃກ້ຈະເຕັມແລ້ວ",
    statusFull: "ປິດຮັບສະໝັກ (ເຕັມ)",
    quotaOverviewTitle: "ສະຫຼຸບຍອດຜູ້ສະໝັກ ແລະ ໂຄຕ້າທີ່ເຫຼືອ (N5 - N1)",
    quotaOverviewDesc: "ແບ່ງແຍກຈຳນວນຜູ້ສະໝັກແລ້ວ ແລະ ໃບສະໝັກທີ່ເຫຼືອຢ່າງຈະແຈ້ງໃນແຕ່ລະລະດັບ",
    totalFormQuotaTitle: "ຈຳນວນຟອມທັງໝົດທຸກລະດັບ (Total Form Quota)",
    totalFormQuotaDesc: "ໂຄຕ້າຟອມສະໝັກຮ່ວມກັນທົ່ວລະບົບ ບໍ່ແຍກຕາມລະດັບ",
    totalFormsLabel: "ຈຳນວນຟອມທັງໝົດ",
    usedFormsLabel: "ຟອມທີ່ຂາຍແລ້ວ",
    remainingFormsLabel: "ຟອມທີ່ຍັງເຫຼືອ",
    unifiedFormBadge: "ໂຄຕ້າຟອມລວມ (ບໍ່ແຍກລະດັບ)",
    levelInfoTitle: "ລາຍລະອຽດແຕ່ລະລະດັບ (JLPT N5 - N1)",
    levelInfoDesc: "ສະແດງຈຳນວນຜູ້ສະໝັກ, ເວລາສອບເສັງ ແລະ ຄ່າສະໝັກໃນແຕ່ລະລະດັບ",
    registeredInLevel: "ຜູ້ສະໝັກໃນລະດັບນີ້",
    percentOfTotal: "ຂອງຜູ້ສະໝັກທັງໝົດ",
    editGlobalQuotaBtn: "ແກ້ໄຂຈຳນວນຟອມທັງໝົດ",
    editGlobalQuotaModalTitle: "ແກ້ໄຂຈຳນວນຟອມທັງໝົດ ແລະ ຟອມທີ່ຂາຍແລ້ວ",
    editFormsSoldBtn: "ແກ້ໄຂຟອມທີ່ຂາຍແລ້ວ",
    formsSoldDesc: "ຈຳນວນຟອມທີ່ຂາຍອອກແລ້ວຕົວຈິງ (ສາມາດແກ້ໄຂຕົວເລກໄດ້ໂດຍກົງ)",
    formsSoldError: "ຈຳນວນຟອມທີ່ຂາຍແລ້ວ ບໍ່ສາມາດເກີນຈຳນວນຟອມທັງໝົດໄດ້",
    editLevelRegisteredTitle: "ແກ້ໄຂຈຳນວນຜູ້ສະໝັກລະດັບ",
    editLevelModalTitle: "ແກ້ໄຂຂໍ້ມູນລະດັບ",
    editLevelModalDesc: "ແກ້ໄຂຈຳນວນຜູ້ສະໝັກ, ເວລາສອບເສັງ ແລະ ຄ່າສະໝັກສຳລັບ",
    examTimeField: "ເວລາສອບເສັງ (Exam Time)",
    examFeeField: "ຄ່າສະໝັກສອບເສັງ (Registration Fee)",
    lakUnit: "ກີບ (LAK)",
    timeFormatHint: "ຮູບແບບຕົວຢ່າງ: 09:00 - 11:30 ຫຼື 13:30 - 16:30",
    quickTimePresets: "ເລືອກເວລາແນະນຳ:",
    formUnit: "ຟອມ",
    registeredCount: "ຈຳນວນຜູ້ສະໝັກແລ້ວ",
    remainingCount: "ຈຳນວນບ່ອນນັ່ງທີ່ຍັງເຫຼືອ",
    totalQuota: "ໂຄຕ້າທັງໝົດ",
    filledPercent: "ລົງທະບຽນແລ້ວ",
    seatsLeft: "ບ່ອນນັ່ງທີ່ເຫຼືອ",
    personUnit: "ຄົນ",
    slotsUnit: "ໃບ",
    // Campus Map & Room Photos
    campusMapTitle: "ແຜນຜັງລວມສະຖານທີ່ສອບເສັງ",
    campusMapSubtitle: "ແຜນຜັງອາຄານ, ຈຸດລົງທະບຽນ ແລະ ຫ້ອງສອບເສັງທັງໝົດຂອງສະຖາບັນ",
    viewCampusMapBtn: "🗺️ ເບິ່ງແຜນຜັງລວມສະຖາບັນ",
    manageCampusMapBtn: "ຈັດການແຜນຜັງລວມ",
    uploadCampusMapBtn: "ອັບໂຫຼດແຜນຜັງໃໝ່",
    editCampusMapBtn: "ປ່ຽນແຜນຜັງ",
    deleteCampusMapBtn: "ລຶບແຜນຜັງ",
    campusMapUploadedSuccess: "ອັບເດດແຜນຜັງລວມສະຖາບັນສຳເລັດແລ້ວ!",
    campusMapDeletedSuccess: "ລຶບແຜນຜັງລວມຮຽບຮ້ອຍແລ້ວ",
    roomPhotoField: "ຮູບພາບຫ້ອງສອບເສັງ (Room Photo)",
    uploadRoomPhotoBtn: "ເລືອກຮູບຫ້ອງສອບ",
    changeRoomPhotoBtn: "ປ່ຽນຮູບພາບ",
    removeRoomPhotoBtn: "ລຶບຮູບ",
    viewRoomPhotoBtn: "ເບິ່ງຮູບຫ້ອງ",
    noRoomPhoto: "ຍັງບໍ່ມີຮູບພາບຫ້ອງສອບ",
    roomPhotoInstruction: "ຮອງຮັບໄຟລ໌ຮູບພາບ (PNG, JPG, WebP) - ລະບົບຈະປັບຂະໜາດໃຫ້ເໝາະສົມໂດຍອັດຕະໂນມັດ",
    orPasteImageUrl: "ຫຼື ວາງລິ້ງ URL ຮູບພາບ:",
    clickToEnlarge: "ກົດເພື່ອເບິ່ງຮູບຂະໜາດເຕັມ",
    imageViewerTitle: "ຮູບພາບສະຖານທີ່",

    // Rooms Section
    roomsSectionTitle: "ລາຍການຫ້ອງສອບເສັງທັງໝົດ",
    roomsSectionSubtitle: "ໃຊ້ຊື່ຂອງທ່ານຄົ້ນຫາຫ້ອງສອບເສັງ. ລາຍລະອຽດຫ້ອງເປີດເຜີຍໄດ້, ແຕ່ຊື່ຜູ້ສອບທັງໝົດເປັນຂໍ້ມູນສ່ວນຕົວ.",
    filterAllLevels: "ທຸກລະດັບ (N1 - N5)",
    filterAllBuildings: "ທຸກອາຄານ",
    searchByNameOrRoom: "ຄົ້ນຫາຊື່ຜູ້ສອບເສັງ...",
    searchByNameHint: "ພິມຊື່ ຫຼື ນາມສະກຸນຂອງທ່ານ ເພື່ອກວດເບິ່ງຫ້ອງສອບ",
    buildingLabel: "ອາຄານ",
    floorLabel: "ຊັ້ນ",
    levelLabel: "ລະດັບ",
    roomCapacity: "ຄວາມຈຸຫ້ອງ",
    examineeCount: "ຈຳນວນຜູ້ສອບ",
    viewRoomDetailsBtn: "ເບິ່ງລາຍລະອຽດຫ້ອງ",
    noRoomsFound: "ບໍ່ພົບຂໍ້ມູນຫ້ອງສອບເສັງທີ່ກົງກັບເງື່ອນໄຂ",
    roomAssignmentFound: "ພົບຫ້ອງສອບເສັງຂອງທ່ານແລ້ວ",
    roomDetailsPrivacyTitle: "ຂໍ້ມູນສ່ວນຕົວ",
    roomDetailsPrivacyDesc: "ທ່ານສາມາດກວດເບິ່ງຫ້ອງສອບເສັງຂອງທ່ານໄດ້. ຊື່ຜູ້ສອບຄົນອື່ນບໍ່ຖືກສະແດງໃນພື້ນທີ່ສາທາລະນະ.",
    roomUnit: "ຫ້ອງ",

    // Examinee Roster Modal / View
    rosterModalTitle: "ລາຍຊື່ຜູ້ມີສິດສອບເສັງ",
    privacyNoticeTitle: "ແຈ້ງເຕືອນຄວາມເປັນສ່ວນຕົວ",
    privacyNoticeDesc: "ລະບົບຈະສະແດງສະເພາະ 'ຊື່ ແລະ ນາມສະກຸນ' ຂອງຜູ້ເຂົ້າສອບເທົ່ານັ້ນ. ບໍ່ມີການສະແດງເລກທີ່ນັ່ງ ແລະ ບໍ່ມີຂໍ້ມູນຕິດຕໍ່ໃດໆ ຕາມລະບຽບການສອບເສັງ.",
    candidateNameCol: "ຊື່ ແລະ ນາມສະກຸນ (First Name & Last Name)",
    orderCol: "ລຳດັບ",
    closeBtn: "ປິດໜ້າຕ່າງ",
    totalInRoom: "ລວມທັງໝົດໃນຫ້ອງນີ້",
    emptyRoster: "ຍັງບໍ່ມີລາຍຊື່ຜູ້ສອບເສັງໃນຫ້ອງນີ້",
    searchInRoomPlaceholder: "ຄົ້ນຫາຊື່ໃນຫ້ອງນີ້...",

    // Admin Dashboard
    adminDashboardTitle: "ຈັດການລະບົບ",
    adminDashboardSubtitle: "ຈັດການໂຄຕ້າຜູ້ສະໝັກ, ປັບຕົວເລກແບບວ່ອງໄວ ແລະ ຈັດສັນຫ້ອງສອບເສັງ",
    quickAdjustTitle: "ຈັດການໂຄຕ້າ ແລະ ປັບຍອດຜູ້ສະໝັກແຕ່ລະລະດັບ",
    quickAdjustDesc: "ກົດປຸ່ມ +1 ເພື່ອເພີ່ມຜູ້ສະໝັກທັນທີ ຫຼື ກົດປຸ່ມ 'ແກ້ໄຂ' ເພື່ອກຳນົດຕົວເລກໂດຍກົງ",
    addOneBtn: "+1 ຜູ້ສະໝັກ",
    editDirectlyBtn: "ແກ້ໄຂຕົວເລກ",
    manageRoomsTitle: "ຈັດການຫ້ອງສອບເສັງ ແລະ ບັນຊີລາຍຊື່",
    manageRoomsDesc: "ເພີ່ມ, ແກ້ໄຂ, ລຶບຫ້ອງສອບເສັງ ແລະ ບັນຈຸລາຍຊື່ຜູ້ສອບເສັງເຂົ້າຫ້ອງ",
    addNewRoomBtn: "+ ເພີ່ມຫ້ອງສອບໃໝ່",
    editRoomBtn: "ແກ້ໄຂຫ້ອງ",
    deleteRoomBtn: "ລຶບຫ້ອງ",
    manageExamineesBtn: "ຈັດການລາຍຊື່ຜູ້ສອບ",
    roomNameField: "ຊື່ຫ້ອງສອບເສັງ",
    buildingField: "ອາຄານ",
    floorField: "ຊັ້ນ",
    levelField: "ລະດັບການສອບເສັງ",
    capacityField: "ຄວາມຈຸ (ຄົນ)",
    saveBtn: "ບັນທຶກຂໍ້ມູນ",
    cancelBtn: "ຍົກເລີກ",
    confirmDeleteRoom: "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຫ້ອງສອບນີ້? ລາຍຊື່ຜູ້ສອບໃນຫ້ອງຈະຖືກລຶບໄປພ້ອມກັນ.",
    
    // Manage Examinees in Admin
    addExamineeBtn: "+ ເພີ່ມຜູ້ສອບເສັງ",
    batchAddExamineeBtn: "+ ນຳເຂົ້າຫຼາຍຄົນ (Batch)",
    firstNameLabel: "ຊື່ (First Name)",
    lastNameLabel: "ນາມສະກຸນ (Last Name)",
    addExamineeTitle: "ເພີ່ມຜູ້ສອບເສັງເຂົ້າຫ້ອງ",
    batchAddTitle: "ນຳເຂົ້າລາຍຊື່ຜູ້ສອບເສັງແບບຊຸດ (Batch Import)",
    batchAddInstruction: "ວາງລາຍຊື່ຜູ້ສອບເສັງ 1 ຄົນຕໍ່ 1 ແຖວ (ຮູບແບບ: ຊື່ ນາມສະກຸນ)",
    batchAddPlaceholder: "ສົມສັກ ແກ້ວມະນີ\nມະນີວັນ ພອນປະເສີດ\nSengdao Khammany",
    processBatchBtn: "ບັນທຶກລາຍຊື່ທັງໝົດ",
    removeCandidateConfirm: "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຜູ້ສອບຄົນນີ້ອອກຈາກຫ້ອງ?",
    removeCandidateBtn: "ລຶບອອກ",
    uploadCsvBtn: "ເລືອກໄຟລ໌ CSV / Excel",
    csvUploadSuccess: "ນຳເຂົ້າໄຟລ໌ CSV ສຳເລັດແລ້ວ!",
    csvFormatHint: "ຮອງຮັບໄຟລ໌ .csv (UTF-8) ທີ່ມີຄໍລຳ: ຊື່, ນາມສະກຸນ ຫຼື First Name, Last Name",
    liveConnected: "ເຊື່ອມຕໍ່ຖານຂໍ້ມູນສົດ (Live DB)",
    connecting: "ກຳລັງໂຫຼດຂໍ້ມູນ...",

    // Direct Edit Quota Modal
    editQuotaModalTitle: "ແກ້ໄຂຕົວເລກຜູ້ສະໝັກ ແລະ ໂຄຕ້າ",
    registeredLabel: "ຈຳນວນຜູ້ສະໝັກແລ້ວ (Registered)",
    quotaLabel: "ໂຄຕ້າທັງໝົດ (Total Quota)",
    remainingComputedLabel: "ຈຳນວນທີ່ຍັງເຫຼືອຄິດໄລ່ໄດ້ (Remaining)",

// Login Modal
    loginTitle: "ລະບົບເຈົ້າໜ້າທີ່",
    loginSubtitle: "ເຂົ້າສູ່ລະບົບເພື່ອເຂົ້າຖືກການຈັດການ",
    usernameLabel: "ຊື່ຜູ້ໃຊ້ງານ (Username)",
    passwordLabel: "ລະຫັດພຸານ (Password)",
    loginSubmitBtn: "ເຂົ້າສູ່ລະບົບ",
    demoLoginBtn: "ເຂົ້າສູ່ລະບົບ (ລະຫັດທົດ)",
    loginError: "ຊື່ທີ່ໃຊ້ບໍ່ຖືກຕ້ອງ ຫຼື ລະຫັດພຸານບໍ່ຖືກຕ້ອງ (ລະຫັດທົດລອງ: admin / jlpt2026)",
    loginHint: "ລະຫັດທົດ: admin / jlpt2026",

    // Admin Account Settings
    adminSettingsBtn: "ຕັ້ງຄ່າບັນຊີ Admin",
    changePasswordModalTitle: "ຕັ້ງຄ່າບັນຊີ ແລະ ຜູ້ດູແລລະບົບ",
    changePasswordModalDesc: "ປ່ຽນລະຫັດຜ່ານ ແລະ ຈັດການບັນຊີຜູ້ດູແລລະບົບທັງໝົດ",
    currentPasswordLabel: "ລະຫັດຜ່ານປັດຈຸບັນ (Current Password)",
    newUsernameLabel: "ຊື່ຜູ້ໃຊ້ໃໝ່ (New Username)",
    newPasswordLabel: "ລະຫັດຜ່ານໃໝ່ (New Password)",
    confirmNewPasswordLabel: "ຢືນຢັນລະຫັດຜ່ານໃໝ່ (Confirm New Password)",
    passwordMismatchError: "ລະຫັດຜ່ານໃໝ່ ແລະ ຢືນຢັນລະຫັດຜ່ານບໍ່ກົງກັນ",
    credentialsUpdateSuccess: "ປ່ຽນແປງຂໍ້ມູນບັນຊີ Admin ສຳເລັດແລ້ວ!",
    adminListTitle: "ລາຍຊື່ຜູ້ດູແລລະບົບທັງໝົດ",
    addAdminBtn: "+ ເພີ່ມຜູ້ດູແລໃໝ່",
    tabChangePassword: "ປ່ຽນລະຫັດຜ່ານ",
    tabManageAdmins: "ຈັດການຜູ້ດູແລລະບົບ",
    adminRoleLabel: "ສິດການນຳໃຊ້",
    adminCreatedDate: "ວັນທີສ້າງ",
    deleteAdminConfirm: "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບບັນຊີຜູ້ດູແລນີ້?",
    adminCreatedSuccess: "ເພີ່ມຜູ້ດູແລລະບົບໃໝ່ສຳເລັດແລ້ວ!",
    adminDeletedSuccess: "ລຶບບັນຊີຜູ້ດູແລສຳເລັດແລ້ວ!",

    // Reset Data
    resetToDefaultBtn: "ຣີເຊັດຂໍ້ມູນ",
    resetSuccess: "ຣີເຊັດຂໍ້ມູນເປັນຄ່າເລີ່ມຕົ້ນຮຽບຮ້ອຍແລ້ວ!",
    saveSuccess: "ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ!",
    quotaWarning: "ຈຳນວນຜູ້ສະໝັກບໍ່ສາມາດເກີນໂຄຕ້າໄດ້",
    footerText: "ສະຖາບັນລາວ-ຍີ່ປຸ່ນ © 2026. ລະບົບຄຸ້ມຄອງການສອບເສັງວັດລະດັບພາສາຍີ່ປຸ່ນ (JLPT) ປະຈຳປີ."
  },
  en: {
    // Header & Meta
    instituteName: "Lao-Japan Institute",
    instituteSubtitle: "International Examination Center",
    annualExamTitle: "Annual Japanese Language Proficiency Test (JLPT) 2026",
    annualExamShort: "Annual JLPT 2026",
    examDate: "Sunday, July 5, 2026",
    examDateLabel: "Exam Date",
    publicView: "Public Portal",
    adminView: "Staff Admin Portal",
    languageSwitch: "Switch Language / ປ່ຽນພາສາ",
    logout: "Log Out",
    login: "Staff Login",
    adminBadge: "Institute Staff",
    switchLanguagePrompt: "ລາວ",

    // Exam Schedule & Year Configuration
    editExamYearBtn: "Edit Exam Year",
    editExamScheduleBtn: "Set Exam Date & Year",
    editExamYearModalTitle: "Edit JLPT Exam Year",
    editExamScheduleModalTitle: "Set JLPT Exam Year & Date",
    examYearLabel: "Exam Year (A.D.)",
    examYearHelp: "Change the exam year displayed in title and system-wide",
    examDateInputLabel: "Official Exam Date",
    examDateInputHelp: "Select the official exam date (system auto-formats day of week and month)",
    examYearSuccess: "Exam year updated successfully",
    examScheduleSuccess: "Exam schedule updated successfully",
    examYearCardTitle: "Exam Schedule",
    examYearCardDesc: "Year and date displayed across all headers, banners, and rosters",
    examYearPreviewLabel: "Title preview",
    examYearPlaceholder: "2026",

    // Public Dashboard
    publicWelcomeTitle: "JLPT Registration Statistics & Exam Rooms",
    publicWelcomeSubtitle: "Search with your name to find your assigned exam room. Other examinees' names are never displayed publicly.",
    realtimeBadge: "Live Synchronized",
    statusOpen: "Registration Open",
    statusAlmostFull: "Few Seats Left",
    statusFull: "Registration Closed (Full)",
    quotaOverviewTitle: "Applicant Count & Remaining Seats (N5 - N1)",
    quotaOverviewDesc: "Clear distinction between registered applicants and remaining seats for each level",
    totalFormQuotaTitle: "Total Application Form Quota",
    totalFormQuotaDesc: "Unified form quota pool across all exam levels (N1–N5)",
    totalFormsLabel: "Total Available Forms",
    usedFormsLabel: "Forms Sold",
    remainingFormsLabel: "Remaining Forms",
    unifiedFormBadge: "Unified Form Quota (Not Separated by Level)",
    levelInfoTitle: "JLPT Levels Overview (N5 - N1)",
    levelInfoDesc: "Applicant counts, exam schedule, and fees per level",
    registeredInLevel: "Applicants for this level",
    percentOfTotal: "of total applicants",
    editGlobalQuotaBtn: "Edit Total Form Quota",
    editGlobalQuotaModalTitle: "Edit Total Form Quota & Forms Sold",
    editFormsSoldBtn: "Edit Forms Sold",
    formsSoldDesc: "Number of forms actually sold (can be edited directly)",
    formsSoldError: "Forms sold cannot exceed total form quota",
    editLevelRegisteredTitle: "Edit Registered Applicants for",
    editLevelModalTitle: "Edit Exam Level Details",
    editLevelModalDesc: "Edit registered count, exam time, and fee for",
    examTimeField: "Exam Time",
    examFeeField: "Registration Fee",
    lakUnit: "LAK",
    timeFormatHint: "Example format: 09:00 - 11:30 or 13:30 - 16:30",
    quickTimePresets: "Suggested Times:",
    formUnit: "forms",
    registeredCount: "Registered Applicants",
    remainingCount: "Remaining Slots",
    totalQuota: "Total Quota",
    filledPercent: "Capacity Filled",
    seatsLeft: "Slots Available",
    personUnit: "applicants",
    slotsUnit: "seats",
    // Campus Map & Room Photos
    campusMapTitle: "Campus Floor Plan & Map",
    campusMapSubtitle: "Campus overview, registration points, and exam building layout",
    viewCampusMapBtn: "🗺️ View Campus Map",
    manageCampusMapBtn: "Manage Campus Map",
    uploadCampusMapBtn: "Upload New Map",
    editCampusMapBtn: "Change Map",
    deleteCampusMapBtn: "Remove Map",
    campusMapUploadedSuccess: "Campus map updated successfully!",
    campusMapDeletedSuccess: "Campus map removed",
    roomPhotoField: "Room Photo",
    uploadRoomPhotoBtn: "Upload Photo",
    changeRoomPhotoBtn: "Change Photo",
    removeRoomPhotoBtn: "Remove Photo",
    viewRoomPhotoBtn: "View Photo",
    noRoomPhoto: "No photo uploaded yet",
    roomPhotoInstruction: "Supports image files (PNG, JPG, WebP) - compressed automatically",
    orPasteImageUrl: "or paste image URL:",
    clickToEnlarge: "Click to view full size",
    imageViewerTitle: "Facility Photo",

    // Rooms Section
    roomsSectionTitle: "Examination Rooms Directory",
    roomsSectionSubtitle: "Use your name to find your assigned exam room. Room details are public; examinee names remain private.",
    filterAllLevels: "All Levels (N1 - N5)",
    filterAllBuildings: "All Buildings",
    searchByNameOrRoom: "Search by candidate name...",
    searchByNameHint: "Enter your name or surname to find your room",
    buildingLabel: "Building",
    floorLabel: "Floor",
    levelLabel: "Level",
    roomCapacity: "Capacity",
    examineeCount: "Examinees",
    viewRoomDetailsBtn: "View Room Details",
    noRoomsFound: "No examination rooms found matching the criteria",
    roomAssignmentFound: "Your exam room was found",
    roomDetailsPrivacyTitle: "Privacy",
    roomDetailsPrivacyDesc: "You can view your assigned exam room here. Other examinees' names are not displayed in the public portal.",
    roomUnit: "room(s)",

    // Examinee Roster Modal / View
    rosterModalTitle: "Official Examinee Roster",
    privacyNoticeTitle: "Privacy Notice",
    privacyNoticeDesc: "This roster displays ONLY the First Name & Last Name of examinees. Seat numbers and contact details are strictly omitted in compliance with examination privacy guidelines.",
    candidateNameCol: "Examinee Name (First Name & Last Name)",
    orderCol: "No.",
    closeBtn: "Close Window",
    totalInRoom: "Total examinees in this room",
    emptyRoster: "No examinees have been assigned to this room yet",
    searchInRoomPlaceholder: "Search names in this room...",

    // Admin Dashboard
    adminDashboardTitle: "Examination Administration Portal",
    adminDashboardSubtitle: "Manage applicant quotas, make instant adjustments, and organize exam rooms",
    quickAdjustTitle: "Applicant Quota & Quick Adjustments",
    quickAdjustDesc: "Click '+1' to quickly add an applicant or 'Edit' to change numbers directly",
    addOneBtn: "+1 Applicant",
    editDirectlyBtn: "Edit Count",
    manageRoomsTitle: "Exam Rooms & Examinee Rosters",
    manageRoomsDesc: "Add, edit, or delete exam rooms and assign examinee names",
    addNewRoomBtn: "+ Add New Room",
    editRoomBtn: "Edit Room",
    deleteRoomBtn: "Delete Room",
    manageExamineesBtn: "Manage Examinees",
    roomNameField: "Room Name / Code",
    buildingField: "Building",
    floorField: "Floor",
    levelField: "Examination Level",
    capacityField: "Capacity (Seats)",
    saveBtn: "Save Changes",
    cancelBtn: "Cancel",
    confirmDeleteRoom: "Are you sure you want to delete this room? All examinees in this room will also be removed.",

    // Manage Examinees in Admin
    addExamineeBtn: "+ Add Examinee",
    batchAddExamineeBtn: "+ Batch Import",
    firstNameLabel: "First Name",
    lastNameLabel: "Last Name",
    addExamineeTitle: "Add Examinee to Room",
    batchAddTitle: "Batch Import Examinees",
    batchAddInstruction: "Paste examinee names, one per line (Format: Firstname Lastname)",
    batchAddPlaceholder: "Somxay Keomany\nManivanh Phonpaseuth\nSengdao Khammany",
    processBatchBtn: "Import All Examinees",
    removeCandidateConfirm: "Are you sure you want to remove this examinee from the room?",
    removeCandidateBtn: "Remove",
    uploadCsvBtn: "Upload CSV / Excel File",
    csvUploadSuccess: "Successfully imported CSV file!",
    csvFormatHint: "Supports .csv (UTF-8) with columns: First Name, Last Name",
    liveConnected: "Live Database Connected",
    connecting: "Loading data...",


    // Direct Edit Quota Modal
    editQuotaModalTitle: "Edit Applicant Count & Quota",
    registeredLabel: "Registered Applicants",
    quotaLabel: "Total Quota",
    remainingComputedLabel: "Calculated Remaining Slots",

    // Login Modal
    loginTitle: "Staff Login",
    loginSubtitle: "Sign in to access the admin portal",
    usernameLabel: "Username",
    passwordLabel: "Password",
    loginSubmitBtn: "Log In",
    demoLoginBtn: "Sign in (Demo)",
    loginError: "Invalid username or password (Demo credentials: admin / jlpt2026)",
    loginHint: "Demo credentials: admin / jlpt2026",

    // Admin Account Settings
    adminSettingsBtn: "Admin Settings",
    changePasswordModalTitle: "Admin Account & Password Settings",
    changePasswordModalDesc: "Change administrator credentials and manage admin accounts",
    currentPasswordLabel: "Current Password",
    newUsernameLabel: "New Username",
    newPasswordLabel: "New Password",
    confirmNewPasswordLabel: "Confirm New Password",
    passwordMismatchError: "New password and confirmation do not match",
    credentialsUpdateSuccess: "Admin account credentials updated successfully!",
    adminListTitle: "Administrator Accounts",
    addAdminBtn: "+ Add New Admin",
    tabChangePassword: "Change Password",
    tabManageAdmins: "Manage Admins",
    adminRoleLabel: "Role / Permission",
    adminCreatedDate: "Created Date",
    deleteAdminConfirm: "Are you sure you want to delete this admin account?",
    adminCreatedSuccess: "New administrator created successfully!",
    adminDeletedSuccess: "Admin account deleted successfully!",

    // Reset Data
    resetToDefaultBtn: "Reset Data",
    resetSuccess: "Demo data has been reset to defaults!",
    saveSuccess: "Changes saved successfully!",
    quotaWarning: "Registered count cannot exceed total quota",
    footerText: "Lao-Japan Institute © 2026. Annual Japanese Language Proficiency Test (JLPT) Management System."
  }
};
