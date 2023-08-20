const express = require('express');
const router = express.Router();
const { sqlConnect } = require('./connectTodb.js');

router.post('/filterBooks', function (req, res) {
  const filterModel = req.body;
  console.log(filterModel);

  getBooks(filterModel)
    .then((books) => {
      if (books.length === 0) {
        return res.status(200).json([]);
      }
      return res.status(200).json(books);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('An error occurred');
    });
});

const getBooks = (filterModel) => {
  const q = getBooksQuery(filterModel);
  return sqlConnect(q);
};

const getBooksQuery = (filterModel) => {
  const query =
    getBooksBaseQuery() +
    filterByBookName(filterModel.book_name) +
    filterByAuthorName(filterModel.author_name) +
    filterByCategories(filterModel.categories) + //בעיה עם שליפה של כרכים
    filterByPublicationYear(filterModel.publication_year);

  return query;
};
const getBooksBaseQuery = () => {
  return 'select * from books b on where deleted=0 ';
};
const filterByCategories = (categories) => {
  const valuesString = categories.join(', ');

  if (categories.length) {
    return `and exists(select * from book_categories bc where bc.book_id = b.id and bc.category_id in (${valuesString})) `;
  }
  return '';
};

router.get('/bookVolume/:book_id', function (req, res) {
  const book_id = req.params.book_id;

  getBookVolums(book_id)
    .then((volums) => {
      if (volums.length === 0) {
        return res.status(200).json([]);
      }

      getUsers(volums)
        .then((users) => {
          //לחבר בין כרכים למשתמשים
          res.status(200).json(result);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('An error occurred');
        });


      // res.status(200).json(books);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('An error occurred');
    });
});
const getBookVolums = (book_id) => {
  const q = `select * from volumes v where v.book_code='${book_id}' `
  return sqlConnect(q);
};

router.post('/filter', function (req, res) {
  const filterModel = req.body;
  console.log(filterModel);
  getVolums(filterModel)
    .then((volums) => {
      if (volums.length === 0) {
        return res.status(200).json([]);
      }
      getBooksCategories(volums)
        .then((booksCategories) => {
          getCategories(booksCategories)
            .then((categories) => {
              getUsers(volums)
                .then((users) => {
                  const result =

                    generateReaultList(
                      volums,
                      booksCategories,
                      categories,
                      users

                    );
                  res.status(200).json(result);
                })
                .catch((err) => {
                  console.error(err);
                  res.status(500).send('An error occurred');
                });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).send('An error occurred');
            });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('An error occurred');
        });
      // res.status(200).json(books);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('An error occurred');
    });
});

router.post('/borrowBook', function (req, res) {
  const data = req.body;
  console.log(data);
  addBookBorrowedAsBorrowed(data.owner_code, data.volume_id)
    .then((result) => {
      changeAvailavility(data.volume_id);
      console.log("borrowBook");
      // console.log(result);
      // console.log(res);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('An error occurred');
    });
});

router.post('/addBookToWishlist', function (req, res) {
  const data = req.body;
  console.log(data);

  addBookBorrowedAsPending(data.owner_code, data.volume_id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('An error occurred');
    });
});

const getVolums = (filterModel) => {
  const q = getVolumsQuery(filterModel);
  return sqlConnect(q);
};

const generateReaultList = (volums, booksCategories, categories, users) => {
  var result = {};

  for (const volum of volums) {
    const bookName = volum.book_name;

    if (!result[bookName]) {
      const categoriesList = getBookCategoriesList(
        booksCategories,
        categories,
        volum.book_code
      );
      result[bookName] = {
        bookName: bookName,
        volumes: [],
        categories: categoriesList,
        // owner: owner,
      };
    }
    const owner = users.filter((u) => u.id == volum.owner_code);
    volum.owner = owner
    result[bookName].volumes.push(volum);
  }
  return Object.values(result);
};

const getBookCategoriesList = (booksCategories, categories, bookId) => {
  const categoriesIds = booksCategories.filter((bc) => bc.book_id == bookId).map(bc => bc.category_id);
  return categories
    .filter((c) => categoriesIds.includes(c.id))
    .map((c) => c.category_name);
};

const getUsers = (books) => {
  const usersIds = books.map((b) => b.owner_code);
  const uniqueArr = removeDuplicatesFromArray(usersIds);
  const q = getUsersQuery(uniqueArr);
  return sqlConnect(q);
};

const getUsersQuery = (Ids) => {
  const valuesString = Ids.join(', ');
  return `select * from users where id in (${valuesString})`;
};

const getCategories = (booksCategories) => {
  const categoriesIds = booksCategories.map((b) => b.category_id);
  const uniqueArr = removeDuplicatesFromArray(categoriesIds);
  const q = getCategoriesQuery(uniqueArr);
  return sqlConnect(q);
};

const getCategoriesQuery = (Ids) => {
  const valuesString = Ids.join(', ');
  return `select * from categories where id in (${valuesString})`;
};

const getBooksCategories = (books) => {
  const booksIds = books.map((b) => b.book_code);
  const uniqueArr = removeDuplicatesFromArray(booksIds);
  const q = getBooksCategoriesQuery(uniqueArr);
  return sqlConnect(q);
};

const getBooksCategoriesQuery = (booksIds) => {
  const valuesString = booksIds.join(', ');
  return `select * from book_categories where book_id in (${valuesString})`;
};

const getVolumsQuery = (filterModel) => {
  const query =
    getVolumsBaseQuery() +
    filterByBookName(filterModel.book_name) +
    filterByAuthorName(filterModel.author_name) +
    filterByCategory(filterModel.categories) +
    filterByPublicationYear(filterModel.publication_year);

  return query;
};
//שאילתא השולפת את כל הספרים הקיימים במערכת
const getVolumsBaseQuery = () => {
  return 'select * from volumes v inner join books b on v.book_code=b.id where deleted=0 ';
};

const filterByBookName = (bookName) => {
  if (bookName) {
    return `and b.book_name='${bookName}' `;
  }
  return '';
};

const filterByPublicationYear = (publicationYear) => {
  if (publicationYear) {
    return `and b.publication_year='${publicationYear}' `;
  }
  return '';
};

const filterByAuthorName = (authorName) => {
  if (authorName) {
    return `and b.author_name='${authorName}' `;
  }
  return '';
};

const filterByCategory = (categories) => {
  const valuesString = categories.join(', ');

  if (categories.length) {
    return `and exists(select * from book_categories bc where bc.book_id = v.book_code and bc.category_id in (${valuesString})) `;
  }
  return '';
};

const removeDuplicatesFromArray = (arr) => {
  return arr.reduce(
    (acc, num) => (acc.includes(num) ? acc : [...acc, num]),
    []
  );
};

const addBookBorrowedAsPending = (userCode, volumeCode) => {
  const queryModel = getAddBookBorrowedAsPendingQuery(userCode, volumeCode);
  return sqlConnect(queryModel.query, queryModel.values);
};

const addBookBorrowedAsBorrowed = (userCode, volumeCode) => {
  const queryModel = getAddBookBorrowedAsBorrowedQuery(userCode, volumeCode);
  return sqlConnect(queryModel.query, queryModel.values);
};

const getAddBookBorrowedAsPendingQuery = (userCode, volumeCode) => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const values = [currentDate, userCode, volumeCode];
  const q = `INSERT INTO books_borrowed (request_date,user_code,volume_code) VALUES (?,?,?)`;
  return { query: q, values: values };
};

const getAddBookBorrowedAsBorrowedQuery = (userCode, volumeCode) => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const values = [currentDate, userCode, volumeCode, currentDate];
  const q = `INSERT INTO books_borrowed (request_date,user_code,volume_code,confirmation_date) VALUES (?,?,?,?)`;
  return { query: q, values: values };
};

const changeAvailavility=(volume_id)=>{
  const q=`UPDATE volumes set availability=1 where volume_id='${volume_id}'`;
  return sqlConnect(q);
}

const runSqlQuery = (query) => { };

module.exports = router;
