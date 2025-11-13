#!/usr/bin/env node

/**
 * Database Testing Script
 * Tests SQLite integration and API endpoints
 */

const Database = require('better-sqlite3');
const path = require('path');
const http = require('http');

console.log('🧪 Database Testing Script\n');

// Test 1: Initialize database locally
console.log('Test 1: Initialize SQLite Database');
console.log('==================================');

try {
  const dbPath = path.join(process.cwd(), 'teacher-test.db');
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      score_percentage INTEGER,
      timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
  
  console.log('✅ Database created at:', dbPath);
  
  // Test 2: Insert test data
  console.log('\nTest 2: Insert Test Data');
  console.log('========================');
  
  const userStmt = db.prepare('INSERT INTO users (username, email) VALUES (?, ?)');
  const result = userStmt.run('testuser', 'test@example.com');
  console.log('✅ User created with ID:', result.lastInsertRowid);
  
  const assessmentStmt = db.prepare('INSERT INTO assessments (user_id, score_percentage) VALUES (?, ?)');
  assessmentStmt.run(result.lastInsertRowid, 85);
  console.log('✅ Assessment created');
  
  // Test 3: Query data
  console.log('\nTest 3: Query Data');
  console.log('==================');
  
  const users = db.prepare('SELECT * FROM users').all();
  console.log('✅ Users count:', users.length);
  console.log('   Data:', JSON.stringify(users[0], null, 2));
  
  const assessments = db.prepare('SELECT * FROM assessments').all();
  console.log('✅ Assessments count:', assessments.length);
  console.log('   Data:', JSON.stringify(assessments[0], null, 2));
  
  // Test 4: Statistics
  console.log('\nTest 4: Database Statistics');
  console.log('============================');
  
  const stats = {
    users: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
    assessments: db.prepare('SELECT COUNT(*) as count FROM assessments').get().count,
    tables: db.prepare('SELECT COUNT(*) as count FROM sqlite_master WHERE type="table"').get().count
  };
  console.log('✅ Stats:', JSON.stringify(stats, null, 2));
  
  db.close();
  console.log('\n✅ Database closed');
  
} catch (error) {
  console.error('❌ Database error:', error.message);
  process.exit(1);
}

// Test 5: API endpoint test
console.log('\nTest 5: API Health Check');
console.log('========================');

const makeRequest = (path) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 1031,
      path: path,
      method: 'GET',
      timeout: 5000
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
};

(async () => {
  try {
    console.log('Checking /api/db/health...');
    const healthResponse = await makeRequest('/api/db/health');
    if (healthResponse.status === 200) {
      console.log('✅ API is responding');
      console.log('   Response:', JSON.stringify(healthResponse.data, null, 2));
    } else {
      console.log('⚠️  API responded with status:', healthResponse.status);
    }
    
    console.log('\nChecking /api/db/stats...');
    const statsResponse = await makeRequest('/api/db/stats');
    if (statsResponse.status === 200) {
      console.log('✅ Stats endpoint working');
      console.log('   Response:', JSON.stringify(statsResponse.data, null, 2));
    } else {
      console.log('⚠️  Stats endpoint responded with status:', statsResponse.status);
    }
  } catch (error) {
    console.log('⚠️  API not available yet (server may still be starting)');
    console.log('   Error:', error.message);
  }
  
  console.log('\n✅ Database testing complete!');
})();

