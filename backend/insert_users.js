var fs = require('fs');
const crypto = require('./crypto');
const utils = require('./utils');
const { getPool } = require('./postgresql');

const parsedJSON = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

var authors = new Set();
var courses = new Set();
var book_types = new Set();
var swap_status = new Set();

async function flushDb() {
    const client = await getPool().connect();
    const _ = await client.query("Truncate booktype, bookauthor, author, bookcourse, course, userbook, bookimage, book, appuser, status, request")
    await client.end();
    console.log("dropped all data");
}

function fillSubdata() {
    parsedJSON.books.forEach((book) => {
        book.authors.forEach((author) => {
            authors.add(author.name + "," + author.surname);
        });
        book_types.add(book.book_type);
        courses.add(book.course.name);
    });

    parsedJSON.requests.forEach((swap) => {
        swap_status.add(swap.status);
    });
}

async function insertStatus() {
    var values = []
    for (swap of parsedJSON.requests) {
        values.push({ name: swap.status })
    }
    var query = utils.insertData("status", ["name"], values, " RETURNING id");
    const res = await getPool().query(query);
    const statusIds = new Map();
    values.map((key, index) => (statusIds.set(key.name, res.rows[index].id)));
    return statusIds;
}

async function insertAuthors() {
    var values = []
    for (author of authors) {
        var splitted = author.split(",");
        values.push({ name: splitted[0], surname: splitted[1] })
    }
    var query = utils.insertData("author", ["name", "surname"], values, " RETURNING id");
    const res = await getPool().query(query);
    const authorIds = new Map();
    values.map((key, index) => (authorIds.set(key.name + "," + key.surname, res.rows[index].id)));
    return authorIds;
}

async function insertCourses() {
    var values = [];
    for (course_name of courses) {
        values.push({ name: course_name })
    }
    var query = utils.insertData("course", ["name"], values, " RETURNING id");
    const res = await getPool().query(query);
    const courseIds = new Map();
    values.map((key, index) => (courseIds.set(key.name, res.rows[index].id)));
    return courseIds;
}

async function insertBookTypes() {
    var values = [];
    for (book_type of book_types) {
        values.push({ name: book_type })
    }
    var query = utils.insertData("booktype", ["name"], values, " RETURNING id");
    const res = await getPool().query(query);
    const bookTypeIds = new Map();
    values.map((key, index) => (bookTypeIds.set(key.name, res.rows[index].id)));
    return bookTypeIds;
}

async function insertUsers() {
    var values = [];
    for (user of parsedJSON.users) {
        var password_hash = crypto.encrypt(user.password);
        values.push({ name: user.name, surname: user.surname, 
            email: user.email, password_hash: password_hash,
            city: user.city, country: user.country })
    }
    var query = utils.insertData("appuser", ["name", "surname", "email", "password_hash", "city", "country"]
    , values, " RETURNING id");
    const res = await getPool().query(query);
    const userIds = new Map();
    values.map((key, index) => (userIds.set(key.email, res.rows[index].id)));
    return userIds;
}

async function insertBooks(bookTypeIds) {
    var values = [];
    for (book of parsedJSON.books) {
        var book_type_id = bookTypeIds.get(book.book_type);
        values.push({
            type_id: book_type_id, title: book.title, year: book.year, icbn_10: book.icbn_10,
            description: book.description, edition: book.edition
        })
    }
    var query = utils.insertData("book", ["type_id", "title", "year", "icbn_10", "description", "edition"], values, " RETURNING id");
    const res = await getPool().query(query);
    const bookIds = new Map();
    values.map((key, index) => (bookIds.set(key.title, res.rows[index].id)));
    return bookIds;
}

async function insertBookImage(bookIds, userIds) {
    var values = []
    for (book of parsedJSON.books) {
        var book_id = bookIds.get(book.title);
        for (user_email of book.user_email) {
            var user_id = userIds.get(user_email);
            values.push({ book_id: book_id, user_id: user_id, image: book.image_path.toString() })
        }
    }
    var query = utils.insertData("bookimage", ['book_id', 'user_id', 'image'], values);
    await getPool().query(query);
}

async function insertBookUsers(bookIds, userIds) {
    var values = []
    for (book of parsedJSON.books) {
        var book_id = bookIds.get(book.title);
        for (user_email of book.user_email) {
            var user_id = userIds.get(user_email);
            values.push({ book_id: book_id, user_id: user_id })
        }
    }
    var query = utils.insertData("userbook", ['book_id', 'user_id'], values);
    await getPool().query(query);
}

async function insertBookCourses(bookIds, courseIds) {
    var values = []
    for (book of parsedJSON.books) {
        var book_id = bookIds.get(book.title);
        var course_id = courseIds.get(book.course.name);
        values.push({ book_id: book_id, course_id: course_id })
    }
    var query = utils.insertData("bookcourse", ['book_id', 'course_id'], values);
    await getPool().query(query);
}

async function insertBookAuthors(bookIds, authorIds) {
    var values = []
    for (book of parsedJSON.books) {
        var book_id = bookIds.get(book.title);
        for (author of book.authors) {
            var author_id = authorIds.get(author.name + "," + author.surname);
            values.push({ book_id: book_id, author_id: author_id })
        }
    }
    var query = utils.insertData("bookauthor", ['book_id', 'author_id'], values);
    await getPool().query(query);
}

async function insertRequests(userIds, bookIds, statusIds) {
    var values = []
    for (swap of parsedJSON.requests) {
        var receiver_user_id = userIds.get(swap.receiver_user);
        var sender_user_id = userIds.get(swap.sender_user);
        var book_id = bookIds.get(swap.book_title);
        var status_id = statusIds.get(swap.status);
        values.push({
            receiver_user_id: receiver_user_id,
            sender_user_id: sender_user_id, book_id: book_id,
            status_id: status_id, request_date: swap.request_date,
            accept_date: swap.accept_date,
            reject_date: swap.reject_date
        })
    }
    var query = utils.insertData("request", ['receiver_user_id', 'sender_user_id',
        "book_id", "status_id", "request_date",
        "accept_date", "reject_date"], values);
    await getPool().query(query);
}

async function insertAllData() {
    console.log("starting to fill database ...");
    var statusIds = await insertStatus();
    var authorIds = await insertAuthors();
    var courseIds = await insertCourses();
    var bookTypeIds = await insertBookTypes();
    var userIds = await insertUsers();
    var bookIds = await insertBooks(bookTypeIds);
    await insertBookImage(bookIds, userIds);
    await insertBookUsers(bookIds, userIds);
    await insertBookCourses(bookIds, courseIds);
    await insertBookAuthors(bookIds, authorIds);
    await insertRequests(userIds, bookIds, statusIds);
}

async function main() {
    try {
        await flushDb();
        fillSubdata();
        await insertAllData();
    } catch (error) {
        console.error("Error in Top level await response:", error);
    }
}



module.exports = {
    main,
    flushDb,
}

