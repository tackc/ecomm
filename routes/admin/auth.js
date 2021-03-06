const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser } = require('./validators');

// Since these routes are living here instead of the root index.js, this is acting as a sub-router. This is why we use router.get instead of app.get in this file!
router = express.Router();

//Route handler (what to do when a request comes in from the browser)
router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

// Any time you are using await, the enclosing function must be labeled as async
router.post('/signup', [requireEmail, requirePassword],
handleErrors(signupTemplate),
async (req, res) => {

    const { email, password, passwordConfirmation } = req.body;

    // Create user in user repo to represent this person
    const user = await usersRepo.create({ email, password });

    // Store the id of that user inside users cookies
    req.session.userId = user.id;

    res.redirect('/admin/products');
});

router.get('/signout', (req, res) => {
    // take current session information in cookie and forget it
    req.session = null;
    res.send('You are logged out!')
})

router.get('/signin', (req, res) => {
    // An empty object is being passed in here just in case there are no errors
    res.send(signinTemplate({}));
});

router.post('/signin', [requireEmailExists, requireValidPasswordForUser],
    handleErrors(signinTemplate),
    async (req, res) => {

    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;

    res.redirect('/admin/products');
})

module.exports = router;