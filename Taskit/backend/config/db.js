const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Connected to the database successfully!');
    
    client.release();
  } catch (error) {
    console.error('Database connection error:', error.message);
  }
}

testConnection();

module.exports = pool;
