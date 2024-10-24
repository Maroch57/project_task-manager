const db = require('../config/db');

const checkBlacklist = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        try {
            const result = await db.query('SELECT * FROM blacklisted_tokens WHERE token = $1', [token]);
            if (result.rows.length > 0) {
                return res.status(401).json({ error: 'Token is invalid' });
            }
        } catch (error) {
            console.error('Error checking blacklist:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    next();
};

module.exports = checkBlacklist;
