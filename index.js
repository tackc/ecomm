const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

// By adding this here, you can avoid having to put the entire code snippet into each route handler. i.e. app.post('/', bodyParser.urlencoded({ extended: true }) ,(req, res) => {...
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['lkjsdMEIlk3845lkjfsLJD']
}))

// This needs to be after the middleware
app.use(authRouter);

app.listen(3000, () => {
    console.log('Listening on port 3000');
});