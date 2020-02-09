const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

const app = express();

// This makes the public folder accessible by everyone
app.use(express.static('public'));

// By adding this here, you can avoid having to put the entire code snippet into each route handler. i.e. app.post('/', bodyParser.urlencoded({ extended: true }) ,(req, res) => {...
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cookieSession({
        keys: ['lkasld235jDBJ']
    })
);

// This needs to be after the middleware. The code that lives in routes/admin/auth.js is being utilized here (the code in auth.js used to live in this file)
app.use(authRouter);
app.use(productsRouter);

app.listen(3000, () => {
    console.log('Listening on port 3000');
});