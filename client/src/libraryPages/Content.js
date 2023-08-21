import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Table, TableContainer,TableBody, TableHead, TableRow, TableCell, Paper, Button } from '@mui/material';
import {  CheckCircle, HighlightOff } from '@mui/icons-material';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';

import './bookList.css';

const BookList = ({ books, onBookSelect }) => {
    return (
        <List className="book-list">
            {books.map((book, index) => (
                <ListItem key={index} onClick={() => onBookSelect(book)}>
                    <ListItemText
                        primary={book.book.book_name}
                        // secondary={`${book.volumes[0].author_name} - ${book.categoriesList.join(', ')}`}
                        secondary={`${book.book.author_name}  - ${book.categoriesList.join(', ')}`}


                    />
                </ListItem>
            ))}
        </List>
    );
};

// const BookComponent = (booksVolums) => {
const BookComponent = (books, updateAfterChange) => {

    console.log(books);
    const [selectedBook, setSelectedBook] = useState("");
    const [books_volums, setBooksVolums] = useState("");
    const user = JSON.parse(localStorage.getItem("currentUser"));

    // useEffect(() => {
    //     console.log('booksVolums');
    //     console.log(books.booksVolums);
    //     setSelectedBook(books.booksVolums)
    // }, []);
    useEffect(() => {
        console.log(books_volums);
        console.log(selectedBook);
    }, [books_volums, selectedBook]);

    const handleBookSelect = async (book) => {
        console.log(book);
        setSelectedBook(book);
        if (book) {
            const url = `http://localhost:3000/findbook/bookVolume/${book.book.id}`;
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            await fetch(url, requestOptions)
                .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        console.log("status 200");
                        return response.json();
                    } else
                        // if (response.status === 409) {
                        throw "";
                    //  }
                })
                .then((u) => {
                    console.log(u);
                    // console.log(selectedBook);
                    setBooksVolums(u);
                    setSelectedBook(book);
                    console.log(books_volums);
                    console.log(selectedBook);

                    //to do set volums
                })
                .catch((error) => {
                    console.error(error);
                    alert(error);
                });
        }
        else {
            alert("volume_id or owner_code is undefind");
        }
    };

    //myReadingList
    const borrowBook = (volume_id, owner_code) => {
        console.log(volume_id, owner_code);
        if (volume_id && owner_code) {
            const url = "http://localhost:3000/findbook/borrowBook";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ volume_id: volume_id, owner_code: owner_code }),
            };
            fetch(url, requestOptions)
                .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        console.log("status 200");
                        return response.json();
                    } else
                        // if (response.status === 409) {
                        throw "problem with borrow book";
                    //  }
                })
                .then((u) => {
                    console.log(u);
                    console.log("befor update");
                    handleBookSelect(selectedBook);
                })
                .catch((error) => {
                    console.error(error);
                    alert(error);
                });
        }
        else {
            alert("volume_id or owner_code is undefind");
        }
    }

    const addBookToWishlist = (volume_id, owner_code) => {
        console.log(volume_id, owner_code);
        if (volume_id && owner_code) {
            const url = "http://localhost:3000/findbook/addBookToWishlist";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ volume_id: volume_id, owner_code: owner_code }),
            };
            fetch(url, requestOptions)
                .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        console.log("status 200");
                        return response.json();
                    } else
                        // if (response.status === 409) {
                        throw "problem with add Book To Wish list";
                    //  }
                })
                .then((u) => {
                    console.log(u);
                    console.log("befor update");
                    handleBookSelect(selectedBook);
                })
                .catch((error) => {
                    console.error(error);
                    alert(error);
                });
        }
        else {
            alert("volume_id or owner_code is undefind");
        }
    }

    return (
    <div>
        {books ?
            <div className="app-container">
                <div className="book-list-container">
                    {/* <h1 style={{ fontSize: '1.5rem' }}>Book List</h1> */}
                    <BookList books={books.booksVolums} onBookSelect={handleBookSelect} />
                </div>
                <div className="book-details-container">
                    {/* <h1 style={{ fontSize: '1.5rem' }}>Volume List</h1> */}

                    {selectedBook && books_volums && (

                        <div className="book-details">
                            <h2>Book name: {selectedBook.book.book_name}</h2>
                            <h4>Author name: {selectedBook.book.author_name}</h4>
                            <h4>Books categories :{selectedBook.categoriesList.join(', ')}</h4>
                            <h4>Book publication year: {selectedBook.book.publication_year}</h4>
                            <TableContainer component={Paper} className="copies-table">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Owner</TableCell>
                                            <TableCell>Availability</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {books_volums.map((volume, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{volume.owner.first_name}</TableCell>
                                            <TableCell>{volume.availability == '0' ? <CheckCircle className="available-icon" /> : <HighlightOff className="unavailable-icon" />}</TableCell>
                                            {volume.availability == '0' ?
                                                <Button onClick={() => borrowBook(volume.volume_id, user.id)}>Borrow book</Button>
                                                :
                                                <Button onClick={() => addBookToWishlist(volume.volume_id, user.id)}>Add book to wishlist</Button>
                                            }
                                        </TableRow>
                                    ))}
                                </Table>
                            </TableContainer>
                        </div>
                    )}
                </div>

            </div>
            : <div>no results</div>
        }
    </div>
    );
};

export default BookComponent;
