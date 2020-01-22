const express = require('express');
const { check } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

// Since these routes are living here instead of the root index.js, this is acting as a sub-router. This is why we use router.get instead of app.get in this file!
router = express.Router();

//Route handler (what to do when a request comes in from the browser)
router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

// Any time you are using await, the enclosing function must be labeled as async
router.post('/signup', [
    check('email').isEmail(),
    check('password'),
    check('passwordConfirmation')
], async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    
    // Check to see if someone has already signed up with this email
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email in use');
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords must match');
    }

    // Create user in user repo to represent this person
    const user = await usersRepo.create({ email, password });

    // Store the id of that user inside users cookies
    req.session.userId = user.id;

    res.send('Account created!!!');
});

router.get('/signout', (req, res) => {
    // take current session information in cookie and forget it
    req.session = null;
    res.send('You are logged out!')
})

router.get('/signin', (req, res) => {
    res.send(signinTemplate())
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email });

    if (!user) {
        return res.send('Email not found');
    }

    const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
    );
    if (!validPassword) {
        return res.send('Invalid password');
    }

    req.session.userId = user.id;

    res.send('You are signed in!!!');
})

module.exports = router;