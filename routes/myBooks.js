const {sqlConnect} = require('./connectTodb.js');
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');


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
router.get(`/:volumeid/users/:userId`, function (req, res) {
    const {volumeid}=req.params;
    findTheReader(volumeid)
    .then((results) => {
      console.log(results);
      res.status(200).json(results)
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("An error occurred");
    });
});

//delete book
router.post(`/:volumeid/deleteBook/users/:userid`, function (req, res) {
  const {volumeid,userid}=req.params;
  const reqBody=req.body;
  deleteVolume(volumeid)
  .then((results) => {
    console.log("The book was deleted successfully")
    deleteWaitingList(volumeid)
    .then(()=>{
      console.log("the witing list was deleted successfully")
      findTheReader(volumeid)
      .then((results)=>{
        if (results.length !== 0 ){
          sendMessageToTheReader(userid,results[0],reqBody)
          .then(()=>{
            console.log("the message was sended successfully");
            res.status(200).send("The book has been deleted")
          })
        }
        else{
          res.status(200).send("The book has been deleted")
        }
      }) 
    })
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
  });
});

function deleteVolume(volumeId){
  const query=`UPDATE  library_fswd7.volumes SET deleted=1 WHERE volume_id = '${volumeId}'; `;
  return sqlConnect(query);
}

function deleteWaitingList(volumeId) {
  const query=`UPDATE  library_fswd7.books_borrowed SET deleted=1 WHERE volume_code = '${volumeId}' AND confirmation_date IS NULL; `;
  return sqlConnect(query);
}
function findTheReader(volumeId){
  const query= `SELECT DISTINCT *
    FROM (
      SELECT *
      FROM library_fswd7.users
      JOIN library_fswd7.books_borrowed ON books_borrowed.user_code = users.id
      WHERE volume_code = '${volumeId}' AND confirmation_date  IS NOT NULL AND return_date IS NULL
    ) AS joined_result;`;
    return sqlConnect(query)
}


function sendMessageToTheReader(ownerId, readerInfo, bookInfo) {
  // console.log("reader");
  // console.log(readerInfo);
  // console.log(bookInfo.deleted_date);
    //const dateString=getDate(bookInfo.deleted_date)
    const formatDateTime= new Date(bookInfo.deleted_date).toISOString().slice(0,19).replace("T"," ");
    
    const title = 'Request to return the book'+bookInfo.book_name;
    const body = bookInfo.deleted_date + '\nHi '+ readerInfo.first_name +
    '\n I will be happy to get back my book' + bookInfo.book_name +
    '\n Thank you \n'+
    bookInfo.owner_name+
    '\n phone: '+ bookInfo.owner_phone;
   

    const query = `
      INSERT INTO library_fswd7.message (sender_id, reciving_id, title, body, recive_date)
      VALUES ('${ownerId}', '${readerInfo.id}', '${title}', '${body}', '${formatDateTime}')
    `;

    return sqlConnect(query);
  
}
const getDate = (today) => {
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}




module.exports = router;