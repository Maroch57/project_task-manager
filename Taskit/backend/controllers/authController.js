const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const transporter = require('../config/mailer');
require('dotenv').config();

// Signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
    res.status(201).json(newUser.rows[0]);
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

exports.logout = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        try {
            await pool.query('INSERT INTO blacklisted_tokens (token) VALUES ($1)', [token]);
            return res.status(200).json({ message: 'Successfully logged out' });
        } catch (error) {
            console.error('Error saving token to blacklist:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    return res.status(400).json({ error: 'Token not provided' });
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const frontEndUrl = req.headers['origin'];

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    await pool.query(
      'INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, $3)',
      [email, token, new Date(Date.now() + 3600000)] // 1 hour expiration
    );

    const resetUrl = `${frontEndUrl}/reset-password/${token}`;
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

    if (new Date() > resetEntry.expires_at) {
      return res.status(400).json({ error: 'Token has expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, resetEntry.email]);

    await pool.query('DELETE FROM password_resets WHERE token = $1', [token]);

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

