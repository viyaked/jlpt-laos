import { Router } from 'express';
import { db, getTotalFormQuota, setSystemSetting, getExamYear, setExamYear, getExamDate, setExamDate, getFormsSold, setFormsSold, getCampusMap, setCampusMap } from '../db';
import { requireAdminAuth } from '../auth';
import { broadcastEvent } from '../events';

const router = Router();

// GET all exam levels with real-time stats, unified form quota, exam year, exam date, and campus map
router.get('/', (req, res) => {
  const formQuota = getTotalFormQuota();
  const examYear = getExamYear();
  const examDate = getExamDate();
  const campusMap = getCampusMap();

  const levels = db.prepare(`
    SELECT 
      level, 
      total_quota, 
      registered_count, 
      fee, 
      test_time,
      updated_at
    FROM exam_levels
    ORDER BY 
      CASE level
        WHEN 'N5' THEN 1
        WHEN 'N4' THEN 2
        WHEN 'N3' THEN 3
        WHEN 'N2' THEN 4
        WHEN 'N1' THEN 5
      END
  `).all() as any[];

  const formattedLevels = levels.map((lvl) => ({
    level: lvl.level,
    registeredCount: lvl.registered_count,
    total_quota: lvl.total_quota,
    fee: lvl.fee,
    testTime: lvl.test_time,
    updatedAt: lvl.updated_at,
  }));

  res.json({
    examYear,
    examDate,
    campusMap,
    formQuota: {
      totalQuota: formQuota.totalQuota,
      formsSold: formQuota.formsSold,
      totalRegistered: formQuota.totalRegistered,
      remainingForms: formQuota.remainingForms,
      remainingSeats: formQuota.remainingSeats,
      isFormsFull: formQuota.isFormsFull,
      isSeatsFull: formQuota.isSeatsFull,
      registrationOpen: formQuota.registrationOpen,
    },
    levels: formattedLevels,
  });
});

// Admin: Update Campus Master Floor Plan / Map
router.put('/campus-map', requireAdminAuth, (req, res) => {
  const { campusMap } = req.body;
  const mapValue = typeof campusMap === 'string' ? campusMap.trim() : '';
  setCampusMap(mapValue);
  broadcastEvent('levels_updated', { campusMap: mapValue });
  res.json({ success: true, campusMap: mapValue });
});

// Admin: Update Exam Schedule (Year and/or Date)
router.put('/schedule', requireAdminAuth, (req, res) => {
  const { examYear, examDate } = req.body;

  if (examYear && typeof examYear === 'string' && examYear.trim()) {
    setExamYear(examYear.trim());
  }

  if (examDate && typeof examDate === 'string' && examDate.trim()) {
    setExamDate(examDate.trim());
  }

  const updatedYear = getExamYear();
  const updatedDate = getExamDate();

  broadcastEvent('levels_updated', { examYear: updatedYear, examDate: updatedDate });

  res.json({
    success: true,
    examYear: updatedYear,
    examDate: updatedDate,
  });
});

// Admin: Update Exam Date
router.put('/date', requireAdminAuth, (req, res) => {
  const { examDate } = req.body;
  if (!examDate || typeof examDate !== 'string' || !examDate.trim()) {
    return res.status(400).json({ error: 'examDate is required' });
  }

  const cleanDate = examDate.trim();
  setExamDate(cleanDate);

  broadcastEvent('levels_updated', { examDate: cleanDate });

  res.json({
    success: true,
    examDate: cleanDate,
  });
});

// Admin: Update Exam Year (e.g., 2026, 2027)
router.put('/year', requireAdminAuth, (req, res) => {
  const { examYear } = req.body;
  if (!examYear || typeof examYear !== 'string' || !examYear.trim()) {
    return res.status(400).json({ error: 'examYear is required and must be a valid string' });
  }

  const cleanYear = examYear.trim();
  setExamYear(cleanYear);

  broadcastEvent('levels_updated', { examYear: cleanYear });

  res.json({
    success: true,
    examYear: cleanYear,
  });
});

// Admin: Update Global Form Quota and/or Forms Sold
router.put('/quota', requireAdminAuth, (req, res) => {
  const { totalQuota, formsSold } = req.body;

  if (totalQuota !== undefined) {
    if (typeof totalQuota !== 'number' || totalQuota < 1) {
      return res.status(400).json({ error: 'totalQuota must be a positive number' });
    }
    setSystemSetting('total_form_quota', String(totalQuota));
  }

  if (formsSold !== undefined) {
    if (typeof formsSold !== 'number' || formsSold < 0) {
      return res.status(400).json({ error: 'formsSold must be a non-negative number' });
    }
    setFormsSold(formsSold);
  }

  const formQuota = getTotalFormQuota();

  broadcastEvent('levels_updated', { formQuota });

  res.json({
    success: true,
    formQuota: {
      totalQuota: formQuota.totalQuota,
      formsSold: formQuota.formsSold,
      totalRegistered: formQuota.totalRegistered,
      remainingForms: formQuota.remainingForms,
      remainingSeats: formQuota.remainingSeats,
      isFormsFull: formQuota.isFormsFull,
      isSeatsFull: formQuota.isSeatsFull,
    },
  });
});

// Admin: Update Forms Sold directly
router.put('/sold', requireAdminAuth, (req, res) => {
  const { formsSold } = req.body;
  if (typeof formsSold !== 'number' || formsSold < 0) {
    return res.status(400).json({ error: 'formsSold must be a non-negative number' });
  }

  setFormsSold(formsSold);
  const formQuota = getTotalFormQuota();

  broadcastEvent('levels_updated', { formQuota });

  res.json({
    success: true,
    formQuota: {
      totalQuota: formQuota.totalQuota,
      formsSold: formQuota.formsSold,
      totalRegistered: formQuota.totalRegistered,
      remainingForms: formQuota.remainingForms,
      remainingSeats: formQuota.remainingSeats,
      isFormsFull: formQuota.isFormsFull,
      isSeatsFull: formQuota.isSeatsFull,
    },
  });
});

// Admin: Toggle Registration Open/Closed
router.put('/registration', requireAdminAuth, (req, res) => {
  const { registrationOpen } = req.body;
  if (typeof registrationOpen !== 'boolean') {
    return res.status(400).json({ error: 'registrationOpen must be a boolean' });
  }

  setRegistrationOpen(registrationOpen);
  const formQuota = getTotalFormQuota();

  broadcastEvent('levels_updated', { formQuota });

  res.json({
    success: true,
    registrationOpen,
    formQuota: {
      totalQuota: formQuota.totalQuota,
      formsSold: formQuota.formsSold,
      totalRegistered: formQuota.totalRegistered,
      remainingForms: formQuota.remainingForms,
      remainingSeats: formQuota.remainingSeats,
      isFormsFull: formQuota.isFormsFull,
      isSeatsFull: formQuota.isSeatsFull,
      registrationOpen: formQuota.registrationOpen,
    },
  });
});

// Admin: +1 quick increment for a level (adds registered examinee, NOT forms sold)
router.post('/:level/increment', requireAdminAuth, (req, res) => {
  const { level } = req.params;
  const current = db.prepare('SELECT registered_count FROM exam_levels WHERE level = ?').get(level) as any;

  if (!current) {
    return res.status(404).json({ error: 'Exam level not found' });
  }

  const formQuota = getTotalFormQuota();
  if (formQuota.remainingSeats <= 0) {
    return res.status(400).json({ error: 'Total seat quota is already full' });
  }

  const newRegistered = current.registered_count + 1;
  db.prepare(`
    UPDATE exam_levels 
    SET registered_count = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE level = ?
  `).run(newRegistered, level);

  const updatedFormQuota = getTotalFormQuota();
  broadcastEvent('levels_updated', { level, registeredCount: newRegistered, formQuota: updatedFormQuota });

  res.json({
    level,
    registeredCount: newRegistered,
    formQuota: updatedFormQuota,
  });
});

// Admin: Direct edit count, fee, and test time for a level
router.put('/:level', requireAdminAuth, (req, res) => {
  const { level } = req.params;
  const { registeredCount, fee, testTime, quota } = req.body;

  const current = db.prepare('SELECT * FROM exam_levels WHERE level = ?').get(level) as any;
  if (!current) {
    return res.status(404).json({ error: 'Exam level not found' });
  }

  let newRegistered = current.registered_count;
  let newFee = current.fee;
  let newTestTime = current.test_time;
  let newQuota = current.total_quota;

  if (registeredCount !== undefined) {
    if (typeof registeredCount !== 'number' || registeredCount < 0) {
      return res.status(400).json({ error: 'registeredCount must be a valid non-negative number' });
    }
    newRegistered = registeredCount;
    const diff = newRegistered - current.registered_count;
    const currentSold = getFormsSold();
    setFormsSold(Math.max(0, currentSold + diff));
  }

  if (fee !== undefined) {
    if (typeof fee !== 'number' || fee < 0) {
      return res.status(400).json({ error: 'fee must be a valid non-negative number' });
    }
    newFee = fee;
  }

  if (testTime !== undefined) {
    if (typeof testTime !== 'string' || !testTime.trim()) {
      return res.status(400).json({ error: 'testTime must be a valid non-empty string' });
    }
    newTestTime = testTime.trim();
  }

  if (quota !== undefined) {
    if (typeof quota !== 'number' || quota < 0) {
      return res.status(400).json({ error: 'quota must be a valid non-negative number' });
    }
    newQuota = quota;
  }

  db.prepare(`
    UPDATE exam_levels 
    SET registered_count = ?, fee = ?, test_time = ?, total_quota = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE level = ?
  `).run(newRegistered, newFee, newTestTime, newQuota, level);

  const updatedFormQuota = getTotalFormQuota();
  broadcastEvent('levels_updated', { 
    level, 
    registeredCount: newRegistered, 
    fee: newFee, 
    testTime: newTestTime,
    quota: newQuota,
    formQuota: updatedFormQuota 
  });

  res.json({
    level,
    registeredCount: newRegistered,
    fee: newFee,
    testTime: newTestTime,
    quota: newQuota,
    formQuota: updatedFormQuota,
  });
});

export default router;
