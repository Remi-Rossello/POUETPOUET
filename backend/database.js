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
  db.run(
    `CREATE TABLE IF NOT EXISTS visitors (
      device_id TEXT PRIMARY KEY
    )`,
    (err) => {
      if (err) console.error('Failed to initialise visitors table:', err.message);
      else console.log('Database initialised (visitors table ready).');
    }
  );
}

module.exports = { db, initDatabase };
