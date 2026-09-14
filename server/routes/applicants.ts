import { Router } from 'express';
import Papa from 'papaparse';
import { db } from '../db';
import { requireAdminAuth } from '../auth';
import { broadcastEvent } from '../events';

const router = Router();

// Search exam rooms by examinee name (Public endpoint)
// The response intentionally contains room metadata only; examinee names and IDs are never returned.
router.get('/search', (req, res) => {
  const query = String(req.query.q || '').trim();
  if (!query) {
    return res.json([]);
  }

  const matches = db.prepare(`
    SELECT DISTINCT
      r.id,
      r.code,
      r.building,
      r.floor,
      r.level,
      r.capacity,
      r.image_url
    FROM applicants a
    JOIN rooms r ON r.id = a.room_id
    WHERE instr(lower(a.full_name), lower(?)) > 0
       OR instr(lower(a.first_name), lower(?)) > 0
       OR instr(lower(a.last_name), lower(?)) > 0
    ORDER BY r.level ASC, r.code ASC
    LIMIT 30
  `).all(query, query, query) as any[];

  res.json(matches.map((m) => ({
    room: {
      id: m.id,
      code: m.code,
      building: m.building,
      floor: m.floor,
      level: m.level,
      capacity: m.capacity,
      imageUrl: m.image_url || '',
    },
  })));
});

// Admin: Add single applicant
router.post('/', requireAdminAuth, (req, res) => {
  const { fullName, firstName, lastName, roomId } = req.body;
  const name = fullName || `${firstName || ''} ${lastName || ''}`.trim();
  
  if (!name || !roomId) {
    return res.status(400).json({ error: 'fullName (or firstName/lastName) and roomId are required' });
  }

  const id = `ex-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  db.prepare(`
    INSERT INTO applicants (id, full_name, first_name, last_name, room_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, name, firstName?.trim() || null, lastName?.trim() || null, roomId);

  broadcastEvent('applicants_updated', { roomId, applicantId: id });
  broadcastEvent('rooms_updated', { roomId });

  res.status(201).json({ id, fullName: name, firstName, lastName, roomId });
});

// Admin: Batch Add applicants
router.post('/batch', requireAdminAuth, (req, res) => {
  const { roomId, applicants } = req.body;
  if (!roomId || !Array.isArray(applicants) || applicants.length === 0) {
    return res.status(400).json({ error: 'roomId and array of applicants are required' });
  }

  const insertStmt = db.prepare(`
    INSERT INTO applicants (id, full_name, first_name, last_name, room_id)
    VALUES (?, ?, ?, ?, ?)
  `);

  const inserted: any[] = [];
  const batchTx = db.transaction(() => {
    for (const app of applicants) {
      const name = app.fullName || `${app.firstName || ''} ${app.lastName || ''}`.trim();
      if (!name) continue;
      const id = `ex-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const fn = app.firstName?.trim() || null;
      const ln = app.lastName?.trim() || null;
      insertStmt.run(id, name, fn, ln, roomId);
      inserted.push({ id, fullName: name, firstName: fn, lastName: ln });
    }
  });

  batchTx();
  broadcastEvent('applicants_updated', { roomId, count: inserted.length });
  broadcastEvent('rooms_updated', { roomId });

  res.json({ success: true, count: inserted.length, applicants: inserted });
});

// Admin: Import CSV (supports full UTF-8 Lao characters)
router.post('/import-csv', requireAdminAuth, (req, res) => {
  const { roomId, csvContent } = req.body;
  if (!roomId || !csvContent) {
    return res.status(400).json({ error: 'roomId and csvContent are required' });
  }

  const room = db.prepare('SELECT id, code FROM rooms WHERE id = ?').get(roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  // Parse CSV with UTF-8
  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = parsed.data as Record<string, any>[];
  const itemsToInsert: { fullName: string; firstName?: string; lastName?: string }[] = [];

  for (const row of rows) {
    // Look for first name / last name or full name in common Lao / English header forms
    const keys = Object.keys(row);
    let fn = '';
    let ln = '';
    let fullName = '';

    for (const key of keys) {
      const lowerKey = key.trim().toLowerCase();
      const val = String(row[key] || '').trim();

      if (['firstname', 'first_name', 'first name', 'ຊື່'].includes(lowerKey)) {
        fn = val;
      } else if (['lastname', 'last_name', 'last name', 'surname', 'ນາມສະກຸນ'].includes(lowerKey)) {
        ln = val;
      } else if (['fullname', 'full_name', 'name', 'ຊື່ ແລະ ນາມສະກຸນ', 'ຊື່ເຕັມ'].includes(lowerKey)) {
        fullName = val;
      }
    }

    // If fullName header found, use it; otherwise build from first/last
    if (fullName) {
      const parts = fullName.split(/\s+/);
      if (parts.length > 1) {
        fn = parts[0];
        ln = parts.slice(1).join(' ');
      } else {
        fn = fullName;
        ln = '-';
      }
    }

    // If headers didn't match standard names, try position 0 and 1
    if (!fn && keys.length >= 1) {
      const val0 = String(row[keys[0]] || '').trim();
      if (keys.length >= 2) {
        fn = val0;
        ln = String(row[keys[1]] || '').trim();
      } else {
        const parts = val0.split(/\s+/);
        fn = parts[0];
        ln = parts.slice(1).join(' ') || '-';
      }
    }

    const name = fullName || `${fn} ${ln}`.trim();
    if (name) {
      itemsToInsert.push({ fullName: name, firstName: fn || null, lastName: ln || null });
    }
  }

  if (itemsToInsert.length === 0) {
    return res.status(400).json({ error: 'Could not parse any valid examinee names from the CSV' });
  }

  const insertStmt = db.prepare(`
    INSERT INTO applicants (id, full_name, first_name, last_name, room_id)
    VALUES (?, ?, ?, ?, ?)
  `);

  const inserted: any[] = [];
  const importTx = db.transaction(() => {
    for (const item of itemsToInsert) {
      const id = `ex-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      insertStmt.run(id, item.fullName, item.firstName || null, item.lastName || null, roomId);
      inserted.push({ id, fullName: item.fullName, firstName: item.firstName, lastName: item.lastName });
    }
  });

  importTx();
  broadcastEvent('applicants_updated', { roomId, count: inserted.length });
  broadcastEvent('rooms_updated', { roomId });

  res.json({
    success: true,
    importedCount: inserted.length,
    applicants: inserted,
    message: `Successfully imported ${inserted.length} examinees from CSV.`,
  });
});

// Admin: Delete applicant
router.delete('/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const applicant = db.prepare('SELECT room_id FROM applicants WHERE id = ?').get(id) as any;

  db.prepare('DELETE FROM applicants WHERE id = ?').run(id);

  if (applicant) {
    broadcastEvent('applicants_updated', { roomId: applicant.room_id });
    broadcastEvent('rooms_updated', { roomId: applicant.room_id });
  }

  res.json({ success: true });
});

export default router;
