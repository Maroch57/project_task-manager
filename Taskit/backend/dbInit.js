const pool = require('./config/db'); // Import your database connection

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const createTodosTable = `
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);`;

const blackList = `
CREATE TABLE IF NOT EXISTS blacklisted_tokens (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const createTables = async () => {
  try {
    await pool.query(createUsersTable);
    console.log('Users table created or already exists.');
    
    await pool.query(createTodosTable);
    console.log('Todos table created or already exists.');

    await pool.query(blackList);
    console.log('Blacklist table created or already exists.');

    pool.end(); // Close the database connection
  } catch (error) {
    console.error('Error creating tables:', error);
    pool.end(); // Close the database connection on error
  }
};

createTables();
