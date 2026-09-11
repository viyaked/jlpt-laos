# JLPT Exam Management System — Deployment Guide

## 1. Quick Local Run
```bash
# Install dependencies
npm install

# Start development mode (concurrent backend + frontend with live proxy & SSE)
npm run dev
```
Frontend runs at `http://localhost:5173`, Backend API at `http://localhost:3001`.

---

## 2. Production Single-Process Run
In production, the Express backend serves both the REST API and the compiled frontend assets from `dist/` on a single port:

```bash
# Build frontend
npm run build

# Start production server
npm run start
```
Default URL: `http://localhost:3001` (or `$PORT` environment variable).

---

## 3. Cloud Deployment (Railway, Render, Fly.io)

### Option A: Railway (Recommended)
1. Push this project to GitHub.
2. Link your repository in [Railway.app](https://railway.app).
3. Set **Build Command**: `npm run build`
4. Set **Start Command**: `npm run start`
5. Under **Volumes**, mount a persistent volume at `/app/server/data` so the SQLite database `jlpt.db` persists across redeployments.
6. Environment Variables:
   - `PORT`: `3001` (or Railway's default)
   - `JWT_SECRET`: `<any-secure-random-string>`

### Option B: Render.com
1. Create a **Web Service** connected to your repo.
2. Environment: `Node`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run start`
5. Add a Persistent Disk mounted at `/app/server/data`.

### Option C: Docker / VPS
```bash
# Build image
docker build -t jlpt-app .

# Run with volume mount for persistent database
docker run -d -p 3001:3001 -v $(pwd)/server/data:/app/server/data --name jlpt-app jlpt-app
```

---

## 4. Scaling & Migrating to PostgreSQL
If your organization scales to tens of thousands of applicants:
1. SQLite in WAL mode already handles hundreds of concurrent readers with zero maintenance.
2. The schema (`exam_levels`, `rooms`, `applicants`, `users`) uses standard SQL data types.
3. You can swap `better-sqlite3` for `pg` or Prisma with Postgres (e.g., Supabase, Neon, AWS RDS) by updating `server/db.ts` to use `pg.Pool`.
