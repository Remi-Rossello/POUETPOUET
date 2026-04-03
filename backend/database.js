const sqlite3 = require('sqlite3').verbose();

const DB_PATH = process.env.DB_PATH || '/data/database.db';

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(`Failed to open SQLite database at ${DB_PATH}:`, err.message);
    return;
  }
  console.log(`Connected to SQLite database at ${DB_PATH}`);
});

function initDatabase() {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS traffic (
        key   TEXT PRIMARY KEY,
        value INTEGER NOT NULL DEFAULT 0
      )`,
      (err) => {
        if (err) console.error('Failed to initialise traffic table:', err.message);
      }
    );
    db.run(
      `INSERT OR IGNORE INTO traffic (key, value) VALUES ('visits', 0)`,
      (err) => {
        if (err) console.error('Failed to seed visits row:', err.message);
        else console.log('Database initialised (traffic table ready).');
      }
    );
  });
}

process.on('exit', () => db.close());
process.on('SIGINT', () => { db.close(); process.exit(0); });

module.exports = { db, initDatabase };
