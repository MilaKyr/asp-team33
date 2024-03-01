const express = require('express');
const router = express.Router();
const db = require('../queries');
const multer = require('multer');
const validator = require('../validation');
const upload = multer({destination: 'data/uploads'})

router.get('/health_check', (request, response) => {
  response.status(200).send();
});
router.get('/', db.bookShowcase);
router.get('/search', validator.searchChain(), db.search);
router.get('/courses', db.courses);
router.get('/book_types', db.bookTypes);
router.get('/request_statuses', db.requestStatuses);
router.get('/locations', db.locations);
router.get('/my_books', db.myBooks);
router.get('/my_book/:id', validator.paramIdChain(), db.myBook);
router.post('/add_book', validator.addBookChain(), db.addBook);
router.put('/update_book/:id', validator.updateBookChain(), db.updateBook);
router.delete('/my_book/:id', validator.paramIdChain(), db.deleteBook);
router.post('/sign_in', validator.signInChain(), db.signIn);
router.post('/sign_up', validator.signUpChain(), db.signUp);
router.get('/my_swaps', db.swaps);
router.get('/my_swaps/:id', validator.paramIdChain(), db.mySwap);
router.put('/update_swap/:id', validator.updateSwapChain(), db.updateSwap);
router.post('/schedule_swap', validator.swapBookIdChain(), db.scheduleSwap);
router.delete('/my_swaps/:id', validator.paramIdChain(), db.deleteSwap);
router.get('/sent_swaps', db.sentSwaps);
router.post('/add_image/:id', validator.paramIdChain(), upload.single('image'), db.addImage);
router.get('/image', validator.imageChain(), db.getImage);
router.post('/token/generate', validator.tokenChain(), db.generateToken);

module.exports = router;