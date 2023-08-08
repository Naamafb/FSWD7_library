const {sqlConnect} = require('./connectTodb.js');
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// const sqlPassword = "324170521";

// function sqlConnect(query, values = []) {
//     return new Promise((resolve, reject) => {
//       const connection = mysql.createConnection({
//         host: "localhost",
//         user: "root",
//         password: sqlPassword,
//         database: "library_fswd7",
//       });
  
//       connection.connect((err) => {
//         if (err) {
//           console.error("Error connecting to MySQL server: " + err.stack);
//           reject(err);
//           return;
//         }
//         console.log("Connected to MySQL server");
  
//         connection.query(query, values, (err, results) => {
//           if (err) {
//             console.error("Error executing query: " + err.code);
//             reject(err);
//           }
  
//           connection.end((err) => {
//             if (err) {
//               console.error("Error closing connection: " + err.stack);
//               // reject(err);
//               return;
//             }
//             console.log("MySQL connection closed");
//           });
  
//           resolve(results);
//         });
//       });
//     });
//   }
  //get all books of user
router.get(`/users/:userid`, function (req, res) {
    const userid=req.params.userid;
    const query= `SELECT DISTINCT *
    FROM (
      SELECT *
      FROM library_fswd7.books
      JOIN library_fswd7.volumes ON books.id = volumes.book_code
      WHERE owner_code = '${userid}' AND deleted = 0
    ) AS joined_result`;
    sqlConnect(query)
    .then((results) => {
      console.log(results);
      res.status(200).json(results)
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("An error occurred");
    });
});
//get reader of volume
router.get(`/:volumeid`, function (req, res) {
    const {volumeid}=req.params;
    const query= `SELECT DISTINCT *
    FROM (
      SELECT *
      FROM library_fswd7.users
      JOIN library_fswd7.books_borrowed ON books_borrowed.user_code = users.id
      WHERE volume_code = '${volumeid}' AND confirmation_date  IS NOT NULL AND return_date IS NULL
    ) AS joined_result;`;
    sqlConnect(query)
    .then((results) => {
      console.log(results);
      res.status(200).json(results)
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("An error occurred");
    });
});
module.exports = router;