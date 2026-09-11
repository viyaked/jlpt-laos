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
  `);

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
  }
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

    // 1. Levels
    insertLevel.run('N5', 150, 124, 350000, '09:00 - 11:30');
    insertLevel.run('N4', 120, 98, 380000, '09:00 - 11:45');
    insertLevel.run('N3', 100, 92, 420000, '13:30 - 16:30');
    insertLevel.run('N2', 80, 80, 480000, '13:30 - 16:45');
    insertLevel.run('N1', 50, 38, 550000, '13:30 - 17:00');

    // 2. Rooms
    const rooms = [
      { id: 'room-101', code: 'A-101', building: 'Building A (ອາຄານ ອາ)', floor: 'Floor 1 (ຊັ້ນ 1)', level: 'N5', capacity: 35 },
      { id: 'room-102', code: 'A-102', building: 'Building A (ອາຄານ ອາ)', floor: 'Floor 1 (ຊັ້ນ 1)', level: 'N5', capacity: 35 },
      { id: 'room-201', code: 'A-201', building: 'Building A (ອາຄານ ອາ)', floor: 'Floor 2 (ຊັ້ນ 2)', level: 'N4', capacity: 35 },
      { id: 'room-202', code: 'A-202', building: 'Building A (ອາຄານ ອາ)', floor: 'Floor 2 (ຊັ້ນ 2)', level: 'N4', capacity: 35 },
      { id: 'room-301', code: 'B-101', building: 'Building B (ອາຄານ ເບ)', floor: 'Floor 1 (ຊັ້ນ 1)', level: 'N3', capacity: 30 },
      { id: 'room-401', code: 'B-201', building: 'Building B (ອາຄານ ເບ)', floor: 'Floor 2 (ຊັ້ນ 2)', level: 'N2', capacity: 30 },
      { id: 'room-501', code: 'B-301', building: 'Building B (ອາຄານ ເບ)', floor: 'Floor 3 (ຊັ້ນ 3)', level: 'N1', capacity: 25 },
    ];

    for (const r of rooms) {
      insertRoom.run(r.id, r.code, r.building, r.floor, r.level, r.capacity);
    }

    // 3. Applicants with authentic Lao characters and phonetic accents
    const sampleApplicants = [
      { id: 'ex-1', first_name: 'ອາລຸນ', last_name: 'ສີສົມບັດ', room_id: 'room-101', date: '2026-05-10' },
      { id: 'ex-2', first_name: 'ວິໄລພອນ', last_name: 'ວົງສະຫວັນ', room_id: 'room-101', date: '2026-05-10' },
      { id: 'ex-3', first_name: 'ສົມສັກ', last_name: 'ແກ້ວມະນີ', room_id: 'room-101', date: '2026-05-11' },
      { id: 'ex-4', first_name: 'ມະນີວັນ', last_name: 'ພອນປະເສີດ', room_id: 'room-101', date: '2026-05-11' },
      { id: 'ex-5', first_name: 'ທິດາລັດ', last_name: 'ຈັນທະວົງ', room_id: 'room-101', date: '2026-05-12' },
      { id: 'ex-6', first_name: 'ບຸນມີ', last_name: 'ໄຊຍະວົງ', room_id: 'room-101', date: '2026-05-12' },
      { id: 'ex-7', first_name: 'ແສງດາວ', last_name: 'ຄຳມະນີ', room_id: 'room-101', date: '2026-05-13' },
      { id: 'ex-8', first_name: 'ພຸດທະສອນ', last_name: 'ລັດຕະນະ', room_id: 'room-101', date: '2026-05-13' },
      { id: 'ex-9', first_name: 'Takeshi', last_name: 'Yamamoto', room_id: 'room-101', date: '2026-05-14' },
      { id: 'ex-10', first_name: 'ວັນໄຊ', last_name: 'ພົມມະຈັນ', room_id: 'room-101', date: '2026-05-15' },

      { id: 'ex-13', first_name: 'ເກດສະໜາ', last_name: 'ມະນີຈັນ', room_id: 'room-102', date: '2026-05-15' },
      { id: 'ex-14', first_name: 'ຈັນສະໝອນ', last_name: 'ຫຼວງລາດ', room_id: 'room-102', date: '2026-05-16' },
      { id: 'ex-15', first_name: 'ດາວວອນ', last_name: 'ສຸວັນນະສີ', room_id: 'room-102', date: '2026-05-16' },
      { id: 'ex-16', first_name: 'ບຸນທະວີ', last_name: 'ອິນທະວົງ', room_id: 'room-102', date: '2026-05-17' },
      { id: 'ex-17', first_name: 'Michael', last_name: 'Chen', room_id: 'room-102', date: '2026-05-17' },
      { id: 'ex-18', first_name: 'ລັດສະໝີ', last_name: 'ສິງຫາລາດ', room_id: 'room-102', date: '2026-05-18' },

      { id: 'ex-21', first_name: 'ຄຳຫຼ້າ', last_name: 'ແສງສຸລິຍາ', room_id: 'room-201', date: '2026-05-11' },
      { id: 'ex-22', first_name: 'ຈິດປະສົງ', last_name: 'ສີຫາລາດ', room_id: 'room-201', date: '2026-05-11' },
      { id: 'ex-23', first_name: 'ຊົມພູ', last_name: 'ພົມວິຫານ', room_id: 'room-201', date: '2026-05-12' },
      { id: 'ex-24', first_name: 'Sarah', last_name: 'Jenkins', room_id: 'room-201', date: '2026-05-12' },

      { id: 'ex-31', first_name: 'ຍອດແກ້ວ', last_name: 'ໂພທິສານ', room_id: 'room-202', date: '2026-05-16' },
      { id: 'ex-32', first_name: 'ລັດຕະນະ', last_name: 'ສີສົມພອນ', room_id: 'room-202', date: '2026-05-16' },

      { id: 'ex-36', first_name: 'ອະນຸວັດ', last_name: 'ສີຫາປັນຍາ', room_id: 'room-301', date: '2026-05-10' },
      { id: 'ex-37', first_name: 'Kenji', last_name: 'Sato', room_id: 'room-301', date: '2026-05-10' },
      { id: 'ex-38', first_name: 'ສຸວັນນາ', last_name: 'ທຳມະວົງ', room_id: 'room-301', date: '2026-05-11' },

      { id: 'ex-44', first_name: 'ທອງສຸກ', last_name: 'ສີວິໄຊ', room_id: 'room-401', date: '2026-05-08' },
      { id: 'ex-45', first_name: 'Elena', last_name: 'Rostova', room_id: 'room-401', date: '2026-05-08' },
      { id: 'ex-46', first_name: 'ວົງເດືອນ', last_name: 'ລາດຊະວົງ', room_id: 'room-401', date: '2026-05-09' },

      { id: 'ex-50', first_name: 'ສາຍສະໝອນ', last_name: 'ສຸລິຍະວົງ', room_id: 'room-501', date: '2026-05-05' },
      { id: 'ex-51', first_name: 'David', last_name: 'Armstrong', room_id: 'room-501', date: '2026-05-05' }
    ];

    for (const a of sampleApplicants) {
      insertApplicant.run(a.id, a.first_name, a.last_name, a.room_id, a.date);
    }
  });

  seedTx();
  console.log('Initial JLPT database seeded successfully.');
}
