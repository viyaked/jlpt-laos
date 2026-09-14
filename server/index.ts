import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { initDatabase, seedDefaultData } from './db';
import { registerSSEClient, broadcastEvent } from './events';
import authRouter from './routes/auth';
import levelsRouter from './routes/levels';
import roomsRouter from './routes/rooms';
import applicantsRouter from './routes/applicants';
import announcementsRouter from './routes/announcements';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize persistent SQLite database with WAL mode
initDatabase();

// SSE Real-time stream endpoint
app.get('/api/events', (req, res) => {
  registerSSEClient(res);
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/levels', levelsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/applicants', applicantsRouter);
app.use('/api/announcements', announcementsRouter);

// Reset demo endpoint
app.post('/api/reset-demo', (req, res) => {
  seedDefaultData();
  broadcastEvent('levels_updated');
  broadcastEvent('rooms_updated');
  broadcastEvent('applicants_updated');
  broadcastEvent('announcements_updated');
  res.json({ success: true, message: 'Database reset to default seed data' });
});

// In production, serve the built Vite frontend
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(process.cwd(), 'dist');
  app.use(express.static(distPath));

  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      next();
    }
  });
}


app.listen(PORT, () => {
  console.log(`🚀 JLPT Management Backend running on http://localhost:${PORT}`);
  console.log(`📡 Real-time SSE stream available at http://localhost:${PORT}/api/events`);
});
