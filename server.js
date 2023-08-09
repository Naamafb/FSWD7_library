const express = require('express');

const cors = require('cors');

const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const loginRoutes = require('./routes/login');
const regRoutes = require('./routes/register');
const userRoutes = require('./routes/user');
const infoRoutes = require('./routes/info');
const bookRoutes = require('./routes/book');
const myBooksRoutes = require('./routes/myBooks');
const orderBasketRoutes = require('./routes/orderBasket');
const categoriesRoutes = require('./routes/category');
const findbookRoutes = require('./routes/findbook');
const messagesRoutes = require('./routes/messages');

 

app.use('/info',infoRoutes);
app.use('/register', regRoutes);
app.use('/login', loginRoutes);
app.use('/users', userRoutes);
app.use('/book', bookRoutes);
app.use('/myBooks', myBooksRoutes);
app.use('/orderBasket', orderBasketRoutes);
app.use('/category', categoriesRoutes);
app.use('/findbook', findbookRoutes);
app.use('/messages', messagesRoutes);


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
    