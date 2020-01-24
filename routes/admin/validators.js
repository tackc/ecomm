const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('You must use a valid email')
        .custom(async email => {
        // Check to see if someone has already signed up with this email
        const existingUser = await usersRepo.getOneBy({ email });
        if (existingUser) {
            throw new Error('Email in use');
        }
    }),
    requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 & 20 characters'),
    requirePasswordConfirmation: check('passwordConfirmation').trim().isLength({ min: 4, max: 20 }).withMessage('Must be between 4 & 20 characters').custom((passwordConfirmation, { req }) => {
        if (passwordConfirmation !== req.body.password) {
            throw new Error('Passwords must match');
        }
    })
};