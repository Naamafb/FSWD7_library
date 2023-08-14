const { sqlConnect } = require('./connectTodb.js');
const express = require('express');
const router = express.Router();

// register
router.post("/", function (req, res) {
  const { username, password, first_name, last_name, email, phone, address, age } = req.body;
  const que = `SELECT * FROM users WHERE username = '${username}'`;
  let userid;
  sqlConnect(que)
    .then((result) => {
      if (result.length > 0) {
        console.log("you are exist");
        return res.status(202);
      }
      const addUser = `INSERT INTO users ( username,first_name,last_name,email,phone,address,age) VALUES ('${username}', '${first_name}', '${last_name}','${email}', '${phone}','${address}','${age}' )`;
      sqlConnect(addUser)
        .then((results) => {
          findUserId(username)
            .then((res) => {
              userid=res[0].id;
              console.log(res[0].id);
              console.log(userid);
              newPassword(res[0].id, password).then((console.log("new user")))
            })
            .catch(() => {
              console.error(err);
              res.status(500).send("An error occurred");
            })
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("An error occurred");
        });

      console.log(userid);
      res.status(200).json(username);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});


function findUserId(username) {
  const userid = `SELECT id FROM users WHERE username = '${username}'`;

  return sqlConnect(userid);
}


function newPassword(user_id, password) {
  const addToPass = `INSERT INTO passwords (user_id,password) VALUES ('${user_id}','${password}')`;
  return sqlConnect(addToPass);
}
module.exports = router;