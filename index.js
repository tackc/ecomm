const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');

const app = express();

// By adding this here, you can avoid having to put the entire code snippet into each route handler. i.e. app.post('/', bodyParser.urlencoded({ extended: true }) ,(req, res) => {...
app.use(bodyParser.urlencoded({ extended: true }));

//Route handler (what to do when a request comes in from the browser)
app.get('/', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email"></input>
                <input name="password" placeholder="password"></input>
                <input name="password confirmation" placeholder="password confirmation"></input>
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

// Any time you are using await, the enclosing function must be labeled as async
app.post('/', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    
    // Check to see if someone has already signed up with this email
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email in use');
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords must match');
    }

    res.send('Account created!!!');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});