import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Table, TableContainer, TableBody, TableHead, TableRow, TableCell, Paper, Button } from '@mui/material';
import { CheckCircle, HighlightOff } from '@mui/icons-material';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';

import './bookList.css';

const BookList = ({ books, onBookSelect }) => {
    return (
        <List className="book-list" style={{ maxHeight: '300px', overflow: 'auto' }}>
            <h3>Books list</h3>
            {books.map((book, index) => (
                <ListItem key={index} onClick={() => onBookSelect(book)}>
                    <ListItemText
                        primary={book.book.book_name}
                        secondary={`${book.book.author_name}  - ${book.categoriesList.join(', ')}`}
                    />
                </ListItem>
            ))}
        </List>
    );
};

const BookComponent = (books) => {

    console.log(books);
    const [selectedBook, setSelectedBook] = useState("");
    const [books_volums, setBooksVolums] = useState("");
    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        console.log(books_volums);
        console.log(selectedBook);
    }, [books_volums, selectedBook]);

    const handleBookSelect = async (book) => {
        console.log(book);
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
                    } else {
                        throw "book Volume fetch is wrong";
                    }
                })
                .then((u) => {
                    console.log(u);
                    setBooksVolums(u);
                    setSelectedBook(book);
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
                    } else {
                        throw "problem with borrow book";
                    }
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
                        <BookList books={books.booksVolums} onBookSelect={handleBookSelect} />
                    </div>
                    <div className="book-details-container">

                        {selectedBook && books_volums && (

                            <div className="book-details">
                                <h3>Volume list</h3>
                                <h4>Book name: {selectedBook.book.book_name}</h4>
                                <p>Author name: {selectedBook.book.author_name} || Books categories :{selectedBook.categoriesList.join(', ')} || Book publication year: {selectedBook.book.publication_year}</p>
                                <TableContainer component={Paper} className="copies-table" style={{ maxHeight: '200px', overflow: 'auto' }}>
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
