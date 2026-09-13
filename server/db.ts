import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';

const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), 'server/data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, 'jlpt.db');
export const db = new Database(DB_PATH);


// Enable WAL mode for high performance concurrent multi-user access
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS exam_levels (
      level TEXT PRIMARY KEY,
      total_quota INTEGER NOT NULL,
      registered_count INTEGER NOT NULL DEFAULT 0,
      fee INTEGER NOT NULL,
      test_time TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      building TEXT NOT NULL,
      floor TEXT NOT NULL,
      level TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (level) REFERENCES exam_levels(level) ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS applicants (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      room_id TEXT,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Migration: Ensure image_url column exists in rooms table
  const roomColumns = db.prepare("PRAGMA table_info(rooms)").all() as any[];
  const hasImageUrl = roomColumns.some((col: any) => col.name === 'image_url');
  if (!hasImageUrl) {
    db.exec("ALTER TABLE rooms ADD COLUMN image_url TEXT");
  }

  // Initialize default system settings
  const existingQuota = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('total_form_quota');
  if (!existingQuota) {
    db.prepare('INSERT INTO system_settings (key, value) VALUES (?, ?)').run('total_form_quota', '500');
  }

  const existingYear = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('exam_year');
  if (!existingYear) {
    db.prepare('INSERT INTO system_settings (key, value) VALUES (?, ?)').run('exam_year', '2026');
  }

  const existingDate = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('exam_date');
  if (!existingDate) {
    db.prepare('INSERT INTO system_settings (key, value) VALUES (?, ?)').run('exam_date', '2026-07-05');
  }

  // Seed default admin user if not exists
  const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!existingAdmin) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('jlpt2026', salt);
    db.prepare(`
      INSERT INTO users (id, username, password_hash, role)
      VALUES (?, ?, ?, ?)
    `).run('admin-1', 'admin', hash, 'admin');
    console.log('Default admin initialized: username=admin password=jlpt2026');
  }

  // Seed default exam levels if empty
  const levelsCount = db.prepare('SELECT COUNT(*) as count FROM exam_levels').get() as { count: number };
  if (levelsCount.count === 0) {
    seedDefaultData();
  } else {
    // Ensure room codes have ຫ້ອງ prefix
    db.prepare(`UPDATE rooms SET code = 'ຫ້ອງ ' || code WHERE code NOT LIKE 'ຫ້ອງ%' AND code NOT LIKE 'Room%'`).run();
  }
}

export function getCampusMap(): string {
  return getSystemSetting('campus_map_image', '');
}

export function setCampusMap(imageUrl: string): void {
  setSystemSetting('campus_map_image', imageUrl);
}

export function getSystemSetting(key: string, defaultValue: string): string {
  const row = db.prepare('SELECT value FROM system_settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row ? row.value : defaultValue;
}

export function setSystemSetting(key: string, value: string): void {
  db.prepare(`
    INSERT INTO system_settings (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, value);
}

export function getExamYear(): string {
  return getSystemSetting('exam_year', '2026');
}

export function setExamYear(year: string): void {
  setSystemSetting('exam_year', year);
}

export function getExamDate(): string {
  return getSystemSetting('exam_date', '2026-07-05');
}

export function setExamDate(date: string): void {
  setSystemSetting('exam_date', date);
}

export function getFormsSold(): number {
  const soldStr = getSystemSetting('forms_sold', '');
  if (soldStr !== '') {
    const parsed = parseInt(soldStr, 10);
    if (!isNaN(parsed) && parsed >= 0) return parsed;
  }
  const regRow = db.prepare('SELECT COALESCE(SUM(registered_count), 0) as total FROM exam_levels').get() as { total: number };
  return regRow.total;
}

export function setFormsSold(count: number): void {
  setSystemSetting('forms_sold', String(Math.max(0, count)));
}

export function getTotalFormQuota(): { totalQuota: number; totalRegistered: number; remaining: number } {
  const quotaStr = getSystemSetting('total_form_quota', '500');
  const totalQuota = parseInt(quotaStr, 10) || 500;
  const totalRegistered = getFormsSold();
  const remaining = Math.max(0, totalQuota - totalRegistered);
  return { totalQuota, totalRegistered, remaining };
}

export function seedDefaultData() {
  const insertLevel = db.prepare(`
    INSERT INTO exam_levels (level, total_quota, registered_count, fee, test_time)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertRoom = db.prepare(`
    INSERT INTO rooms (id, code, building, floor, level, capacity)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertApplicant = db.prepare(`
    INSERT INTO applicants (id, first_name, last_name, room_id, registered_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Run in a transaction
  const seedTx = db.transaction(() => {
    // Clear existing data
    db.prepare('DELETE FROM applicants').run();
    db.prepare('DELETE FROM rooms').run();
    db.prepare('DELETE FROM exam_levels').run();

    // 0. Settings
    setSystemSetting('total_form_quota', '500');
    setSystemSetting('forms_sold', '432');
    setSystemSetting('exam_year', '2026');
    setSystemSetting('exam_date', '2026-07-05');

    // 1. Levels
    insertLevel.run('N5', 150, 124, 350000, '09:00 - 11:30');
    insertLevel.run('N4', 120, 98, 380000, '09:00 - 11:45');
    insertLevel.run('N3', 100, 92, 420000, '13:30 - 16:30');
    insertLevel.run('N2', 80, 80, 480000, '13:30 - 16:45');
    insertLevel.run('N1', 50, 38, 550000, '13:30 - 17:00');

    // 2. Rooms — ຕາມແຜນທີ່ LJI Campus
    const rooms = [
      // ── N5 ──────────────────────────────────────────────────
      { id: 'room-annex4',  code: 'ຫ້ອງ Annex 4',         building: 'Annex Building (ຊັ້ນທີ 2)', floor: 'ຊັ້ນທີ 2', level: 'N5', capacity: 35 },
      { id: 'room-annex5',  code: 'ຫ້ອງ Annex 5',         building: 'Annex Building (ຊັ້ນທີ 2)', floor: 'ຊັ້ນທີ 2', level: 'N5', capacity: 35 },
      { id: 'room-mba',     code: 'ຫ້ອງ MBA',              building: 'ອາຄານ MBA',                 floor: '-',         level: 'N5', capacity: 40 },
      // ── N4 ──────────────────────────────────────────────────
      { id: 'room-annex1',  code: 'ຫ້ອງ Annex 1',         building: 'Annex Building (ຊັ້ນທີ 1)', floor: 'ຊັ້ນທີ 1', level: 'N4', capacity: 35 },
      { id: 'room-annex2',  code: 'ຫ້ອງ Annex 2',         building: 'Annex Building (ຊັ້ນທີ 1)', floor: 'ຊັ້ນທີ 1', level: 'N4', capacity: 35 },
      { id: 'room-annex3',  code: 'ຫ້ອງ Annex 3',         building: 'Annex Building (ຊັ້ນທີ 1)', floor: 'ຊັ້ນທີ 1', level: 'N4', capacity: 35 },
      // ── N3 ──────────────────────────────────────────────────
      { id: 'room-seminar1',    code: 'ຫ້ອງ Seminar 1',           building: 'ອາຄານຂວາ',  floor: '-', level: 'N3', capacity: 30 },
      { id: 'room-laonea',      code: 'ຫ້ອງລະເນາປະສົງ',           building: 'ອາຄານຂວາ',  floor: '-', level: 'N3', capacity: 30 },
      // ── N2 ──────────────────────────────────────────────────
      { id: 'room-seminar2',    code: 'ຫ້ອງ Seminar 2',           building: 'ອາຄານຫຼັກ',  floor: '-', level: 'N2', capacity: 30 },
      { id: 'room-incubation',  code: 'ຫ້ອງ Incubation Room',     building: 'ອາຄານຂວາ',  floor: '-', level: 'N2', capacity: 25 },
      // ── N1 ──────────────────────────────────────────────────
      { id: 'room-annex6',  code: 'ຫ້ອງ Annex 6',         building: 'Annex Building (ຊັ້ນທີ 2)', floor: 'ຊັ້ນທີ 2', level: 'N1', capacity: 25 },
    ];

    for (const r of rooms) {
      insertRoom.run(r.id, r.code, r.building, r.floor, r.level, r.capacity);
    }

    // 3. Sample applicants
    const sampleApplicants = [
      // N5 — Annex 4
      { id: 'ex-1',  first_name: 'ອາລຸນ',      last_name: 'ສີສົມບັດ',   room_id: 'room-annex4', date: '2026-05-10' },
      { id: 'ex-2',  first_name: 'ວິໄລພອນ',    last_name: 'ວົງສະຫວັນ',  room_id: 'room-annex4', date: '2026-05-10' },
      { id: 'ex-3',  first_name: 'ສົມສັກ',      last_name: 'ແກ້ວມະນີ',   room_id: 'room-annex4', date: '2026-05-11' },
      { id: 'ex-4',  first_name: 'ມະນີວັນ',     last_name: 'ພອນປະເສີດ',  room_id: 'room-annex4', date: '2026-05-11' },
      { id: 'ex-5',  first_name: 'Takeshi',      last_name: 'Yamamoto',    room_id: 'room-annex4', date: '2026-05-12' },
      // N5 — Annex 5
      { id: 'ex-6',  first_name: 'ທິດາລັດ',    last_name: 'ຈັນທະວົງ',   room_id: 'room-annex5', date: '2026-05-12' },
      { id: 'ex-7',  first_name: 'ແສງດາວ',      last_name: 'ຄຳມະນີ',     room_id: 'room-annex5', date: '2026-05-13' },
      { id: 'ex-8',  first_name: 'ບຸນມີ',       last_name: 'ໄຊຍະວົງ',    room_id: 'room-annex5', date: '2026-05-13' },
      // N5 — MBA
      { id: 'ex-9',  first_name: 'ວັນໄຊ',       last_name: 'ພົມມະຈັນ',   room_id: 'room-mba',    date: '2026-05-14' },
      { id: 'ex-10', first_name: 'ພຸດທະສອນ',   last_name: 'ລັດຕະນະ',    room_id: 'room-mba',    date: '2026-05-15' },
      // N4 — Annex 1
      { id: 'ex-13', first_name: 'ເກດສະໜາ',    last_name: 'ມະນີຈັນ',    room_id: 'room-annex1', date: '2026-05-15' },
      { id: 'ex-14', first_name: 'ຈັນສະໝອນ',   last_name: 'ຫຼວງລາດ',    room_id: 'room-annex1', date: '2026-05-16' },
      { id: 'ex-15', first_name: 'ດາວວອນ',      last_name: 'ສຸວັນນະສີ',  room_id: 'room-annex1', date: '2026-05-16' },
      // N4 — Annex 2
      { id: 'ex-21', first_name: 'ຄຳຫຼ້າ',     last_name: 'ແສງສຸລິຍາ',  room_id: 'room-annex2', date: '2026-05-11' },
      { id: 'ex-22', first_name: 'ຈິດປະສົງ',   last_name: 'ສີຫາລາດ',    room_id: 'room-annex2', date: '2026-05-11' },
      { id: 'ex-23', first_name: 'Sarah',        last_name: 'Jenkins',     room_id: 'room-annex2', date: '2026-05-12' },
      // N4 — Annex 3
      { id: 'ex-31', first_name: 'ຍອດແກ້ວ',    last_name: 'ໂພທິສານ',    room_id: 'room-annex3', date: '2026-05-16' },
      { id: 'ex-32', first_name: 'ລັດຕະນະ',    last_name: 'ສີສົມພອນ',   room_id: 'room-annex3', date: '2026-05-16' },
      // N3 — Seminar 1
      { id: 'ex-36', first_name: 'ອະນຸວັດ',    last_name: 'ສີຫາປັນຍາ',  room_id: 'room-seminar1', date: '2026-05-10' },
      { id: 'ex-37', first_name: 'Kenji',        last_name: 'Sato',        room_id: 'room-seminar1', date: '2026-05-10' },
      // N3 — ຫ້ອງລະເນາປະສົງ
      { id: 'ex-38', first_name: 'ສຸວັນນາ',    last_name: 'ທຳມະວົງ',    room_id: 'room-laonea',   date: '2026-05-11' },
      { id: 'ex-39', first_name: 'Michael',      last_name: 'Chen',        room_id: 'room-laonea',   date: '2026-05-11' },
      // N2 — Seminar 2
      { id: 'ex-44', first_name: 'ທອງສຸກ',     last_name: 'ສີວິໄຊ',     room_id: 'room-seminar2', date: '2026-05-08' },
      { id: 'ex-45', first_name: 'ວົງເດືອນ',   last_name: 'ລາດຊະວົງ',   room_id: 'room-seminar2', date: '2026-05-08' },
      // N2 — Incubation Room
      { id: 'ex-46', first_name: 'Elena',        last_name: 'Rostova',     room_id: 'room-incubation', date: '2026-05-09' },
      // N1 — Annex 6
      { id: 'ex-50', first_name: 'ສາຍສະໝອນ',  last_name: 'ສຸລິຍະວົງ',  room_id: 'room-annex6', date: '2026-05-05' },
      { id: 'ex-51', first_name: 'David',        last_name: 'Armstrong',   room_id: 'room-annex6', date: '2026-05-05' },
    ];

    for (const a of sampleApplicants) {
      insertApplicant.run(a.id, a.first_name, a.last_name, a.room_id, a.date);
    }
  });

  seedTx();
  console.log('Initial JLPT database seeded successfully.');
}
