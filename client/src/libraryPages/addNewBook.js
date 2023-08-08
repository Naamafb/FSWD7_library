import { useNavigate } from "react-router-dom";
import { useParams, useEffect, useState } from "react";
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
// import styles from "../Login.module.css";
import styles from "../css/addNewBook.css";

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

  const handleSubmit = async (e) => {
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
        if (response.status === 202) {
          console.log(response);
          return response.json();
        } else
          // if (response.status === 409) {
          throw "Username or password already exists";
        //  }
      })
      .then((u) => {
        console.log(u);
        console.log("the book added");
        // localStorage.setItem("currentUser", JSON.stringify(user));
        // navigate(`/users/${user.username}/info`);
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  };
  //בדיקה האם הספר קיים בקשימת הספרים
  const checknookexist = async () => {
    console.log("checknookexist");
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

            // setBook({...newbook,author_name:u[0].author_name})
            setBook({ ...newbook, book_id: u[0].id, author_name: u[0].author_name, publication_year: u[0].publication_year })
            console.log(newbook);
            setBookDeatiles(true);
            setIsExist(true);
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
      <form className={styles.form} >
        {/* onSubmit={handleSubmit}> */}
        <h5>What is the book name?</h5>
        <div className={styles["form-row"]}>
          <input
            type="text"
            placeholder="book_name"
            className={styles["form-input"]}
            id="book_name"
            value={newbook.book_name}
            onChange={(e) => setBook({ ...newbook, book_name: e.target.value })} // עדכון השדה של השם ב-user
          />
        </div>
        <button type="button" onClick={checknookexist}>check book</button>
        {bookDeatiles ?
          <div>
            {isBookExist
              ? <div>
                <div className={styles["form-row"]}>
                  <input
                    type="text"
                    placeholder="author_name"
                    className={styles["form-input"]}
                    id="author_name"
                    value={newbook.author_name}
                    onChange={(e) => setBook({ ...newbook, author_name: e.target.value })} // עדכון השדה של השם ב-user
                    disabled={!isFieldEnabled}
                  />
                </div>
                <div className={styles["form-row"]}>
                  <input
                    type="year"
                    placeholder="publication_year"
                    className={styles["form-input"]}
                    id="publication_year"
                    value={newbook.publication_year}
                    onChange={(e) => setBook({ ...newbook, publication_year: e.target.value })} // עדכון השדה של השם ב-user
                    disabled={!isFieldEnabled}

                  />
                </div>
                <button type="submit" onClick={handleSubmit} className={styles.btn}>
                  ADD BOOK
                </button>
              </div>
              :
              <div>
                <CreateNewBook book_name={newbook.book_name} />

              </div>}
          </div> : <div></div>}
      </form>
    </section>
  );
}


export default AddNewBook;