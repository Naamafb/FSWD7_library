import { useNavigate } from "react-router-dom";
import { useParams, useEffect, useState } from "react";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import styles from "./Info.module.css";

function OrderBasket(){
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [myWishList,setMyWishList]=useState([]);
    const [myReadingList,setMyReadingList]=useState([]);
    const [FindMyWishList,setFindMyWishList]=useState(false);
    const [FindMyReadingList,setFindMyReadingList]=useState(false);
    
    

    
    const updateRequest = (request_id,whatTodo) =>{
      if(whatTodo=== "returnBook"){
        console.log("return book");
        const updatedReadingList = myReadingList.filter(item => item.request_id !== request_id);
        localStorage.setItem('myReadingList', JSON.stringify(updatedReadingList));
        setMyReadingList(updatedReadingList);
        if (updatedReadingList.length === 0) {
          setFindMyReadingList(false);
        }
      }else{
        if(whatTodo="removeFromWishList"){
          const updatedWhishList = myWishList.filter(item => item.request_id !== request_id);
          localStorage.setItem('myWishList', JSON.stringify(updatedWhishList));
          setMyWishList(updatedWhishList);
          if (updatedWhishList.length === 0) {
            setFindMyWishList(false);
          }
        }
      }
  }
  
 //מחיקת ספר מרשימת המתנה 
  const deleteBookFromMyWishList =async (request_id) => {
    const url = `http://localhost:3000/orderBasket/wishList/remove/${request_id}/users/${user.id}`;

    const requestMyWishList = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await fetch(url, requestMyWishList);
      if (res.status === 200) 
        updateRequest(request_id,"removeFromWishList");
        }
     catch (error) {
      console.log(error);
    }
  }
    //החזרה של  ספר
    const returnBook = async (request_id,volume_id) => {
      debugger;
        const url = `http://localhost:3000/orderBasket/myReadingList/returnBook/users/${user.id}`;

        const dateNow=new Date().toISOString();
        const requestUpdateBooksBorrowed = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({request_id,volume_id,dateNow}),
        };
        try {
          const res = await fetch(url, requestUpdateBooksBorrowed);
          if (res.status === 200) 
            updateRequest(request_id,"returnBook");
            }
         catch (error) {
          console.log(error);
        }
       

    }

    useEffect(()=>{
    debugger
    // ספרים שאני נמצא ברשימת המתנה על מנת להשאיל אותם
    console.log("Fetching myWishList...");
    const myWishListFromLocal = JSON.parse(localStorage.getItem('myWishList'));
    if (Array.isArray(myWishListFromLocal) && myWishListFromLocal.length>0) {
        setMyWishList(myWishListFromLocal);
        setFindMyWishList(true);
    } else {
      const url = `http://localhost:3000/orderBasket/wishList/users/${user.id}`;

      const requestMyWishList = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      console.log("Fetching myWishList from server...");
      fetch(url, requestMyWishList)
        .then((response) => response.json())
        .then((data) => {
          //const sortedWishList = [...data].sort((a, b) => a.id - b.id);
          console.log("this is my wish list")
          console.log(data)
          setMyWishList(data);
          if(data.length>0)
           setFindMyWishList(true);
          localStorage.setItem('myWishList', JSON.stringify(data));
        })
        .catch(() => setFindMyWishList(false));
    }
   //ספרים שאני כרגע קורא 
   console.log("Fetching myReadingList...");
    const myReadingListFromLocal = JSON.parse(localStorage.getItem('myReadingList'));
    if (Array.isArray(myReadingListFromLocal)&& myReadingListFromLocal.length>0) {
        setMyReadingList(myReadingListFromLocal);
        setFindMyReadingList(true);
    } else {
      const url = `http://localhost:3000/orderBasket/myReadingList/users/${user.id}`;

      const requestMyReadingList = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      console.log("Fetching myReadingList from server...");
      fetch(url, requestMyReadingList)
        .then((response) => response.json())
        .then((data) => {
          //const sortedWishList = [...data].sort((a, b) => a.id - b.id);
          console.log(data);
          setMyReadingList(data);
          if(data.length>0)
           setFindMyReadingList(true);
          localStorage.setItem('myReadingList', JSON.stringify(data));
        })
        .catch(() => setFindMyReadingList(false));
    }
    },[])
    let myWhisListHtml = null;
    let myReadingListHtml = null;

    if (FindMyWishList) {
        myWhisListHtml = myWishList.map((book) => (
            <TableRow key={book.volume_id}>
                <TableCell>{book.book_name}</TableCell>
                <TableCell>{book.author_name}</TableCell>
                <TableCell>{book.publication_year}</TableCell>
                <TableCell>{book.request_date}</TableCell>
                <TableCell>
                    <Button onClick={() => deleteBookFromMyWishList(book.request_id)}>Delete</Button>
                </TableCell>
            </TableRow>
        ));
    }

    if (FindMyReadingList) {
        myReadingListHtml = myReadingList.map((book) => (
            <TableRow key={book.volume_id}>
                <TableCell>{book.book_name}</TableCell>
                <TableCell>{book.author_name}</TableCell>
                <TableCell>{book.publication_year}</TableCell>
                <TableCell>{book.confirmation_date}</TableCell>
                <TableCell>
                    <Button onClick={() => returnBook(book.request_id, book.volume_id)}>Return book</Button>
                </TableCell>
            </TableRow>
        ));
    }

    return (
        <div>
            {myWhisListHtml !== null ? (
                <div className={styles["user-card"]}>
                    <h1>My Wish List</h1>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Book Name</TableCell>
                                    <TableCell>Author</TableCell>
                                    <TableCell>Publishing year</TableCell>
                                    <TableCell>Request Date</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myWhisListHtml}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ) : (
                <p>you don't have wish list</p>
            )}

            {myReadingListHtml !== null ? (
                <div className={styles["user-card"]}>
                    <h1>My reading list</h1>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Book Name</TableCell>
                                    <TableCell>Author</TableCell>
                                    <TableCell>Publishing year</TableCell>
                                    <TableCell>Since when have I had the book?</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myReadingListHtml}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ) : (
                <p>you don't have reading list</p>
            )}
        </div>
    );


}
export default OrderBasket;