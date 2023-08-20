import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Table, TableContainer, TableHead, TableRow, TableCell, Paper, Button } from '@mui/material';
import { Book, CheckCircle, HighlightOff } from '@mui/icons-material';
import './bookList.css';

const BookList = ({ books, onBookSelect }) => {
    return (
        <List className="book-list">
            {books.map((book, index) => (
                <ListItem key={index} onClick={() => onBookSelect(book)}>
                    <ListItemText
                        primary={book.bookName}
                        secondary={`${book.volumes[0].author_name} - ${book.categories.join(', ')}`}
                    />
                </ListItem>
            ))}
        </List>
    );
};

// const BookComponent = (booksVolums) => {
const BookComponent = (booksVolums,updateAfterChange) => {

    console.log(booksVolums);
    const [selectedBook, setSelectedBook] = useState(null);
    const [books_volums, setBooksVolums] = useState();
    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        console.log('booksVolums');
        console.log(booksVolums.booksVolums);
        setBooksVolums(booksVolums.booksVolums)
    }, []);

    const handleBookSelect = (book) => {
        setSelectedBook(book);
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
                    () => updateAfterChange();
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
                    () => updateAfterChange();
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

    return (<div>
        {books_volums ?
            <div className="app-container">

                <div className="book-details-container">
                    <h1 style={{ fontSize: '1.5rem' }}>Volume List</h1>

                    {selectedBook && (

                        <div className="book-details">
                            <h2>Book name: {selectedBook.bookName}</h2>
                            <h4>Author name: {selectedBook.volumes[0].author_name}</h4>
                            <h4>Books categories :{selectedBook.categories.join(', ')}</h4>
                            <h4>Book publication year: {selectedBook.volumes[0].publication_year}</h4>
                            <TableContainer component={Paper} className="copies-table">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Owner</TableCell>
                                            <TableCell>Availability</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {selectedBook.volumes.map((volume, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{volume.owner[0].first_name}</TableCell>
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
                <div className="book-list-container">
                    <h1 style={{ fontSize: '1.5rem' }}>Book List</h1>
                    <BookList books={booksVolums.booksVolums} onBookSelect={handleBookSelect} />
                </div>
            </div>
            : <div>no results</div>
        }
    </div>
    );
};

export default BookComponent;
