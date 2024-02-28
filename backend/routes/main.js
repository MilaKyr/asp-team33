const express = require('express');
const router = express.Router();
const db = require('../queries');
const multer = require('multer');

const upload = multer({destination: 'data/uploads'})

router.get('/health_check', (request, response) => {
  response.status(200).send();
});
router.get('/', db.bookShowcase);
router.get('/search', db.search);
router.get('/courses', db.courses);
router.get('/book_types', db.bookTypes);
router.get('/request_statuses', db.requestStatuses);
router.get('/locations', db.locations);
router.get('/my_books', db.myBooks);
router.get('/my_book/:id', db.myBook);
router.post('/add_book', db.addBook);
router.put('/update_book/:id', db.updateBook);
router.delete('/my_book/:id', db.deleteBook);
router.post('/sign_in', db.signIn);
router.post('/sign_up', db.signUp);
router.get('/my_swaps', db.swaps);
router.get('/my_swaps/:id', db.mySwap);
router.put('/update_swap/:id', db.updateSwap);
router.post('/schedule_swap', db.scheduleSwap);
router.delete('/my_swaps/:id', db.deleteSwap);
router.get('/sent_swaps', db.sentSwaps);
router.post('/add_image/:id', upload.single('image'), db.addImage);
router.get('/image', db.getImage);


module.exports = router;