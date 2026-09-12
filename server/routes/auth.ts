import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { generateToken, requireAdminAuth } from '../auth';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
});

router.get('/me', requireAdminAuth, (req, res) => {
  res.json({ user: (req as any).user });
});

router.put('/change-credentials', requireAdminAuth, (req, res) => {
  const userId = (req as any).user.userId;
  const { currentPassword, newUsername, newPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const isMatch = bcrypt.compareSync(currentPassword, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Incorrect current password' });
  }

  let updatedUsername = user.username;
  if (newUsername && typeof newUsername === 'string' && newUsername.trim()) {
    const trimmedUsername = newUsername.trim();
    if (trimmedUsername !== user.username) {
      const existing = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(trimmedUsername, userId);
      if (existing) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      db.prepare('UPDATE users SET username = ? WHERE id = ?').run(trimmedUsername, userId);
      updatedUsername = trimmedUsername;
    }
  }

  if (newPassword && typeof newPassword === 'string' && newPassword.trim()) {
    if (newPassword.trim().length < 4) {
      return res.status(400).json({ error: 'New password must be at least 4 characters' });
    }
    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword.trim(), salt);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, userId);
  }

  const newToken = generateToken({
    userId: user.id,
    username: updatedUsername,
    role: user.role,
  });

  res.json({
    success: true,
    token: newToken,
    user: {
      id: user.id,
      username: updatedUsername,
      role: user.role,
    },
  });
});

// Admin: Get list of all administrators
router.get('/users', requireAdminAuth, (req, res) => {
  const users = db.prepare('SELECT id, username, role, created_at FROM users ORDER BY created_at ASC').all();
  res.json({ users });
});

// Admin: Create a new administrator
router.post('/users', requireAdminAuth, (req, res) => {
  const { username, password, role = 'admin' } = req.body;
  if (!username || typeof username !== 'string' || !username.trim()) {
    return res.status(400).json({ error: 'Username is required' });
  }
  const cleanUsername = username.trim();
  if (!password || typeof password !== 'string' || password.trim().length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(cleanUsername);
  if (existing) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const newId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password.trim(), salt);

  db.prepare(`
    INSERT INTO users (id, username, password_hash, role)
    VALUES (?, ?, ?, ?)
  `).run(newId, cleanUsername, passwordHash, role);

  res.status(201).json({
    success: true,
    user: {
      id: newId,
      username: cleanUsername,
      role,
      created_at: new Date().toISOString(),
    },
  });
});

// Admin: Delete an administrator
router.delete('/users/:id', requireAdminAuth, (req, res) => {
  const targetId = req.params.id;
  const currentUserId = (req as any).user.userId;

  if (targetId === currentUserId) {
    return res.status(400).json({ error: 'Cannot delete your own account while logged in' });
  }

  const countRow = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (countRow.count <= 1) {
    return res.status(400).json({ error: 'Cannot delete the only remaining admin account' });
  }

  const targetUser = db.prepare('SELECT id, username FROM users WHERE id = ?').get(targetId);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(targetId);

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

export default router;
