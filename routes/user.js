const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const sqlPassword = "324170521";

// Get all users
// router.get('/', (req,res) => {
//   db.query('SELECT * FROM users', (err, results) => {
//     if (err) {
//       console.error('Error getting users: ', err);
//       res.status(500).json({ error: 'Error getting users' });
//       return;
//     }
//     res.json(results);
//   });
// });

// // Get a specific user by username
// router.get('/:username', (req, res) => {
//   const username = req.params.username;
//   db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
//     if (err) {
//       console.error('Error retrieving user: ', err);
//       res.status(500).json({ error: 'Error retrieving user' });
//       return;
//     }
//     if (results.length === 0) {
//       res.status(404).json({ error: 'User not found???' });
//       return;
//     }
//     const user = results[0];
//     res.json({ user });
//   });
// });


// // Create a new user
// router.post('/', (req, res) => {
//   const { name, username, email, address, phone } = req.body;
//   db.query('INSERT INTO users (name, username, email, address, phone) VALUES (?, ?, ?, ?, ?)', [name, username, email, address, phone], (err, results) => {
//     if (err) {
//       console.error('Error creating user: ', err);
//       res.status(500).json({ error: 'Error creating user' });
//       return;
//     }
//     res.json({ message: 'User created successfully' });
//   });
// });


// // Update a user
// router.put('/:id', (req, res) => {
//   const userId = req.params.id;
//   const { name, username, email, address, phone } = req.body;
//   db.query('UPDATE users SET name = ?, username = ?, email = ?, address = ?, phone = ? WHERE id = ?', [name, username, email, address, phone, userId], (err, results) => {
//   if (err) {
//     console.error('Error updating user: ', err);
//     res.status(500).json({ error: 'Error updating user' });
//     return;
//   }
//   res.json({ message: 'User updated successfully' });
//   });
// });

// // Delete a user
// router.delete('/:id', (req, res) => {
//   const userId = req.params.id;
//   db.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
//     if (err) {
//       console.error('Error deleting user: ', err);
//       res.status(500).json({ error: 'Error deleting user' });
//       return;
//     }
//     res.json({ message: 'User deleted successfully' });
//   });
// });

module.exports = router;


function sqlConnect(query, values = []) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: sqlPassword,
      database: "library_fswd7",
    });

    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL server: " + err.stack);
        reject(err);
        return;
      }
      console.log("Connected to MySQL server");

      connection.query(query, values, (err, results) => {
        if (err) {
          console.error("Error executing query: " + err.code);
          reject(err);
        }

        connection.end((err) => {
          if (err) {
            console.error("Error closing connection: " + err.stack);
            // reject(err);
            return;
          }
          console.log("MySQL connection closed");
        });

        resolve(results);
      });
    });
  });
}
