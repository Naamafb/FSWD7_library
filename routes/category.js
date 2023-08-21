const express = require('express');
const router = express.Router();
const { sqlConnect } = require('./connectTodb.js');

//מחזיר את כל הקטגוריות
router.get("/", function (req, res) {
    const query = `SELECT * FROM categories`;

    console.log("categori");
    sqlConnect(query)
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("An error occurred");
        });
});

module.exports = router;