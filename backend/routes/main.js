const express = require('express');
const router = express.Router();
const db = require('../queries');


router.get('/health_check', (request, response) => {
  response.status(200).send();
});
router.get('/', db.bookShowcase);
router.get('/search', db.search);
router.get('/my_book/:id', db.MyBook);
router.post('/new_book', db.addBook);
router.put('/update_book', db.updateBook);
router.post('/sign_in', db.SignIn);
router.post('/sign_up', db.SignUp);
router.get('/my_swaps', db.Swaps);
router.post('/schedule_swap', db.ScheduleSwap);  // TODO
router.delete('/my_swaps/:id', db.DeleteSwap);
router.delete('/my_book/:id', db.DeleteBook);



module.exports = router;