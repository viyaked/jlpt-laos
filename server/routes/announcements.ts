import { Router } from 'express';
import {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncementRecord,
  updateAnnouncementRecord,
  deleteAnnouncementRecord,
} from '../db';
import { requireAdminAuth } from '../auth';
import { broadcastEvent } from '../events';

const router = Router();

// GET all announcements (Public)
router.get('/', (_req, res) => {
  try {
    const announcements = getAllAnnouncements();
    res.json(announcements);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch announcements' });
  }
});

// GET announcement by ID (Public)
router.get('/:id', (req, res) => {
  try {
    const announcement = getAnnouncementById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch announcement' });
  }
});

// POST new announcement (Admin only)
router.post('/', requireAdminAuth, (req, res) => {
  try {
    const { title, content, imageUrl, isPinned } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Announcement title is required' });
    }

    const created = createAnnouncementRecord({
      title,
      content,
      imageUrl,
      isPinned: Boolean(isPinned),
    });

    broadcastEvent('announcements_updated', { id: created.id, action: 'created' });

    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create announcement' });
  }
});

// PUT update announcement (Admin only)
router.put('/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, imageUrl, isPinned } = req.body;

    const existing = getAnnouncementById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    if (title !== undefined && (!title || typeof title !== 'string' || !title.trim())) {
      return res.status(400).json({ error: 'Announcement title cannot be empty' });
    }

    const updated = updateAnnouncementRecord(id, {
      title,
      content,
      imageUrl,
      isPinned,
    });

    broadcastEvent('announcements_updated', { id, action: 'updated' });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update announcement' });
  }
});

// DELETE announcement (Admin only)
router.delete('/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteAnnouncementRecord(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    broadcastEvent('announcements_updated', { id, action: 'deleted' });

    res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete announcement' });
  }
});

export default router;
