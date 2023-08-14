import { useNavigate } from "react-router-dom";
import { useParams, useEffect, useState } from "react";
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
// import styles from "../Login.module.css";
import styles from "../css/addNewBook.css";

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';

import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button } from "@mui/material";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';


import CreateNewBook from "./createNewBook";

function AddNewBook() {
  const [isFieldEnabled, setIsFieldEnabled] = useState(false);
  const [isBookExist, setIsExist] = useState(false);
  const [bookDeatiles, setBookDeatiles] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("currentUser")));
  const [newbook, setBook] = useState({
    book_id: '',
    book_name: "",
    author_name: "",
    title: "",
    publication_year: "",
    owner_code: user.id,
    availability: false,
    borrower_username: ""
  });
  const navigate = useNavigate();
  const myBooksFromLocal = JSON.parse(localStorage.getItem('myBooksList'));

  const handleSubmit =  (e) => {
    e.preventDefault();
    console.log("handleSubmit");
    const url = "http://localhost:3000/book/volumes";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ book_id: newbook.book_id, owner_code: newbook.owner_code }),
    };

    fetch(url, requestOptions)
      .then((response) => {
        console.log("bdika");
        console.log(response.status);
        if (response.status === 202) {
          console.log(response);
          return response.json();
        } else
          // if (response.status === 409) {
          throw "Username or password already exists";
        //  }
      })
      .then((u) => {
        window.location.reload();

        console.log(u);
        console.log("the book added");
        // setBookDeatiles(false);
        // navigate(`/users/${user.username}/addNewBook`);

      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  };
  //בדיקה האם הספר קיים בקשימת הספרים
  const checknookexist = async () => {
    console.log("checknookexist");
    console.log(newbook.book_name);
    setIsExist(false);
    if (newbook.book_name != "") {
      const url = `http://localhost:3000/book/${newbook.book_name}`;
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      };

      await fetch(url, requestOptions)
        .then((response) => {
          if (response.status === 200) {
            console.log(response);
            return response.json();
          } else
            // if (response.status === 409) {
            throw "Username or password already exists";
          //  }
        })
        .then((u) => {
          if (u[0]?.author_name) {
            setBook({ ...newbook, book_id: u[0].id, author_name: u[0].author_name, publication_year: u[0].publication_year })
            console.log(newbook);
            setBookDeatiles(true);
            setIsExist(true);
            setIsFieldEnabled(false);
          }
          else {
            setBookDeatiles(true);
            setIsExist(false);
            console.log("not found");
            setBook({ ...newbook, book_id: "", author_name: "", publication_year: "" })
            setIsFieldEnabled(true);
          }
        })
        .catch((error) => {
          console.error(error);
          alert(error);
        });

    }
  }
  return (
    <section className={styles.section}>
    <form className={styles.form}>
        <h5>What is the book name?</h5>
        <div className={styles["form-row"]}>
            <TextField
                type="text"
                placeholder="book_name"
                className={styles["form-input"]}
                id="book_name"
                value={newbook.book_name}
                onChange={(e) =>
                    setBook({ ...newbook, book_name: e.target.value })
                }
            />
        </div>
        <Button type="button" onClick={checknookexist}>
            Check Book
        </Button>
        {bookDeatiles ? (
            <div>
                {isBookExist ? (
                    <div>
                        <div className={styles["form-row"]}>
                            <TextField
                                type="text"
                                placeholder="author_name"
                                className={styles["form-input"]}
                                id="author_name"
                                value={newbook.author_name}
                                onChange={(e) =>
                                    setBook({ ...newbook, author_name: e.target.value })
                                }
                                disabled={!isFieldEnabled}
                            />
                        </div>
                        <div className={styles["form-row"]}>
                            <TextField
                                type="number"
                                placeholder="publication_year"
                                className={styles["form-input"]}
                                id="publication_year"
                                value={newbook.publication_year}
                                onChange={(e) =>
                                    setBook({ ...newbook, publication_year: e.target.value })
                                }
                                disabled={!isFieldEnabled}
                            />
                        </div>
                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            className={styles.btn}
                            variant="contained"
                            color="primary"
                        >
                            Add Book
                        </Button>
                    </div>
                ) : (
                    <div>
                        <CreateNewBook book_name={newbook.book_name} />
                    </div>
                )}
            </div>
        ) : (
            <div></div>
        )}
    </form>
</section>
    // <section className={styles.section}>
    //   <form className={styles.form} >
    //     {/* onSubmit={handleSubmit}> */}
    //     <h5>What is the book name?</h5>
    //     <div className={styles["form-row"]}>
    //       <input
    //         type="text"
    //         placeholder="book_name"
    //         className={styles["form-input"]}
    //         id="book_name"
    //         value={newbook.book_name}
    //         onChange={(e) => setBook({ ...newbook, book_name: e.target.value })} // עדכון השדה של השם ב-user
    //       />
    //     </div>
    //     <button type="button" onClick={checknookexist}>check book</button>
    //     {bookDeatiles ?
    //       <div>
    //         {isBookExist
    //           ? <div>
    //             <div className={styles["form-row"]}>
    //               <input
    //                 type="text"
    //                 placeholder="author_name"
    //                 className={styles["form-input"]}
    //                 id="author_name"
    //                 value={newbook.author_name}
    //                 onChange={(e) => setBook({ ...newbook, author_name: e.target.value })} // עדכון השדה של השם ב-user
    //                 disabled={!isFieldEnabled}
    //               />
    //             </div>
    //             <div className={styles["form-row"]}>
    //               <input
    //                 type="year"
    //                 placeholder="publication_year"
    //                 className={styles["form-input"]}
    //                 id="publication_year"
    //                 value={newbook.publication_year}
    //                 onChange={(e) => setBook({ ...newbook, publication_year: e.target.value })} // עדכון השדה של השם ב-user
    //                 disabled={!isFieldEnabled}

    //               />
    //             </div>
    //             <button type="submit" onClick={handleSubmit} className={styles.btn}>
    //               ADD BOOK
    //             </button>
    //           </div>
    //           :
    //           <div>
    //             <CreateNewBook book_name={newbook.book_name} />

    //           </div>}
    //       </div> : <div></div>}
    //   </form>
    // </section>
  );
}


export default AddNewBook;