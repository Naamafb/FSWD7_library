const { sqlConnect } = require('./connectTodb.js');


function findUserId(username) {
    const userid = `SELECT id FROM users WHERE username = '${username}'`;

    return sqlConnect(userid)
        // .then((res) => {
        //     res[0].id;
        // })
}

console.log(findUserId('bat7'));

function newPassword(user_id, password) {
    const addToPass = `INSERT INTO passwords (user_id,password) VALUES ('${user_id}','${password}')`;
    sqlConnect(addToPass)
        .then((result) => {
            console.log("You are in the database");
            return true;
            // result.status(200);
        })
        .catch((err) => {
            console.error(err);
            // result.status(500).send("An error occurred");
        });
}

// newPassword('6','7864')