import { useNavigate } from "react-router-dom";
import { useParams, useEffect, useState, version } from "react";
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import styles from "./Info.module.css";
import React from "react";
function MyBooks(){
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [myBooks,setMyBooks]= useState([]);
    const [findMyBooks, setFindMyBooks] = useState(false);
    const [currentVolume,setCurrentVolume]=useState(-1);
    const [currentReader,setCurrentReader]=useState(null)



    useEffect(()=>{
        debugger
    const myBooksFromLocal = JSON.parse(localStorage.getItem('myBooksList'));
    if (Array.isArray(myBooksFromLocal) && myBooksFromLocal.length>0) {
      setMyBooks(myBooksFromLocal);
      setFindMyBooks(true);
    } else {
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
          const sortedBooks = [...data].sort((a, b) => a.id - b.id);
          setMyBooks(sortedBooks);
          if(sortedBooks.length>0)
           setFindMyBooks(true);
          localStorage.setItem('myBooksList', JSON.stringify(sortedBooks));
        })
        .catch(() => setFindMyBooks(false));
    }
    console.log(findMyBooks)
    },[])

    const deleteBook  = (volume_id) => {

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
                const url = `http://localhost:3000/myBooks/${volume_id}`;

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
if (findMyBooks) {
    debugger  
    if (myBooks.length > 0) {
        myBooksHtml = myBooks.map((book) => {
            if (book.availability === 0) {
                return (
                    <tr key={book.volume_id}>
                        <td>{book.book_name}</td>
                        <td>{book.author_name}</td>
                        <td>{book.publication_year}</td>
                        <td>
                            <button onClick={() => deleteBook(book.volume_id)}>Delete book</button>
                        </td>
                    </tr>
                )
            } else {
                return (
                    <React.Fragment key={book.volume_id}>
                        <tr>
                            <td>{book.book_name}</td>
                            <td>{book.author_name}</td>
                            <td>{book.publication_year}</td>
                            <td>
                                <button onClick={() => deleteBook(book.volume_id)}>Delete book</button>
                            </td>
                            <td>
                                <button onClick={() => showReader(book.volume_id)}>Who's the reader?</button>
                            </td>
                        </tr>
                        <tr className={styles.bookReader} style={{ visibility: book.volume_id === currentVolume && currentReader !== null  && currentReader.volume_code === book.volume_id ? 'visible' : 'collapse' }}>
                            <td colSpan="6">

                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Reader name</th>
                                            <th>Phone</th>
                                            <th>Email</th>
                                            <th>Borrowed date</th>
                                        </tr>
                                        <tr>

                                            <td>
                                                {currentReader?.first_name} {currentReader?.last_name}
                                            </td>
                                            <td>
                                                {currentReader?.phone}
                                            </td>
                                            <td>
                                                {currentReader?.email}
                                            </td>
                                            <td>
                                                {currentReader?.confirmation_date}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </React.Fragment>
                )
            }
        });
    } else {
        myBooksHtml = <tr><td colSpan="6">No books found.</td></tr>;
    }

    return (
        <div>
        {myBooksHtml !== null&&(
            <div className={styles["user-card"]}>
                <table>
                    <thead>
                        <tr>
                            <th>Book Name</th>
                            <th>Author</th>
                            <th>Publishing year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myBooksHtml}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    )
} else {
    return <p>you don't have books</p>;
}
}
export default MyBooks