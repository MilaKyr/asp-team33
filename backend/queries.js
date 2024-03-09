const crypto = require('./crypto');
const { matchedData, validationResult } = require('express-validator');
const jwt = require('./jwt');
const utils = require("./utils");
const { getPool } = require('./postgresql');
const config = require('./config');
const sharp = require('sharp');


var fullBookSelect = "SELECT appuser.id AS user_id, appuser.name, appuser.surname, \
appuser.city, appuser.country, \
book.id AS book_id, book.title, book.description, book.edition, book.isbn_10, book.year, \
booktype.id as book_type_id, booktype.name as book_type, \
author.name||' '||author.surname AS author, course.id AS course_id, course.name AS course ";

var fullBookJoins = " LEFT JOIN userbook ON userbook.book_id = book.id \
LEFT JOIN appuser ON appuser.id = userbook.user_id \
LEFT JOIN bookauthor ON book.id = bookauthor.book_id \
LEFT JOIN author ON author.id = bookauthor.author_id \
LEFT JOIN bookcourse ON bookcourse.book_id = book.id \
LEFT JOIN booktype ON booktype.id = book.type_id \
LEFT JOIN course ON course.id = bookcourse.course_id";

var swapsSelect = "SELECT request.*, status.name as status_name, \
sender.name as sender_name, sender.surname as sender_surname, \
sender.city as sender_city,  sender.country as sender_country, \
receiver.name as receiver_name, receiver.surname as receiver_surname,  \
receiver.city as receiver_city,  receiver.country as receiver_country \
FROM request \
LEFT JOIN status ON status.id = request.status_id \
LEFT JOIN appuser as sender ON sender.id = request.sender_user_id \
LEFT JOIN appuser as receiver ON receiver.id = request.receiver_user_id ";

const generateToken = (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
        return response.status(404).send();
    }
    const data = matchedData(request);
    if (data.user == config.jwt.reactNativeUser && data.password == config.jwt.reactNativePassword) {
        const token = jwt.generateJWToken();
        return response.status(200).json({accessToken: token});
    }
    return response.status(401).send();
}


const bookShowcase = async (request, response) => {
    console.log('books')
    const token = request.header(config.jwt.tokenHeaderKey);
    if (!token) {
        return response.status(401).send();
    }
    var verified = jwt.validateJWToken(token);
    if (!verified.success) {
        return response.status(403).send(verified.error);
    }
    try {
        var statement = fullBookSelect + " FROM (SELECT * FROM book LIMIT 20) as book " + fullBookJoins;
        const results = await getPool().query(statement);
        var books = utils.combineBooksWithAuthors(results.rows);
        response.status(200).json(books);
    } catch (err) {
        return response.status(500).send(err);
    }
};


const search = async (request, response) => {
    const token = request.header(config.jwt.tokenHeaderKey);
    if (!token) {
        return response.status(401).send();
    }
    var verified = jwt.validateJWToken(token);
    if (!verified.success) {
        return response.status(403).send(verified.error);
    }
    try {
        const result = validationResult(request);
        if (!result.isEmpty()) {
            return response.status(404).send();
        }
        const data = matchedData(request);
        var allBooksStatement = fullBookSelect + " FROM book " + fullBookJoins;
        if (Object.keys(data).length === 0 && data.constructor === Object) {
            const results = await getPool().query(allBooksStatement);
            const books = utils.combineBooksWithAuthors(results.rows);
            return response.status(200).json(books);
        } else {
            let where_filter;
            let filter_by = Object.keys(data)[0].toLowerCase();
            var params = [data[filter_by].toLowerCase()];
            if (filter_by == "course_id") {
                where_filter = " WHERE course.id = $1";
            } else if (filter_by == "title") {
                where_filter = " WHERE LOWER(book.title) LIKE '%' || $1 || '%'";
            } else if (filter_by == "location") {
                where_filter = " WHERE LOWER(appuser.city) LIKE '%' || $1 || '%' OR LOWER(appuser.country) LIKE '%' || $1 || '%'";
            } else {
                where_filter = " WHERE LOWER(author.name) LIKE '%' || $1 || '%' OR LOWER(author.surname) LIKE '%' || $1 || '%'";
            }
            const results = await getPool().query(allBooksStatement + where_filter, params);
            var books = utils.combineBooksWithAuthors(results.rows);
            return response.status(200).json(books);
        }
    } catch (err) {
        return response.status(500).send(err);
    }
};

const signIn = async (request, response) => {
    const token = request.header(config.jwt.tokenHeaderKey);
    if (!token) {
        return response.status(401).send();
    }
    var verified = jwt.validateJWToken(token);
    if (!verified.success) {
        return response.status(403).send(verified.error);
    }
    try {
        const result = validationResult(request);
        if (!result.isEmpty()) {
            return response.status(404).send();
        }
        const data = matchedData(request);
        var statement = "SELECT id, password_hash FROM appuser WHERE email = $1";
        const user = await getPool().query(statement, [data.email]);
        if (typeof user === "undefined" || user.rows.length == 0) {
            return response.status(404).send();
        }
        var splitted = user.rows[0].password_hash.split(",");
        var decrypted_password = crypto.decrypt(splitted[0], splitted[1], splitted[2]);
        if (data.password != decrypted_password) {
            return response.status(404).send();
        }
        // otherwise assign session'data
        var user_id = user.rows[0].id;
        request.session.loggedin = true;
        request.session.username = user_id;
        return response.status(200).json(user_id);
    } catch (err) {
        return response.status(500).send(err);
    }
};

const signUp = async (request, response) => {
    const token = request.header(config.jwt.tokenHeaderKey);
    if (!token) {
        return response.status(401).send();
    }
    var verified = jwt.validateJWToken(token);
    if (!verified.success) {
        return response.status(403).send(verified.error);
    }
    try {
        const result = validationResult(request);
        if (!result.isEmpty()) {
            console.log('is this where it happene', result.array())
            return response.status(404).send();
        }
        const data = matchedData(request);
        var password_hash = crypto.encrypt(data.password);
        var statement = "INSERT INTO appuser (email, password_hash, name, surname, city, country) \
                        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
        const user = await getPool().query(statement, 
                        [data.email, password_hash, data.name, data.surname, data.city, data.country]);
        var user_id = user.rows[0].id;
        request.session.loggedin = true;
        request.session.username = user_id;
        return response.status(200).json(user_id);
    } catch (err) {
        return response.status(500).send(err);
    }
};

const myBooks = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const user_id = request.session.username;
        var statement = fullBookSelect + 
        " FROM (SELECT book_id, user_id FROM userbook WHERE user_id = $1) as user_books \
        LEFT JOIN book ON book.id = user_books.book_id " + fullBookJoins;
        const result = await getPool().query(statement, [user_id]);
        var books = utils.combineBooksWithAuthors(result.rows)
        response.status(200).json(books);
    } catch (err) {
        return response.status(500).send(err);
    }
};

const myBook = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const validation = validationResult(request);
        if (!validation.isEmpty()) {
            return response.status(404).send();
        }
        const data = matchedData(request);
        var statement = fullBookSelect + " FROM (SELECT * FROM book WHERE id = $1) AS book " + fullBookJoins;
        const result = await getPool().query(statement, [data.id]);
        var book = utils.combineBooksWithAuthors(result.rows)[0];
        response.status(200).json(book);
    } catch (err) {
        return response.status(500).send(err);
    }
};

const insertBookModel = async (client, data) => {
    var statement = "WITH temp_table AS ( \
        INSERT INTO book (type_id, title, description, isbn_10, year, edition) VALUES ($1, $2, $3, $4, $5, $6) \
        ON CONFLICT DO NOTHING RETURNING id) \
        SELECT id FROM temp_table UNION ALL \
        SELECT id FROM book WHERE type_id = $1 AND title = $2 AND description = $3 \
            AND isbn_10 = $4 AND year = $5 AND edition = $6";
    const book = await client.query(statement, 
                [data.book_type_id, data.title, data.description, data.isbn_10, data.year, data.edition]);
    return book.rows[0].id;
}

const insertAuthorModel = async (client, data, book_id) => {
    var values = [];
    var author_names = [];
    data.authors.map((author) => {
        author_names.push(author.name + "," + author.surname);
        values.push({ name: author.name, surname: author.surname });
    });

    var insert_query = utils.insertData("author", ["name", "surname"], values, " ON CONFLICT DO NOTHING RETURNING id");
    const db_authors = await client.query("WITH temp_table AS ( " + insert_query + ") SELECT id FROM temp_table UNION ALL \
        SELECT id FROM (SELECT id, name||','||surname as full_name FROM author) \
        WHERE \"full_name\" =ANY($1::text[])", [author_names]);

    values = [];
    db_authors.rows.map((author_row) => {
        values.push({ book_id: book_id, author_id: author_row.id });
    });
    var insert_query = utils.insertData("bookauthor", ["book_id", "author_id"], values, " ON CONFLICT DO NOTHING");
    await client.query(insert_query);
}

const addBook = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const validation = validationResult(request);
        if (!validation.isEmpty()) {
            return response.status(404).send();
        }
        const data = matchedData(request);
        const client = getPool();
        await client.query('BEGIN');
        var book_id = await insertBookModel(client, data);
        await client.query("INSERT INTO userbook (book_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [book_id, request.session.username]);
        await client.query("INSERT INTO bookcourse (book_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [book_id, data.course_id]);
        await insertAuthorModel(client, data, book_id);
        await client.query('COMMIT');
        response.status(200).json(book_id);
    } catch (err) {
        await client.query('ROLLBACK');
        return response.status(500).send(err);
    }
}

const updateBook = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const validation = validationResult(request);
        if (!validation.isEmpty()) {
            return response.status(404).send();
        }
        const data = matchedData(request);
        const client = getPool();
        await client.query('BEGIN');
        await client.query("UPDATE book SET title = $1, description = $2, isbn_10 = $3, \
        year = $4, edition = $5, type_id = $6 WHERE id = $7", 
        [data.title, data.description, data.isbn_10, data.year, data.edition, data.book_type_id, data.id]);
        await client.query("UPDATE bookcourse SET course_id = $1 WHERE book_id = $2", [data.course_id, data.id]);
        var values = []
        for (author of data.authors) {
            values.push({ name: author.name, surname: author.surname });
        }
        var query = utils.insertData("author", ["name", "surname"], values,
            " ON CONFLICT (name, surname) DO UPDATE SET name = EXCLUDED.name, surname = EXCLUDED.surname RETURNING id");
        const res = await client.query(query);
        await client.query("DELETE FROM bookauthor where book_id = $1", [data.id]);
        const author_ids = values.map((_, index) => ({ book_id: parseInt(data.id), author_id: res.rows[index].id }));
        var query = utils.insertData("bookauthor", ["book_id", "author_id"], author_ids);
        await client.query(query);
        await client.query('COMMIT');
        response.status(200).send();
    } catch (err) {
        await client.query('ROLLBACK');
        return response.status(404).send(err);
    }
};

const swaps = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const user_id = request.session.username;
        const statement = swapsSelect + " WHERE receiver_user_id = $1";
        const results = await getPool().query(statement, [user_id]);
        return response.status(200).json(results.rows);
    } catch (err) {
        return response.status(500).send(err);
    }
}

const scheduleSwap = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const validation = validationResult(request);
        if (!validation.isEmpty()) {
            return response.status(404).send();
        }
        const data = matchedData(request);
        const user_id = request.session.username;
        const now = new Date(Date.now()).toISOString();
        const status = await getPool().query("SELECT id FROM status WHERE name = 'pending'");
        const status_id = status.rows[0].id;
        const statement = "INSERT INTO request (receiver_user_id, sender_user_id, book_id, status_id, request_date) \
         VALUES ($1, $2, $3, $4, $5) RETURNING id";
        let result = await getPool().query(statement, [data.receiver_id, user_id, data.book_id, status_id, now]);
        return response.status(200).json(result.rows[0].id);
    } catch (err) {
        return response.status(404).send(err);
    }
}

const deleteBook = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const validation = validationResult(request);
        if (!validation.isEmpty()) {
            return response.status(404).send();
        }
        const data = matchedData(request);
        const statement = 'DELETE FROM userbook WHERE user_id = $1 AND book_id = $2';
        const user_id = request.session.username;
        await getPool().query(statement, [user_id, data.id]);
        return response.status(200).send();
    } catch (err) {
        return response.status(404).send(err);
    }
};

const deleteSwap = async (request, response,) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const validation = validationResult(request);
        if (!validation.isEmpty()) {
            return response.status(404).send();
        }
        const data = matchedData(request);
        const statement = 'DELETE FROM request WHERE id = $1';
        await getPool().query(statement, [data.id]);
        return response.status(200).send();
    } catch (err) {
        return response.status(404).send(err);
    }
}

const addImage = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    if (!request.file) {
        return response.status(400).send();
    }
    try {
        const validation = validationResult(request);
        if (!validation.isEmpty()) {
            return response.status(404).send();
        }
        const data = matchedData(request);
        const statement = 'INSERT INTO bookimage (user_id, book_id, image) VALUES ($1, $2, $3 )\
        ON CONFLICT (user_id, book_id) \
        DO UPDATE SET image = $3';
        const user_id = request.session.username;
        const resizedBuffer = await sharp(request.file.buffer)
            .resize(config.imageResize.height, config.imageResize.width, { fit: config.imageResize.fit })
            .toBuffer()
            .then(function (outputBuffer) { return outputBuffer.toString('base64') });
        await getPool().query(statement, [user_id, data.id, resizedBuffer]);
        return response.status(201).send();
    } catch (err) {
        return response.status(500).send(err);
    }
}

const getImage = async (request, response) => {
    const token = request.header(config.jwt.tokenHeaderKey);
    if (!token) {
        return response.status(401).send();
    }
    var verified = jwt.validateJWToken(token);
    if (!verified.success) {
        return response.status(403).send(verified.error);
    }
    try {
        const validation = validationResult(request);

        if (!validation.isEmpty()) {
            return response.status(404).send();
        }
        const data = matchedData(request);
        const statement = 'SELECT image FROM bookimage WHERE book_id = $1 AND user_id  = $2';
        const res = await getPool().query(statement, [data.book_id, data.user_id]);
        var encodedBuffer = res.rows[0].image;
        return response.status(200).json(encodedBuffer);
    } catch (err) {
        return response.status(404).send();
    }
}

const updateSwap = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const validation = validationResult(request);
        if (!validation.isEmpty()) {
            return response.status(404).send();
        }
        const data = matchedData(request);
        var status = await getPool().query("SELECT name FROM status WHERE id = $1", [data.status_id]);
        if (typeof status === 'undefined' || status.rows.length == 0) {
            return response.status(404).send();
        }
        const status_name = status.rows[0].name;
        const datefield = status_name == "accepted" ? "accept_date" : "reject_date";
        const now = new Date(Date.now()).toISOString();
        const statement = "UPDATE request SET status_id = $1, " + datefield + " = $2 WHERE id = $3 RETURNING receiver_user_id, book_id";
        let result = await getPool().query(statement, [data.status_id, now, data.id]);
        if (status_name == 'accepted') {
            var receiver_user_id = result.rows[0].receiver_user_id;
            var sender = await getPool().query("SELECT name, email FROM appuser WHERE id = $1", [receiver_user_id]);
            var book_id = result.rows[0].book_id;
            var bookStatement = fullBookSelect + "FROM (SELECT * FROM book WHERE id = $1) AS book " + fullBookJoins;
            var book = await getPool().query(bookStatement, [book_id]);
            book = utils.combineBooksWithAuthors(book.rows);
            await utils.sendEmail(sender.rows[0], book);
        }
        return response.status(200).send();
    } catch (err) {
        return response.status(500).send();
    }
}

const locations = async (request, response) => {
    const token = request.header(config.jwt.tokenHeaderKey);
    if (!token) {
        return response.status(401).send();
    }
    var verified = jwt.validateJWToken(token);
    if (!verified.success) {
        return response.status(403).send(verified.error);
    }
    try {
        var statement = "SELECT city, country FROM appuser GROUP BY city, country";
        const results = await getPool().query(statement);
        return response.status(200).json(results.rows);
    } catch (err) {
        return response.status(500).send();
    }
}

const courses = async (request, response) => {
    const token = request.header(config.jwt.tokenHeaderKey);
    if (!token) {
        return response.status(401).send();
    }
    var verified = jwt.validateJWToken(token);
    if (!verified.success) {
        return response.status(403).send(verified.error);
    }
    try {
        var statement = "SELECT DISTINCT id, name FROM course";
        const results = await getPool().query(statement);
        return response.status(200).json(results.rows);
    } catch (err) {
        return response.status(500).send();
    }
}

const bookTypes = async (request, response) => {
    const token = request.header(config.jwt.tokenHeaderKey);
    if (!token) {
        return response.status(401).send();
    }
    var verified = jwt.validateJWToken(token);
    if (!verified.success) {
        return response.status(403).send(verified.error);
    }
    try {
        var statement = "SELECT DISTINCT id, name FROM booktype";
        const results = await getPool().query(statement);
        return response.status(200).json(results.rows);
    } catch (err) {
        return response.status(500).send();
    }
}

const requestStatuses = async (request, response) => {
    const token = request.header(config.jwt.tokenHeaderKey);
    if (!token) {
        return response.status(401).send();
    }
    var verified = jwt.validateJWToken(token);
    if (!verified.success) {
        return response.status(403).send(verified.error);
    }
    try {
        var statement = "SELECT DISTINCT id, name FROM status";
        const results = await getPool().query(statement);
        return response.status(200).json(results.rows);
    } catch (err) {
        return response.status(500).send();
    }
}

const sentSwaps = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const user_id = request.session.username;
        const statement = swapsSelect + " WHERE sender_user_id = $1";
        const results = await getPool().query(statement, [user_id]);
        return response.status(200).json(results.rows);
    } catch (err) {
        return response.status(500).send();
    }
}

const mySwap = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const validation = validationResult(request);
        if (!validation.isEmpty()) {
            return response.status(404).send();
        }
        const data = matchedData(request);
        const statement = swapsSelect + " WHERE request.id = $1";
        const results = await getPool().query(statement, [data.id]);
        return response.status(200).json(results.rows[0]);
    } catch (err) {
        return response.status(500).send();
    }
}


module.exports = {
    bookShowcase,
    search,
    myBook,
    addBook,
    updateBook,
    signIn,
    signUp,
    deleteBook,
    swaps,
    deleteSwap,
    scheduleSwap,
    addImage,
    updateSwap,
    myBooks,
    locations,
    courses,
    bookTypes,
    getImage,
    requestStatuses,
    sentSwaps,
    mySwap,
    generateToken,
};