const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const { sqlConnect } = require('./connectTodb.js');

//פונקציה המחזירה ID של ספר
const getbookId = (bookName) => {
    console.log(bookName);
    const query = `SELECT id FROM books WHERE book_name = '${bookName}'`;

    return sqlConnect(query);

}

//פונקציה להוספת כרך
const addvolume = (book_id, owner_code) => {
    const addVolumeQuery = `INSERT INTO volumes (book_code, owner_code) VALUES ('${book_id}', '${owner_code}')`;
    return sqlConnect(addVolumeQuery);
}

//ךהןסיף עותק
router.post("/volumes", function (req, res) {
    const idis = req.body;
    console.log(idis);
    const addVolumeQuery = `INSERT INTO volumes (book_code, owner_code) VALUES ('${idis.book_id}', '${idis.owner_code}')`;
    sqlConnect(addVolumeQuery)
        .then((result) => {
            console.log("28");
            return res.status(202).json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("An error occurred");
        })
});
//להוסיף ספר
router.post("/newBook", function (req, res) {
    // const idis = req.body;
    const { newbook, selectedCategories } = req.body;
console.log("newBook");
    console.log(newbook);
    console.log(selectedCategories);
    const addBookQuery = `INSERT INTO books (book_name, author_name,publication_year) VALUES ('${newbook.book_name}', '${newbook.author_name}','${newbook.publication_year}')`;
    sqlConnect(addBookQuery)
        .then((result) => {
            getbookId(newbook.book_name)
                .then((id) => {
                    console.log("get book id");
                    console.log(id[0].id);
                    addBookCategories(id[0].id, selectedCategories)
                        .then((console.log("succes category")));
                    addvolume(id[0].id, newbook.owner_code)
                        .then((console.log("addvolume succes")))
                })
            res.status(202).json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("An error occurred");
        })
});

//פונקציה להוספת קטגוריות לספר
const addBookCategories = (id, category_names) => {
    const addBookCategoriesQuery = `INSERT INTO book_categories (book_id, category_id) VALUES ${category_names
        .map((category_names) => `('${id}', '${category_names}')`)
        .join(", ")}`;

    return sqlConnect(addBookCategoriesQuery);
};

//book_categories
router.post("/book_categories", function (req, res) {
    const idis = req.body;
    console.log("idis");
    console.log(idis);
    const addbook_categoriesQuery = `INSERT INTO book_categories (book_id, category_id) VALUES ('${idis.book_id}', '${idis.category_id}')`;
    sqlConnect(addbook_categoriesQuery)
        .then((result) => {
            res.status(202);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("An error occurred");
        })
});
const returnBookVolum = (volume_id) => {
    const query = `SELECT DISTINCT *
    FROM (
      SELECT *
      FROM library_fswd7.books
      JOIN library_fswd7.volumes ON books.id = volumes.book_code
      WHERE volume_id = '${volume_id}' 
    ) AS joined_result`;
    sqlConnect(query)
        .then((results) => {
            console.log(results);
            res.status(200).json(results)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("An error occurred");
        });
};

// router.post("/", function (req, res) {
//     const book = req.body;
//     const book_id = `SELECT book_id FROM books WHERE book_name = '${book.book_name}'`;
//     sqlConnect(book_id)
//         .then((result) => {
//             if (result.length > 0) {//הספר קיים-> נוסיף כרך 
//                 console.log("the book exist");

//                 const addVolumeQuery = `INSERT INTO volumes (book_id, owner_code) VALUES '${book_id}', '${book.owner_code}'`;
//                 sqlConnect(addVolumeQuery)
//                     .then((result) => {
//                         console.log(result);
//                         return result.status(202);
//                     })
//             }
//             //הספר לר קיים->נוסיף ספר וגם כרך
//             const addBook = `INSERT INTO book ( book_name,author_name,publication_year) VALUES ('${book_name}', '${author_name}','${publication_year}' )`;
//             console.log(addBook);
//             sqlConnect(addBook)
//                 .then((results) => {
//                     console.log(results);
//                     book_id = `SELECT book_id FROM books WHERE book_name = '${book.book_name}'`;
//                     sqlConnect(book_id)
//                         .then((result) => {
//                             if (result.length > 0) {//הספר קיים-> נוסיף כרך 
//                                 console.log("the book exist");

//                                 const addVolumeQuery = `INSERT INTO volumes (book_id, owner_code) VALUES '${book_id}', '${book.owner_code}'`;
//                                 sqlConnect(addVolumeQuery)
//                                     .then((result) => {
//                                         console.log("138");
//                                         console.log(result);
//                                         return result.status(202);
//                                     })
//                             }

//                         })
//                         .catch((err) => {
//                             console.error(err);
//                             res.status(500).send("An error occurred");
//                         });
//                 })
//                 .catch((err) => {
//                     console.error(err);
//                     res.status(500).send("An error occurred");
//                 });
//         });
// });

//בודק האם הספר קיים ומחזיר אותו אם כן
router.get("/:book_name", function (req, res) {

    const bookName = req.params.book_name;
    console.log(bookName);
    const query = `SELECT * FROM books WHERE book_name = '${bookName}'`;

    sqlConnect(query)
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("An error occurred");
        });
});

//למחוק ספר
router.delete("/:id", function (req, res) {
    const bookId = req.params.id;

    let query = `DELETE FROM books WHERE id = ${bookId}`;
    sqlConnect(query)
        .then(() => {
            res.status(200).json({ message: "book deleted successfully" });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("An error occurred");
        });

});

module.exports = router;