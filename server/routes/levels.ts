import { Router } from 'express';
import { db, getTotalFormQuota, setSystemSetting } from '../db';
import { requireAdminAuth } from '../auth';
import { broadcastEvent } from '../events';

const router = Router();

// GET all exam levels with real-time stats and unified form quota
router.get('/', (req, res) => {
  const formQuota = getTotalFormQuota();

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
    fee: lvl.fee,
    testTime: lvl.test_time,
    updatedAt: lvl.updated_at,
  }));

  res.json({
    formQuota: {
      totalQuota: formQuota.totalQuota,
      totalRegistered: formQuota.totalRegistered,
      remaining: formQuota.remaining,
      isFull: formQuota.remaining <= 0,
    },
    levels: formattedLevels,
  });
});

// Admin: Update Global Form Quota (Unified across all levels)
router.put('/quota', requireAdminAuth, (req, res) => {
  const { totalQuota } = req.body;
  if (typeof totalQuota !== 'number' || totalQuota < 1) {
    return res.status(400).json({ error: 'totalQuota must be a positive number' });
  }

  setSystemSetting('total_form_quota', String(totalQuota));
  const formQuota = getTotalFormQuota();

  broadcastEvent('levels_updated', { formQuota });

  res.json({
    success: true,
    formQuota: {
      totalQuota: formQuota.totalQuota,
      totalRegistered: formQuota.totalRegistered,
      remaining: formQuota.remaining,
      isFull: formQuota.remaining <= 0,
    },
  });
});

// Admin: +1 quick increment for a level (deducts from overall form quota)
router.post('/:level/increment', requireAdminAuth, (req, res) => {
  const { level } = req.params;
  const current = db.prepare('SELECT registered_count FROM exam_levels WHERE level = ?').get(level) as any;

  if (!current) {
    return res.status(404).json({ error: 'Exam level not found' });
  }

  const formQuota = getTotalFormQuota();
  if (formQuota.remaining <= 0) {
    return res.status(400).json({ error: 'Total form quota is already full' });
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

// Admin: Direct edit count for a level
router.put('/:level', requireAdminAuth, (req, res) => {
  const { level } = req.params;
  const { registeredCount } = req.body;

  if (typeof registeredCount !== 'number' || registeredCount < 0) {
    return res.status(400).json({ error: 'registeredCount must be a valid non-negative number' });
  }

  const current = db.prepare('SELECT registered_count FROM exam_levels WHERE level = ?').get(level) as any;
  if (!current) {
    return res.status(404).json({ error: 'Exam level not found' });
  }

  db.prepare(`
    UPDATE exam_levels 
    SET registered_count = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE level = ?
  `).run(registeredCount, level);

  const updatedFormQuota = getTotalFormQuota();
  broadcastEvent('levels_updated', { level, registeredCount, formQuota: updatedFormQuota });

  res.json({
    level,
    registeredCount,
    formQuota: updatedFormQuota,
  });
});

export default router;
