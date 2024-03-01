const { query, body, param, oneOf } = require('express-validator');

const emailChain = () => body('email').notEmpty().trim().isEmail();
const bookIdChain = () => body('book_id').notEmpty().isNumeric().escape();
const passwordChain = () => body('password').notEmpty().trim();
const courseIdChain = () => query('course_id').notEmpty().isNumeric().escape();
const titleChain = () => query('title').notEmpty().isString().escape();
const locationChain = () => query('location').notEmpty().isString().escape();
const authorChain = () => query('author').notEmpty().isString().escape();
const emptyChain = () => query('*').equals("").escape();
const paramIdChain = () => param('id').isNumeric();
const authorsChain = () => body('authors').isArray();
const bookTypeIdChain = () => body('book_type_id').notEmpty().isNumeric();
const yearChain = () => body('year').notEmpty().isNumeric().isLength(4);
const editionChain = () => body('edition').notEmpty().isNumeric();
const descriptionChain = () => body('description').notEmpty().isString().escape();
const icbn10Chain = () => body('icbn_10').notEmpty().isString().escape();

const searchChain = () => oneOf([titleChain(), locationChain(), authorChain(), courseIdChain(), emptyChain()]);

const addBookChain = () => {
    return [
        authorsChain(),
        body('course_id').notEmpty().isNumeric().escape(),
        bookTypeIdChain(),
        yearChain(),
        editionChain(),
        body('title').notEmpty().isString().escape(),
        descriptionChain(),
        icbn10Chain(),
    ]
}

const updateBookChain = () => {
    return [
        paramIdChain(),
        addBookChain(),
    ]
}

const imageChain = () => {
    return [
        query('user_id').notEmpty().isNumeric(),
        query('book_id').notEmpty().isNumeric().escape(),
    ]
}

const swapBookIdChain = () => {
    return [
        body('receiver_id').notEmpty().isNumeric(),
        bookIdChain(),
    ]
}

const signInChain = () => {
    return [
        emailChain(),
        passwordChain(),
    ]
}

const signUpChain = () => {
    return [
        body('name').notEmpty().trim().isLength({min: 1}), 
        emailChain(),
        passwordChain(),
        body('surname').notEmpty().trim(), 
        body('city').notEmpty().trim(),
        body('country').notEmpty().trim(), 
    ]
}

const tokenChain = () => {
    return [
        body('user').notEmpty().isString().trim().escape(),
        passwordChain(),
    ]
}

const updateSwapChain = () => {
    return [
        paramIdChain(),
        body('status_id').notEmpty().isNumeric().isInt({ min: 1 }),
    ]
}
module.exports = {
    searchChain,
    paramIdChain,
    addBookChain,
    updateBookChain,
    swapBookIdChain,
    signInChain,
    tokenChain,
    signUpChain,
    updateSwapChain,
    imageChain,
  }