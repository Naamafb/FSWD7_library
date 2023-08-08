const express = require('express');
const router = express.Router();
const { sqlConnect } = require('./connectTodb.js');    
  
router.put("/:userId", function (req, res) {
    const {userId}=req.params;
    const userUpdate = req.body;
    console.log(userId);
    console.log(userUpdate);
    const query = `UPDATE users SET first_name = '${userUpdate.first_name}' ,  last_name = '${userUpdate.last_name}' ,username = '${userUpdate.username}',phone = '${userUpdate.phone}',email = '${userUpdate.email}',address = '${userUpdate.address}',age = '${userUpdate.age}' WHERE id = ${userId}`;
    console.log(query)
    sqlConnect(query)
    .then((results) => {
      console.log("the comment updated");
      res.status(200).send("the user info updated");
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("An error occurred");
    });
})

module.exports = router;