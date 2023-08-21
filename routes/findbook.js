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
      console.log("books");
      console.log(books);
      getBooksCategories(books)
        .then((booksCategories) => {
          console.log("booksCategories");
          console.log(booksCategories);
          getCategories(booksCategories)
            .then((categories) => {
              console.log("categories");
              console.log(categories);
              const result = generateReaultBookList(books, booksCategories, categories);
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
  return 'select * from books b where b.id > 0 ';
};

const filterByCategories = (categories) => {

  if (categories.length) {
    const valuesString = categories.join(', ');
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
          const result = generateReaultVolumeUserList(volums, users);
          console.log(result);
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
});

const getBookVolums = (book_id) => {
  const q = `select * from volumes v where v.book_code='${book_id}' `
  return sqlConnect(q);
};

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

const generateReaultVolumeUserList = (volums, users) => {
  const resultVolumeUserList = [];

  for (const volume of volums) {
    const correspondingUser = users.find(user => user.id === volume.owner_code);

    if (correspondingUser) {
      const volumeWithUser = {
        ...volume,
        owner: correspondingUser
      };

      resultVolumeUserList.push(volumeWithUser);
    }
  }

  return resultVolumeUserList;
}

const generateReaultBookList = (books, booksCategories, categories) => {
  var result = [];

  for (const book of books) {

    const categoriesList = getBookCategoriesList(
      booksCategories,
      categories,
      book.id
    );
    result.push({ book, categoriesList })
  }
  console.log(result[0]);
  return result
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
  console.log(" in getBooksCategories");
  const booksIds = books.map((b) => b.id);//book_code היה 
  const uniqueArr = removeDuplicatesFromArray(booksIds);
  const q = getBooksCategoriesQuery(uniqueArr);
  return sqlConnect(q);
};

const getBooksCategoriesQuery = (booksIds) => {
  const valuesString = booksIds.join(', ');
  return `select * from book_categories where book_id in (${valuesString})`;
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

const changeAvailavility = (volume_id) => {
  const q = `UPDATE volumes set availability=1 where volume_id='${volume_id}'`;
  return sqlConnect(q);
}

module.exports = router;
