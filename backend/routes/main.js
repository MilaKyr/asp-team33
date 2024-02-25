const express = require('express');
const router = express.Router();
const db = require('../queries');
const multer = require('multer');

const upload = multer({destination: 'data/uploads'})

router.get('/health_check', (request, response) => {
  response.status(200).send();
});
router.get('/', db.bookShowcase);
router.get('/search', db.Search);
router.get('/courses', db.Courses);
router.get('/book_types', db.BookTypes);
router.get('/request_statuses', db.RequestStatuses);
router.get('/locations', db.Locations);
router.get('/my_book/:id', db.MyBook);
router.post('/add_book', db.addBook);
router.get('/my_books', db.MyBooks);
router.put('/update_book/:id', db.updateBook);
router.post('/sign_in', db.SignIn);
router.post('/sign_up', db.SignUp);
router.get('/my_swaps', db.Swaps);
router.get('/sent_swaps', db.sentSwaps);
router.post('/schedule_swap', db.ScheduleSwap);
router.put('/update_swap/:id', db.UpdateSwap);
router.delete('/my_swaps/:id', db.DeleteSwap);
router.delete('/my_book/:id', db.DeleteBook);
router.post('/add_image/:id', upload.single('image'), db.addImage);
router.get('/image', db.getImage);


module.exports = router;