import { useNavigate } from "react-router-dom";
import { useParams, useEffect, useState } from "react";
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import styles from "../Login.module.css";
// import {} '../Login.'

function CreateNewBook({book_name}) {
    console.log(book_name);
    const [isFieldEnabled, setIsFieldEnabled] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("currentUser")));
    const [newbook, setBook] = useState({
        book_name: book_name,
        author_name: "",
        categories: [],
        publication_year: "",
        owner_code: user.id,
        availability: false,
        borrower_username: ""
    });
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        console.log("useeffect");
        const url = "http://localhost:3000/category";
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        };
        fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                // התוצאה כאן היא מערך של הקטגוריות
                console.log(data);
                setCategories(data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                alert("Error fetching categories");
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBook({ ...newbook, categories: categories })
        console.log("handleSubmit");
        console.log(newbook);
        const url = "http://localhost:3000/book/newBook";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({newbook,selectedCategories}),
        };
        console.log(requestOptions.body);
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
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            });
    };

    const handleCategoryChange = (e) => {
        const categoryName = e.target.value;
        console.log(categoryName);
        console.log(selectedCategories);
        if (e.target.checked) {
            setSelectedCategories([...selectedCategories, categoryName]);
        } else {
            setSelectedCategories(selectedCategories.filter((category) => category !== categoryName));
        }
    };

    return (
        <section >
            {/* className={styles.section}> */}
            <form >
                {/* className={styles.form} > */}
                {/* onSubmit={handleSubmit}> */}
                <h5>the book does not exist, please add book deatiles:</h5>
                <div className={styles["form-row"]}>
                    <input
                        type="text"
                        placeholder="author_name"
                        className={styles["form-input"]}
                        id="author_name"
                        value={newbook.author_name}
                        onChange={(e) => setBook({ ...newbook, author_name: e.target.value })} // עדכון השדה של השם ב-user
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
                    />
                </div>
                <div>
                    {categories.map((category, index) => (
                        <div key={index}>
                            <label> 
                                <input
                                    type="checkbox"
                                    value={category.id}
                                    onChange={handleCategoryChange}
                                    // checked={selectedCategories.includes(category.id)}
                                />
                                {category.category_name}
                            </label>
                        </div>
                    ))}
                </div>
                <button onClick={handleSubmit}>add book</button>
            </form>
        </section>
    );
}


export default CreateNewBook;