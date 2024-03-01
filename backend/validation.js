const { query, body, param, oneOf, check } = require('express-validator');

const emailChain = () => body('email').notEmpty().trim().isEmail().normalizeEmail();
const bookIdChain = () => body('book_id').notEmpty().escape().isInt({min: 1});
const passwordChain = () => body('password').notEmpty();
const courseIdChain = () => query('course_id').notEmpty().escape().isInt({min: 1});
const titleChain = () => query('title').notEmpty().escape().trim();
const locationChain = () => query('location').notEmpty().escape().trim();
const authorChain = () => query('author').notEmpty().escape().trim();
const emptyChain = () => query('*').equals("");
const paramIdChain = () => param('id').escape().isInt({min: 1});
const bookTypeIdChain = () => body('book_type_id').escape().notEmpty().isInt({min: 1});
const yearChain = () => body('year').notEmpty().escape().isInt({min: 1500, max: new Date().getFullYear()});
const editionChain = () => body('edition').notEmpty().escape().isInt({min: 1});
const descriptionChain = () => body('description').notEmpty().escape().trim();
const isbn10Chain = () => body('isbn_10').notEmpty().isLength({min: 10, max: 10}).escape();

const searchChain = () => oneOf([titleChain(), locationChain(), authorChain(), courseIdChain(), emptyChain()]);

const authorsChain = () => {
    return [
        body('authors').isArray(),
        check("authors.*.name").notEmpty().escape().trim(),
        check("authors.*.surname").notEmpty().escape().trim(),
    ]
}

const addBookChain = () => {
    return [
        authorsChain(),
        body('course_id').notEmpty().escape().isInt({min: 1}),
        bookTypeIdChain(),
        yearChain(),
        editionChain(),
        body('title').notEmpty().escape().trim(),
        descriptionChain(),
        isbn10Chain(),
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
        query('user_id').notEmpty().isInt({min: 1}),
        query('book_id').notEmpty().isInt({min: 1}),
    ]
}

const swapBookIdChain = () => {
    return [
        body('receiver_id').isInt({min: 1}),
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
        body('name').notEmpty().escape().trim(), 
        emailChain(),
        passwordChain(),
        body('surname').notEmpty().escape().trim(), 
        body('city').notEmpty().escape().trim(),
        body('country').notEmpty().escape().trim(), 
    ]
}

const tokenChain = () => {
    return [
        body('user').notEmpty().isString().escape().trim(),
        passwordChain(),
    ]
}

const updateSwapChain = () => {
    return [
        paramIdChain(),
        body('status_id').notEmpty().isInt({ min: 1 }),
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