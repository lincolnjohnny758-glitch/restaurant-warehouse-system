// تكوين قاعدة البيانات
// Database Configuration

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs').promises;

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../../database/warehouse.db');
const SCHEMA_PATH = path.join(__dirname, '../../../database/schema.sql');
const SEED_PATH = path.join(__dirname, '../../../database/seed.sql');

let db = null;

/**
 * Get database instance
 */
const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

/**
 * Initialize database connection and schema
 */
const initDatabase = async () => {
  try {
    // Ensure database directory exists
    const dbDir = path.dirname(DB_PATH);
    await fs.mkdir(dbDir, { recursive: true });

    // Create database connection
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Error connecting to database:', err);
        throw err;
      }
      console.log('✅ Connected to SQLite database:', DB_PATH);
    });

    // Enable foreign keys
    await runQuery('PRAGMA foreign_keys = ON');

    // Check if database needs initialization
    const tables = await runQuery(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    );

    if (tables.length === 0) {
      console.log('🛠️ Initializing database schema...');
      
      // Read and execute schema
      const schema = await fs.readFile(SCHEMA_PATH, 'utf8');
      await executeSql(schema);
      console.log('✅ Schema created successfully');

      // Read and execute seed data
      const seed = await fs.readFile(SEED_PATH, 'utf8');
      await executeSql(seed);
      console.log('✅ Sample data inserted successfully');
    } else {
      console.log('✅ Database already initialized');
    }

    return db;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

/**
 * Execute SQL query
 */
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

/**
 * Execute SQL statement (INSERT, UPDATE, DELETE)
 */
const runStatement = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

/**
 * Execute multiple SQL statements
 */
const executeSql = (sql) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    db.exec(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Close database connection
 */
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve();
      return;
    }

    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        db = null;
        console.log('✅ Database connection closed');
        resolve();
      }
    });
  });
};

module.exports = {
  initDatabase,
  getDatabase,
  runQuery,
  runStatement,
  executeSql,
  closeDatabase
};
