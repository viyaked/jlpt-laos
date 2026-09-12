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

export default router;
