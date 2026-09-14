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
      full_name TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      room_id TEXT,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      image_url TEXT,
      is_pinned INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration: Ensure image_url column exists in rooms table
  const roomColumns = db.prepare("PRAGMA table_info(rooms)").all() as any[];
  const hasImageUrl = roomColumns.some((col: any) => col.name === 'image_url');
  if (!hasImageUrl) {
    db.exec("ALTER TABLE rooms ADD COLUMN image_url TEXT");
  }

  // Migration: Ensure full_name column exists in applicants table
  const applicantColumns = db.prepare("PRAGMA table_info(applicants)").all() as any[];
  const hasFullName = applicantColumns.some((col: any) => col.name === 'full_name');
  if (!hasFullName) {
    db.exec("ALTER TABLE applicants ADD COLUMN full_name TEXT");
    // Backfill full_name from first_name + last_name for existing records
    db.exec(`
      UPDATE applicants 
      SET full_name = COALESCE(first_name, '') || ' ' || COALESCE(last_name, '') 
      WHERE full_name IS NULL OR full_name = ''
    `);
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

  // Initialize registration_open setting (default true)
  const existingRegOpen = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('registration_open');
  if (!existingRegOpen) {
    db.prepare('INSERT INTO system_settings (key, value) VALUES (?, ?)').run('registration_open', 'true');
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
    // Fix room name for multipurpose room
    db.prepare(`UPDATE rooms SET code = 'ຫ້ອງອະເນກປະສົງ' WHERE code = 'ຫ້ອງລະເນາປະສົງ' OR (id = 'room-laonea' AND code LIKE '%ປະສົງ%')`).run();
    // Update building name from ອາຄານຂວາ to ອາຄານຫຼັກ
    db.prepare(`UPDATE rooms SET building = 'ອາຄານຫຼັກ' WHERE building = 'ອາຄານຂວາ'`).run();
  }

  // Seed default announcement if empty
  const announcementsCount = db.prepare('SELECT COUNT(*) as count FROM announcements').get() as { count: number };
  if (announcementsCount.count === 0) {
    db.prepare(`
      INSERT INTO announcements (id, title, content, image_url, is_pinned, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(
      'announcement-welcome',
      'ຂໍ້ແນະນຳ ແລະ ລະບຽບການເຂົ້າຫ້ອງສອບເສັງ JLPT',
      'ກະລຸນາມາກ່ອນເວລາສອບເສັງຢ່າງໜ້ອຍ 30 ນາທີ. ນຳເອົາບັດປະຈຳຕົວ ຫຼື ໜັງສືຜ່ານແດນຕົວຈິງ ແລະ ບັດສອບເສັງ (Test Voucher) ມາສະແດງຕໍ່ກຳມະການ. ຫ້າມນຳເອົາໂທລະສັບມືຖື, ໂມງອັດສະລິຍະ ແລະ ອຸປະກອນອີເລັກໂຕຣນິກທຸກຊະນິດເຂົ້າຫ້ອງສອບເສັງ.',
      '',
      1
    );
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

export function getRegistrationOpen(): boolean {
  const val = getSystemSetting('registration_open', 'true');
  return val === 'true';
}

export function setRegistrationOpen(open: boolean): void {
  setSystemSetting('registration_open', open ? 'true' : 'false');
}

export function getFormsSold(): number {
  const soldStr = getSystemSetting('forms_sold', '');
  if (soldStr !== '') {
    const parsed = parseInt(soldStr, 10);
    if (!isNaN(parsed) && parsed >= 0) return parsed;
  }
  return 0;
}

export function setFormsSold(count: number): void {
  setSystemSetting('forms_sold', String(Math.max(0, count)));
}

export function getTotalFormQuota(): { totalQuota: number; formsSold: number; totalRegistered: number; remainingForms: number; remainingSeats: number; isFormsFull: boolean; isSeatsFull: boolean; registrationOpen: boolean } {
  const quotaStr = getSystemSetting('total_form_quota', '500');
  const totalQuota = parseInt(quotaStr, 10) || 500;
  const formsSold = getFormsSold();
  const totalRegistered = db.prepare('SELECT COALESCE(SUM(registered_count), 0) as total FROM exam_levels').get() as { total: number };
  const registered = totalRegistered.total;
  const remainingForms = Math.max(0, totalQuota - formsSold);
  const totalSeats = db.prepare('SELECT COALESCE(SUM(total_quota), 0) as total FROM exam_levels').get() as { total: number };
  const remainingSeats = Math.max(0, totalSeats.total - registered);
  return {
    totalQuota,
    formsSold,
    totalRegistered: registered,
    remainingForms,
    remainingSeats,
    isFormsFull: remainingForms <= 0,
    isSeatsFull: remainingSeats <= 0,
    registrationOpen: getRegistrationOpen(),
  };
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
    setSystemSetting('forms_sold', '434');
    setSystemSetting('exam_year', '2026');
    setSystemSetting('exam_date', '2026-07-05');

    // 1. Levels
    insertLevel.run('N5', 150, 124, 350000, '09:00 - 11:30');
    insertLevel.run('N4', 120, 98,  380000, '09:00 - 11:45');
    insertLevel.run('N3', 100, 92,  420000, '13:30 - 16:30');
    insertLevel.run('N2', 80,  81,  480000, '13:30 - 16:45');
    insertLevel.run('N1', 50,  38,  550000, '13:30 - 17:00');

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
      { id: 'room-seminar1',    code: 'ຫ້ອງ Seminar 1',           building: 'ອາຄານຫຼັກ',  floor: '-', level: 'N3', capacity: 30 },
      { id: 'room-laonea',      code: 'ຫ້ອງອະເນກປະສົງ',           building: 'ອາຄານຫຼັກ',  floor: '-', level: 'N3', capacity: 30 },
      // ── N2 ──────────────────────────────────────────────────
      { id: 'room-seminar2',    code: 'ຫ້ອງ Seminar 2',           building: 'ອາຄານຫຼັກ',  floor: '-', level: 'N2', capacity: 30 },
      { id: 'room-incubation',  code: 'ຫ້ອງ Incubation Room',     building: 'ອາຄານຫຼັກ',  floor: '-', level: 'N2', capacity: 25 },
      // ── N1 ──────────────────────────────────────────────────
      { id: 'room-annex6',  code: 'ຫ້ອງ Annex 6',         building: 'Annex Building (ຊັ້ນທີ 2)', floor: 'ຊັ້ນທີ 2', level: 'N1', capacity: 25 },
    ];

    for (const r of rooms) {
      insertRoom.run(r.id, r.code, r.building, r.floor, r.level, r.capacity);
    }

    // No sample applicants — rooms start empty, admin adds examinees via CSV or manual import
  });

  seedTx();
  console.log('Initial JLPT database seeded successfully.');
}

export interface AnnouncementRecord {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export function getAllAnnouncements(): AnnouncementRecord[] {
  const rows = db.prepare(`
    SELECT id, title, content, image_url, is_pinned, created_at, updated_at
    FROM announcements
    ORDER BY is_pinned DESC, created_at DESC
  `).all() as any[];

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    content: r.content || '',
    imageUrl: r.image_url || '',
    isPinned: Boolean(r.is_pinned),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export function getAnnouncementById(id: string): AnnouncementRecord | null {
  const r = db.prepare(`
    SELECT id, title, content, image_url, is_pinned, created_at, updated_at
    FROM announcements
    WHERE id = ?
  `).get(id) as any;

  if (!r) return null;
  return {
    id: r.id,
    title: r.title,
    content: r.content || '',
    imageUrl: r.image_url || '',
    isPinned: Boolean(r.is_pinned),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function createAnnouncementRecord(data: {
  title: string;
  content?: string;
  imageUrl?: string;
  isPinned?: boolean;
}): AnnouncementRecord {
  const id = `announcement-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const title = (data.title || '').trim();
  const content = (data.content || '').trim();
  const imageUrl = (data.imageUrl || '').trim();
  const isPinned = data.isPinned ? 1 : 0;

  db.prepare(`
    INSERT INTO announcements (id, title, content, image_url, is_pinned, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).run(id, title, content, imageUrl, isPinned);

  return getAnnouncementById(id)!;
}

export function updateAnnouncementRecord(
  id: string,
  data: {
    title: string;
    content?: string;
    imageUrl?: string;
    isPinned?: boolean;
  }
): AnnouncementRecord | null {
  const existing = getAnnouncementById(id);
  if (!existing) return null;

  const title = (data.title !== undefined ? data.title : existing.title).trim();
  const content = (data.content !== undefined ? data.content : existing.content).trim();
  const imageUrl = (data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl).trim();
  const isPinned = data.isPinned !== undefined ? (data.isPinned ? 1 : 0) : (existing.isPinned ? 1 : 0);

  db.prepare(`
    UPDATE announcements
    SET title = ?, content = ?, image_url = ?, is_pinned = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(title, content, imageUrl, isPinned, id);

  return getAnnouncementById(id);
}

export function deleteAnnouncementRecord(id: string): boolean {
  const info = db.prepare('DELETE FROM announcements WHERE id = ?').run(id);
  return info.changes > 0;
}

