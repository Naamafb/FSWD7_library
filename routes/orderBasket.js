const {sqlConnect} = require('./connectTodb.js');
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');


//get all books wish list of user
router.get(`/wishList/users/:userid`, function (req, res) {
    const userid=req.params.userid;
    const query= `SELECT books_borrowed.*, volumes.volume_id, volumes.owner_code, volumes.book_code, books.*
    FROM library_fswd7.books_borrowed
    INNER JOIN library_fswd7.volumes ON books_borrowed.volume_code = volumes.volume_id
    INNER JOIN library_fswd7.books ON volumes.book_code = books.id
    WHERE books_borrowed.user_code ='${userid}' AND books_borrowed.confirmation_date IS NULL AND books_borrowed.deleted = 0 `;
    sqlConnect(query)
    .then((results) => {
      console.log("the result is:")
      console.log(results);
      res.status(200).json(results)
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("An error occurred");
    });
});

  //get all reading  list of user
  router.get(`/myReadingList/users/:userid`, function (req, res) {
    const userid=req.params.userid;
    const query= `SELECT books_borrowed.*, volumes.volume_id, volumes.owner_code, volumes.book_code, books.*
    FROM library_fswd7.books_borrowed
    INNER JOIN library_fswd7.volumes ON books_borrowed.volume_code = volumes.volume_id
    INNER JOIN library_fswd7.books ON volumes.book_code = books.id
    WHERE books_borrowed.user_code ='${userid}' 
    AND books_borrowed.confirmation_date IS NOT NULL
    AND books_borrowed.return_date IS NULL `;
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
//return book
router.put(`/myReadingList/returnBook/users/:userid`, function (req, res) {
  const userid=req.params.userid;
  const reqBody=req.body;
  console.log(reqBody)
  updateReturnDate(reqBody.request_id)
  .then((results) => {
    console.log(results);
  updateReturnDate(reqBody.request_id)
  findTheNextReader(reqBody.volume_id).then((res)=>{
      if(res.length === 0)
       updateVolumeStatus(reqBody.volume_id)
      else {
        console.log("the res is")
        console.log(res[0].request_id)
        updateTheNextReader(res[0].request_id)
      }
    })
    console.log("this is the res")
    res.status(200).send("the books returned");
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
  });
});

//remove book from wish list
router.post(`/wishList/remove/:request_id/users/:user_id`, function (req, res) {
  const requestId=req.params.request_id;
  const query = `UPDATE  library_fswd7.books_borrowed SET deleted=1 WHERE request_id = '${requestId}' ;`
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




function updateReturnDate(requestId) {
  const query = `UPDATE  library_fswd7.books_borrowed SET return_date=NOW() WHERE request_id = '${requestId}' ;`

  return sqlConnect(query);
}
function findTheNextReader(volumeId){
  const query =`SELECT *
    FROM library_fswd7.books_borrowed
    WHERE volume_code = '${volumeId}'
      AND confirmation_date IS NULL
      AND return_date IS NULL
    ORDER BY request_date ASC
    LIMIT 1;`
 return sqlConnect(query);
}
function updateVolumeStatus(volumeId){
  const query =`UPDATE library_fswd7.volumes SET availability = 0 WHERE volume_id = '${volumeId}';`
  return sqlConnect(query);
}
function updateTheNextReader(requestId){
  const query = `UPDATE  library_fswd7.books_borrowed SET confirmation_date=NOW() WHERE request_id = '${requestId}' ;`

  return sqlConnect(query);
}
module.exports = router;