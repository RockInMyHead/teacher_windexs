/**
 * Database Configuration - SQLite
 * Professional SQLite connection setup
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database file path
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database/teacher_platform.db');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  } else {
    console.log('✅ Database connected successfully:', DB_PATH);
    
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (err) {
        console.error('❌ Failed to enable foreign keys:', err);
      } else {
        console.log('✅ Foreign keys enabled');
      }
    });
  }
});

/**
 * Execute a query with automatic error handling
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    
    // Determine query type
    const queryType = sql.trim().toUpperCase().split(' ')[0];
    
    if (queryType === 'SELECT') {
      db.all(sql, params, (err, rows) => {
        const duration = Date.now() - start;
        if (err) {
          console.error('❌ Query error:', err);
          reject(err);
        } else {
          console.log(`⚡ SELECT query executed in ${duration}ms, returned ${rows.length} rows`);
          resolve({ rows });
        }
      });
    } else if (queryType === 'INSERT') {
      db.run(sql, params, function(err) {
        const duration = Date.now() - start;
        if (err) {
          console.error('❌ Query error:', err);
          reject(err);
        } else {
          console.log(`⚡ INSERT query executed in ${duration}ms, lastID: ${this.lastID}`);
          resolve({ rows: [], lastID: this.lastID, changes: this.changes });
        }
      });
    } else {
      db.run(sql, params, function(err) {
        const duration = Date.now() - start;
        if (err) {
          console.error('❌ Query error:', err);
          reject(err);
        } else {
          console.log(`⚡ ${queryType} query executed in ${duration}ms, changes: ${this.changes}`);
          resolve({ rows: [], changes: this.changes });
        }
      });
    }
  });
};

/**
 * Get a client for transaction support
 * @returns {Promise<Object>} Database client with transaction methods
 */
const getClient = async () => {
  return {
    query: query,
    release: () => {}, // No-op for SQLite
    inTransaction: false,
  };
};

/**
 * Execute multiple queries in a transaction
 * @param {Function} callback - Callback function that receives client and executes queries
 * @returns {Promise<any>} Transaction result
 */
const transaction = async (callback) => {
  return new Promise(async (resolve, reject) => {
    db.serialize(async () => {
      try {
        await query('BEGIN TRANSACTION');
        
        const result = await callback({ query });
        
        await query('COMMIT');
        resolve(result);
      } catch (error) {
        await query('ROLLBACK');
        reject(error);
      }
    });
  });
};

/**
 * Initialize database with schema
 */
const initDatabase = async () => {
  const schemaPath = path.join(__dirname, '../../database/schema.sqlite.sql');
  const initPath = path.join(__dirname, '../../database/init.sqlite.sql');
  
  try {
    // Check if database is already initialized
    const result = await query("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    
    if (result.rows.length === 0) {
      console.log('📊 Initializing database...');
      
      // Read and execute schema
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        const statements = schema.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
          if (statement.trim()) {
            await query(statement);
          }
        }
        console.log('✅ Schema applied successfully');
      }
      
      // Read and execute init data
      if (fs.existsSync(initPath)) {
        const initData = fs.readFileSync(initPath, 'utf8');
        const statements = initData.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
          if (statement.trim()) {
            await query(statement);
          }
        }
        console.log('✅ Initial data loaded successfully');
      }
    } else {
      console.log('✅ Database already initialized');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Initialize database on startup
initDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
});

/**
 * Close database connection
 */
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
        reject(err);
      } else {
        console.log('Database connection closed');
        resolve();
      }
    });
  });
};

// Handle process termination
process.on('SIGINT', () => {
  closeDatabase().then(() => process.exit(0));
});

process.on('SIGTERM', () => {
  closeDatabase().then(() => process.exit(0));
});

module.exports = {
  query,
  getClient,
  transaction,
  db,
  closeDatabase,
};

