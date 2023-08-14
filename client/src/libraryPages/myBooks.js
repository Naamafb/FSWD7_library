import { useNavigate } from "react-router-dom";
import { useParams, useEffect, useState, version } from "react";
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import styles from "./Info.module.css";
import React from "react";
function MyBooks(){
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [myBooks,setMyBooks]= useState([]);
    const [findMyBooks, setFindMyBooks] = useState(false);
    const [currentVolume,setCurrentVolume]=useState(-1);
    const [currentReader,setCurrentReader]=useState(null)



    useEffect(()=>{
    // debugger
      const url = `http://localhost:3000/myBooks/users/${user.id}`;

      const requestMyBooks = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      fetch(url, requestMyBooks)
        .then((response) => response.json())
        .then((data) => {
        const filteredBooks = [...data].filter(book => 
        (book.deleted === 1 && book.availability === 1)||
        (book.deleted === 0 && book.availability === 1)||
        (book.deleted === 0 && book.availability === 0))
        .sort((a, b) => a.id - b.id);
          
          setMyBooks(filteredBooks);
          if(filteredBooks.length>0)
           setFindMyBooks(true);
        })
        .catch(() => setFindMyBooks(false));
    
    console.log(findMyBooks)
    },[])

    
    const deleteBook  = async (volume_id,book_name,author_name,publication_year) => {
    debugger;
    const url = `http://localhost:3000/myBooks/${volume_id}/deleteBook/users/${user.id}`;
    const dateNow=new Date().toISOString();
    const information ={
        deleted_date:dateNow,
        owner_name: user.first_name,
        owner_phone:user.phone,
        book_name:book_name,
        author_name:author_name,
        publication_year:publication_year
    };
    const requestDeleteBook = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(information)
    };
    try {
      const res = await fetch(url, requestDeleteBook);
        if (res.status === 200) 
            {
                const updatedMyBooksList = myBooks.map(item => {
                    if (item.volume_id === volume_id) {
                        return { ...item, deleted: 1 };
                    }
                    return item;
                });
                  console.log("updated list")
                  console.log(updatedMyBooksList)
                setMyBooks(updatedMyBooksList);
                if (updatedMyBooksList.length === 0) {
                setFindMyBooks(false);
                }
            }
        }
     catch (error) {
      console.log(error);
    }

    }
    const showReader = (volume_id) =>{
        debugger;
        if(currentVolume === volume_id){
            setCurrentVolume(-1); 
            setCurrentReader(null) ;
        }
        else{
            const readerForVolumeFromLocal = JSON.parse(localStorage.getItem(`readerForVolume=${volume_id}`));
            if(readerForVolumeFromLocal!==null){
                setCurrentReader(readerForVolumeFromLocal);
                console.log(readerForVolumeFromLocal)
            }
            else{
                const url = `http://localhost:3000/myBooks/${volume_id}/users/${user.id}`;

                const requestBookReader = {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                };

                fetch(url, requestBookReader)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data[0])
                    setCurrentReader(data[0]);
                    localStorage.setItem(`readerForVolume=${volume_id}`, JSON.stringify(data[0]));
                    })
                    .catch(() => setFindMyBooks(false));

            }
            setCurrentVolume(volume_id);

        }

    }


        let myBooksHtml = null;
    
        const renderReaderInfo = (book, deleted) => {
            return (
                <React.Fragment key={book.volume_id}>
                    <TableRow>
                        <TableCell>{book.book_name}</TableCell>
                        <TableCell>{book.author_name}</TableCell>
                        <TableCell>{book.publication_year}</TableCell>
                        {deleted === 0 && (
                            <TableCell>
                                <Button onClick={() => deleteBook(book.volume_id, book.book_name, book.author_name, book.publication_year)}>Delete book</Button>
                            </TableCell>
                        )}
                        <TableCell>
                            <Button onClick={() => showReader(book.volume_id)}>Who's the reader?</Button>
                        </TableCell>
                    </TableRow>
                    <TableRow className={styles.bookReader} style={{ visibility: book.volume_id === currentVolume && currentReader !== null && currentReader.volume_code === book.volume_id ? 'visible' : 'collapse' }}>
                        <TableCell colSpan={6}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Reader name</TableCell>
                                        <TableCell>Phone</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Borrowed date</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>{currentReader?.first_name} {currentReader?.last_name}</TableCell>
                                        <TableCell>{currentReader?.phone}</TableCell>
                                        <TableCell>{currentReader?.email}</TableCell>
                                        <TableCell>{currentReader?.confirmation_date}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableCell>
                    </TableRow>
                </React.Fragment>
            );
        };
    
        if (findMyBooks) {
            if (myBooks.length > 0) {
                myBooksHtml = myBooks.map((book) => {
                    if (book.availability === 0 && book.deleted === 0) {
                        return (
                            <TableRow key={book.volume_id}>
                                <TableCell>{book.book_name}</TableCell>
                                <TableCell>{book.author_name}</TableCell>
                                <TableCell>{book.publication_year}</TableCell>
                                <TableCell>
                                    <Button onClick={() => deleteBook(book.volume_id, book.book_name, book.author_name, book.publication_year)}>Delete book</Button>
                                </TableCell>
                            </TableRow>
                        );
                    } else if (book.availability === 1 && book.deleted === 0) {
                        return renderReaderInfo(book, 0);
                    } else if (book.availability === 1 && book.deleted === 1) {
                        return renderReaderInfo(book, 1);
                    }
                    return null;
                });
            } else {
                myBooksHtml = <TableRow><TableCell colSpan={6}>No books found.</TableCell></TableRow>;
            }
        }
    
        return (
            <div>
                {myBooksHtml !== null ? (
                    <div className={styles["user-card"]}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Book Name</TableCell>
                                        <TableCell>Author</TableCell>
                                        <TableCell>Publishing year</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {myBooksHtml}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                ) : (
                    <p>you don't have books</p>
                )}
            </div>
        );
    }


export default MyBooks