import Database from 'better-sqlite3';
import fs from 'fs';

const dbPath = 'src/data/app.db';
const dbDir = 'src/data';

// Create data directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Create a generic starter table
db.exec(`
  CREATE TABLE IF NOT EXISTS entities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    skill_data TEXT NOT NULL DEFAULT '{}'
  )
`);

console.log('✓ Database initialized at', dbPath);
console.log('✓ Created table: entities');
console.log('\nNext steps:');
console.log('  1. Run: npm run skill:discover');
console.log('  2. Customize your schema based on your domain');

db.close();
