import { Router } from 'express';
import { db } from '../db';
import { requireAdminAuth } from '../auth';
import { broadcastEvent } from '../events';

const router = Router();

// GET all exam levels with real-time stats
router.get('/', (req, res) => {
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

  const formatted = levels.map((lvl) => ({
    level: lvl.level,
    totalQuota: lvl.total_quota,
    registeredCount: lvl.registered_count,
    remainingCount: Math.max(0, lvl.total_quota - lvl.registered_count),
    fee: lvl.fee,
    testTime: lvl.test_time,
    updatedAt: lvl.updated_at,
  }));

  res.json(formatted);
});

// Admin: +1 quick increment
router.post('/:level/increment', requireAdminAuth, (req, res) => {
  const { level } = req.params;
  const current = db.prepare('SELECT total_quota, registered_count FROM exam_levels WHERE level = ?').get(level) as any;

  if (!current) {
    return res.status(404).json({ error: 'Exam level not found' });
  }

  if (current.registered_count >= current.total_quota) {
    return res.status(400).json({ error: 'Quota is already full' });
  }

  const newRegistered = current.registered_count + 1;
  db.prepare(`
    UPDATE exam_levels 
    SET registered_count = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE level = ?
  `).run(newRegistered, level);

  broadcastEvent('levels_updated', { level, registeredCount: newRegistered });

  res.json({
    level,
    registeredCount: newRegistered,
    totalQuota: current.total_quota,
    remainingCount: current.total_quota - newRegistered,
  });
});

// Admin: Direct edit count and quota
router.put('/:level', requireAdminAuth, (req, res) => {
  const { level } = req.params;
  const { registeredCount, totalQuota } = req.body;

  if (typeof registeredCount !== 'number' || typeof totalQuota !== 'number') {
    return res.status(400).json({ error: 'registeredCount and totalQuota must be valid numbers' });
  }

  if (registeredCount < 0 || totalQuota < 0) {
    return res.status(400).json({ error: 'Values cannot be negative' });
  }

  if (registeredCount > totalQuota) {
    return res.status(400).json({ error: 'Registered count cannot exceed total quota' });
  }

  db.prepare(`
    UPDATE exam_levels 
    SET registered_count = ?, total_quota = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE level = ?
  `).run(registeredCount, totalQuota, level);

  broadcastEvent('levels_updated', { level, registeredCount, totalQuota });

  res.json({
    level,
    registeredCount,
    totalQuota,
    remainingCount: totalQuota - registeredCount,
  });
});

export default router;
