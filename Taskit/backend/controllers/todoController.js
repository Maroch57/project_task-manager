const pool = require('../config/db');

exports.createTodo = async (req, res) => {
  const { title } = req.body;

  console.log(title);

  try {
    const newTodo = await pool.query(
      'INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *',
      [req.user.id, title]
    );
    res.status(201).json(newTodo.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await pool.query('SELECT * FROM todos WHERE user_id = $1', [req.user.id]);
    res.json(todos.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Todo
exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedTodo = await pool.query(
      'UPDATE todos SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    res.json(updatedTodo.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Todo
exports.deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
