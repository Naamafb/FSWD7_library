const mysql = require('mysql2');

const sqlPassword = "324170521";

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
  
module.exports ={sqlConnect};
