const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

// Set environment variables directly
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'manager';
process.env.DB_NAME = 'todo';
process.env.PORT = '5000';

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse incoming JSON bodies

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.log('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Fetch all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).send({ error: 'Failed to fetch tasks', details: err.message });
    res.json(results);
  });
});

// Add a new task
app.post('/tasks', ( req, res) => {
  const { assignedTo, status, priority, dueDate, description } = req.body;
  db.query(
    'INSERT INTO tasks (assignedTo, status, priority, dueDate, description) VALUES (?, ?, ?, ?, ?)', 
    [assignedTo, status, priority, dueDate, description], 
    (err, result) => {
      if (err) return res.status(500).send({ error: 'Failed to add task', details: err.message });
      res.json({ message: 'Task added', taskId: result.insertId });
    }
  );
});

// Update an existing task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { assignedTo, status, priority, dueDate, description } = req.body;
  db.query(
    'UPDATE tasks SET assignedTo = ?, status = ?, priority = ?, dueDate = ?, description = ? WHERE id = ?', 
    [assignedTo, status, priority, dueDate, description, id], 
    (err) => {
      if (err) return res.status(500).send({ error: 'Failed to update task', details: err.message });
      res.json({ message: 'Task updated' });
    }
  );
});


// Delete an existing task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  db.query(
    'DELETE FROM tasks WHERE id = ?', 
    [id], 
    (err, result) => {
      if (err) {
        return res.status(500).send({ error: 'Failed to delete task', details: err.message });
      }
      
      // Check if any rows were affected (i.e., if the task existed)
      if (result.affectedRows === 0) {
        return res.status(404).send({ error: 'Task not found' });
      }

      res.json({ message: 'Task deleted successfully' });
    }
  );
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});