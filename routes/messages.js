const {sqlConnect} = require('./connectTodb.js');
const express = require('express');
const router = express.Router();


//get all messages
router.get(`/users/:userid`, function (req, res) {
    const userid=req.params.userid;
    const query= ` SELECT *
      FROM library_fswd7.message
      WHERE reciving_id = '${userid}' `;
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