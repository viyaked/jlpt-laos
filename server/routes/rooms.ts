import { Router } from 'express';
import { db } from '../db';
import { requireAdminAuth } from '../auth';
import { broadcastEvent } from '../events';

const router = Router();

// GET all rooms with examinee count
router.get('/', (req, res) => {
  const rooms = db.prepare(`
    SELECT 
      r.id,
      r.code,
      r.building,
      r.floor,
      r.level,
      r.capacity,
      COUNT(a.id) as examinee_count
    FROM rooms r
    LEFT JOIN applicants a ON a.room_id = r.id
    GROUP BY r.id
    ORDER BY r.level ASC, r.code ASC
  `).all() as any[];

  const formatted = rooms.map((r) => ({
    id: r.id,
    code: r.code,
    building: r.building,
    floor: r.floor,
    level: r.level,
    capacity: r.capacity,
    examineeCount: r.examinee_count,
  }));

  res.json(formatted);
});

// GET examinees in a room (Public Endpoint)
// PRIVACY RULE: Strictly returns only First & Last Name. NO seat numbers, NO contact info.
router.get('/:id/applicants', (req, res) => {
  const { id } = req.params;

  const room = db.prepare('SELECT id, code, building, floor, level, capacity FROM rooms WHERE id = ?').get(id) as any;
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const applicants = db.prepare(`
    SELECT 
      id, 
      first_name, 
      last_name 
    FROM applicants 
    WHERE room_id = ?
    ORDER BY first_name COLLATE NOCASE ASC, last_name COLLATE NOCASE ASC
  `).all(id) as any[];

  res.json({
    room: {
      id: room.id,
      code: room.code,
      building: room.building,
      floor: room.floor,
      level: room.level,
      capacity: room.capacity,
    },
    // Strictly First & Last Name only!
    applicants: applicants.map((a) => ({
      id: a.id,
      firstName: a.first_name,
      lastName: a.last_name,
    })),
  });
});

// Admin: Add new room
router.post('/', requireAdminAuth, (req, res) => {
  const { code, building, floor, level, capacity } = req.body;

  if (!code || !building || !floor || !level || !capacity) {
    return res.status(400).json({ error: 'Missing required room fields' });
  }

  const id = `room-${Date.now()}`;
  db.prepare(`
    INSERT INTO rooms (id, code, building, floor, level, capacity)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, code, building, floor, level, Number(capacity));

  broadcastEvent('rooms_updated', { id, action: 'created' });

  res.status(201).json({
    id,
    code,
    building,
    floor,
    level,
    capacity: Number(capacity),
    examineeCount: 0,
  });
});

// Admin: Edit room
router.put('/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { code, building, floor, level, capacity } = req.body;

  const existing = db.prepare('SELECT id FROM rooms WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Room not found' });
  }

  db.prepare(`
    UPDATE rooms 
    SET code = ?, building = ?, floor = ?, level = ?, capacity = ?
    WHERE id = ?
  `).run(code, building, floor, level, Number(capacity), id);

  broadcastEvent('rooms_updated', { id, action: 'updated' });

  res.json({ id, code, building, floor, level, capacity: Number(capacity) });
});

// Admin: Delete room
router.delete('/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;

  const deleteTx = db.transaction(() => {
    db.prepare('DELETE FROM applicants WHERE room_id = ?').run(id);
    db.prepare('DELETE FROM rooms WHERE id = ?').run(id);
  });

  deleteTx();
  broadcastEvent('rooms_updated', { id, action: 'deleted' });

  res.json({ success: true, message: 'Room and its applicants removed' });
});

export default router;
