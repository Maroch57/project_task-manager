const pool = require('../config/db');

exports.updateProfile = async (req, res) => {
       const { name, email } = req.body;

       try {
              const updatedUser = await pool.query(
                     'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
                     [name, email, req.user.id]
              );
              res.json(updatedUser.rows[0]);
       } catch (error) {
              res.status(400).json({ error: error.message });
       }
};
