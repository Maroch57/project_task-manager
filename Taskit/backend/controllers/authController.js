const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

// Signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  console.log(name, email)
  try {
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );

    const user = newUser.rows[0];

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET, // Secret key from .env file
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send the user data and token as the response
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'Email already in use' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log(email)

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) return res.status(400).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a reset token
    const token = crypto.randomBytes(20).toString('hex');

    // Save token and its expiration in the database (e.g., `password_resets` table)
    await pool.query(
      'INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, $3)',
      [email, token, new Date(Date.now() + 3600000)] // 1 hour expiration
    );

    // Send email
    const resetUrl = `http://localhost:5000/reset-password/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Click on the following link to reset your password: ${resetUrl}`,
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const result = await pool.query('SELECT * FROM password_resets WHERE token = $1', [token]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const resetEntry = result.rows[0];

    // Check if token is expired
    if (new Date() > resetEntry.expires_at) {
      return res.status(400).json({ error: 'Token has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, resetEntry.email]);

    // Optionally delete the reset token from the database
    await pool.query('DELETE FROM password_resets WHERE token = $1', [token]);

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

