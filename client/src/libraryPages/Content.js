import React, { useState } from 'react';
import { List, ListItem, ListItemText, Table, TableContainer, TableHead, TableRow, TableCell, Paper } from '@mui/material';
import { Book, CheckCircle, HighlightOff } from '@mui/icons-material';
// import "../css/bookList.js"

const BookList = ({ books, onBookSelect }) => {
    return (
        <List className="book-list">
            {books.map((book, index) => (
                <ListItem key={index} button onClick={() => onBookSelect(book)}>
                    <ListItemText
                        primary={book.name}
                        secondary={`${book.author} - ${book.categories.join(', ')}`}
                    />
                </ListItem>
            ))}
        </List>
    );
};

const BookComponent = (books) => {
    console.log(books["7 האחיות"]);
    const [selectedBook, setSelectedBook] = useState(null);

    // const books = [
    //     {
    //         name: 'Book 1',
    //         author: 'Author 1',
    //         categories: ['Category 1', 'Category 2'],
    //         isAvailable: true,
    //         copies: [
    //             { owner: 'Owner 1', available: true },
    //             { owner: 'Owner 2', available: false },
    //         ],
    //     },
    //     {
    //         name: 'Book 2',
    //         author: 'Author 2',
    //         categories: ['Category 3'],
    //         isAvailable: false,
    //         copies: [
    //             { owner: 'Owner 3', available: true },
    //             { owner: 'Owner 4', available: true },
    //         ],
    //     },
    //     // ניתן להוסיף עוד ספרים כפי שנדרש
    // ];

    const handleBookSelect = (book) => {
        setSelectedBook(book);
    };

    return (
        <div>content</div>
    //     <div>
    //     {Object.keys(books).map((bookKey) => (
    //       <div key={bookKey}>
    //         <h2>{books[bookKey].bookName}</h2>
    //         <p>Categories: {books[bookKey].categories.join(', ')}</p>
    //         <ul>
    //           {books[bookKey].volumes.map((volume, volumeIndex) => (
    //             <li key={volumeIndex}>
    //               <p>Author: {volume.author_name}</p>
    //               <p>Publication Year: {volume.publication_year}</p>
    //               {/* הוספת מידע נוסף לפי הצורך */}
    //             </li>
    //           ))}
    //         </ul>
    //       </div>
    //     ))}
    //   </div>

        //     <div>
    //     {books.map((book, bookIndex) => (
    //       <div key={bookIndex}>
    //         <h2>{book.bookName}</h2>
    //         <p>Categories: {book.categories.join(', ')}</p>
    //         <ul>
    //           {book.volumes.map((volume, volumeIndex) => (
    //             <li key={volumeIndex}>
    //               <p>Author: {volume.author_name}</p>
    //               <p>Publication Year: {volume.publication_year}</p>
    //               {/* הוספת מידע נוסף לפי הצורך */}
    //             </li>
    //           ))}
    //         </ul>
    //       </div>
    //     ))}
    //   {/* </div>
    //     <div className="app-container">
    //         <div className="book-details-container">
    //             {selectedBook && (
    //                 <div className="book-details">
    //                     <h2>{selectedBook.name}</h2>
    //                     <TableContainer component={Paper} className="copies-table">
    //                         <Table>
    //                             <TableHead>
    //                                 <TableRow>
    //                                     <TableCell>Owner</TableCell>
    //                                     <TableCell>Availability</TableCell>
    //                                 </TableRow>
    //                             </TableHead>
    //                             {selectedBook.copies.map((copy, index) => (
    //                                 <TableRow key={index}>
    //                                     <TableCell>{copy.owner}</TableCell>
    //                                     <TableCell>{copy.available ? <CheckCircle className="available-icon" /> : <HighlightOff className="unavailable-icon" />}</TableCell>
    //                                 </TableRow>
    //                             ))}
    //                         </Table>
    //                     </TableContainer>
    //                 </div>
    //             )}
    //         </div>
    //         <div className="book-list-container">
    //             <h1>Book List</h1>
    //             {/* <BookList books={books} onBookSelect={handleBookSelect} /> */}
    //         {/* {/* </div> */}
    //     </div> 
    );
};

export default BookComponent;