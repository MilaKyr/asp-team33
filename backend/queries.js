const crypto = require('./crypto');
const utils = require("./utils");
const { getPool } = require('./postgresql');


var AVAILABLE_FILTERS = ["course_id", "title", "author"];

var fullBookSelect = "SELECT appuser.id AS user_id, appuser.name, appuser.surname, \
book.id AS book_id, book.title, book.description, book.edition, book.icbn_10, \
author.name||' '||author.surname AS author, bookimage.image, course.name AS course";

var fullBookJoins = "LEFT JOIN userbook ON userbook.book_id = book.id \
LEFT JOIN appuser ON appuser.id = userbook.user_id \
LEFT JOIN bookauthor ON book.id = bookauthor.book_id \
LEFT JOIN author ON author.id = bookauthor.author_id \
LEFT JOIN bookimage ON bookimage.book_id = book.id AND bookimage.user_id  = appuser.id \
LEFT JOIN bookcourse ON bookcourse.book_id = book.id \
LEFT JOIN course ON course.id = bookcourse.course_id";

const bookShowcase = async (request, response) => {
    try {
        var statement = fullBookSelect + " FROM (SELECT * FROM book LIMIT 20) as book " + fullBookJoins;
        const results = await getPool().query(statement);
        var books = utils.combine_books_with_authors(results.rows);
        response.status(200).json(books);
    } catch (err) {
        console.error(err);
        return response.status(500).send();
    }
};


const Search = async (request, response) => {
    try {
        var allBooksStatement = fullBookSelect + " FROM book " + fullBookJoins;
        if (Object.keys(request.query).length === 0 && request.query.constructor === Object) {
            const results = await getPool().query(allBooksStatement);
            const books = utils.combine_books_with_authors(results.rows);
            return response.status(200).json(books);
        } else {
            let where_filter;
            var filter_by = Object.keys(request.query)[0];
            var params = [request.query[filter_by].toLowerCase()];
            if (!AVAILABLE_FILTERS.includes(filter_by)) {
                return response.status(404).send();
            }
            if (filter_by == "course_id") {
                where_filter = " WHERE course.id = $1";
            } else if (filter_by == "title") {
                where_filter = " WHERE LOWER(book.title) LIKE '%' || $1 || '%'";
            } else {
                where_filter = " WHERE LOWER(author.name) LIKE '%' || $1 || '%' OR LOWER(author.surname) LIKE '%' || $1 || '%'";
            }
            const results = await getPool().query(allBooksStatement + where_filter, params);
            var books = utils.combine_books_with_authors(results.rows);
            return response.status(200).json(books);
        }
    } catch (err) {
        console.error(err);
        return response.status(500).send();
    }
};

const SignIn = async (request, response) => {
    try {
        var { email, password } = request.body;
        var statement = "SELECT id, password_hash FROM appuser WHERE email = $1";
        const user = await getPool().query(statement, [email]);
        if (typeof user === "undefined" || user.rows.length == 0) {
            return response.status(401).send();
        }
        var splitted = user.rows[0].password_hash.split(",");
        var decrypted_password = crypto.decrypt(splitted[0], splitted[1], splitted[2]);
        if (password != decrypted_password) {
            return response.status(401).send();
        }
        // otherwise assign session'data
        var user_id = user.rows[0].id;
        request.session.loggedin = true;
        request.session.username = user_id;
        return response.status(200).json(user_id);
    } catch (err) {
        console.error(err);
        return response.status(500).send();
    }
};

const SignUp = async (request, response) => {
    try {
        var { email, password, name, surname } = request.body;
        var password_hash = crypto.encrypt(password);
        var statement = "INSERT INTO appuser (email, password_hash, name, surname) VALUES ($1, $2, $3, $4) RETURNING id";
        const user = await getPool().query(statement, [email, password_hash, name, surname]);
        var user_id = user.rows[0].id;
        request.session.loggedin = true;
        request.session.username = user_id;
        return response.status(200).json(user_id);
    } catch (err) {
        console.error(err);
        return response.status(500).send();
    }
};

const MyBook = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        var bookStatement = fullBookSelect + " FROM (SELECT * FROM book WHERE id = $1) AS book " + fullBookJoins;
        const book_id = request.params.id;
        const user_id = request.session.username;
        var statement = bookStatement + " WHERE bookimage.user_id = $2";
        const result = await getPool().query(statement, [book_id, user_id]);
        response.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return response.status(404).send();
    }
};

const insertBookModel = async (request) => {
    var { book_type_id, title, description, icbn_10, year, edition } = request.body;
    var statement = "WITH temp_table AS ( \
        INSERT INTO book (type_id, title, description, icbn_10, year, edition) VALUES ($1, $2, $3, $4, $5, $6) \
        ON CONFLICT DO NOTHING RETURNING id) \
        SELECT id FROM temp_table UNION ALL \
        SELECT id FROM book WHERE type_id = $1 AND title = $2 AND description = $3 \
            AND icbn_10 = $4 AND year = $5 AND edition = $6";
    const book = await getPool().query(statement, [book_type_id, title, description, icbn_10, year, edition]);
    return book.rows[0].id;
}

const insertAuthorModel = async (request, book_id) => {
    var { authors } = request.body;
    var values = [];
    var author_names = [];
    authors.map((author) => {
        author_names.push(author.name + "," + author.surname);
        values.push({ name: author.name, surname: author.surname });
    });

    var insert_query = utils.insert_data("author", ["name", "surname"], values, " ON CONFLICT DO NOTHING RETURNING id");
    const db_authors = await getPool().query("WITH temp_table AS ( " + insert_query + ") SELECT id FROM temp_table UNION ALL \
        SELECT id FROM (SELECT id, name||','||surname as full_name FROM author) \
        WHERE \"full_name\" =ANY($1::text[])", [author_names]);

    values = [];
    db_authors.rows.map((author_row) => {
        values.push({ book_id: book_id, author_id: author_row.id });
    });
    var insert_query = utils.insert_data("bookauthor", ["book_id", "author_id"], values, " ON CONFLICT DO NOTHING");
    await getPool().query(insert_query);
}

const addBook = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        var book_id = await insertBookModel(request);
        await getPool().query("INSERT INTO userbook (book_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [book_id, request.session.username]);
        var { course_id } = request.body;
        await getPool().query("INSERT INTO bookcourse (book_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [book_id, course_id]);
        await insertAuthorModel(request, book_id);
        response.status(200).json(book_id);
    } catch (err) {
        console.error(err);
        return response.status(404).send();
    }
}

const updateBook = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const book_id = request.params.id;
        var { book_type_id, title, description, icbn_10, year, edition,
            course_id, authors } = request.body;
        await getPool().query("UPDATE book SET title = $1, description = $2, icbn_10 = $3, \
        year = $4, edition = $5, type_id = $6 WHERE id = $7", [title, description, icbn_10, year, edition, book_type_id, book_id]);
        await getPool().query("UPDATE bookcourse SET course_id = $1 WHERE id = $2", [course_id, book_id]);
        var values = []
        for (author of authors) {
            values.push({ name: author.name, surname: author.surname });
        }
        var query = utils.insert_data("author", ["name", "surname"], values,
            " ON CONFLICT (name, surname) DO UPDATE SET name = EXCLUDED.name, surname = EXCLUDED.surname RETURNING id");
        const res = await getPool().query(query);
        const author_ids = values.map((_, index) => ({ book_id: parseInt(book_id), author_id: res.rows[index].id }));
        var query = utils.update_data("bookauthor", ["?book_id", "author_id"], author_ids, "book_id");
        await getPool().query(query);
        response.status(200).send();
    } catch (err) {
        console.error(err);
        return response.status(404).send();
    }
};

const Swaps = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const user_id = request.session.username;
        const statement = "SELECT request.*, status.name as status_name FROM request \
        LEFT JOIN status ON status.id = request.status_id \
        WHERE receiver_user_id = $1";
        const results = await getPool().query(statement, [user_id]);
        return response.status(200).json(results.rows);
    } catch (err) {
        console.error(err);
        return response.status(500).send();
    }
}

const ScheduleSwap = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        var { receiver_id, book_id } = request.body;
        const user_id = request.session.username;
        const now = new Date(Date.now()).toISOString();
        const status = await getPool().query("SELECT id FROM status WHERE name = 'pending'");
        const status_id = status.rows[0].id;
        const statement = "INSERT INTO request (receiver_user_id, sender_user_id, book_id, status_id, request_date) \
         VALUES ($1, $2, $3, $4, $5)";
        await getPool().query(statement, [receiver_id, user_id, book_id, status_id, now]);
        return response.status(200).send();
    } catch (err) {
        console.error(err);
        return response.status(404).send();
    }
}

const DeleteBook = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const statement = 'DELETE FROM userbook WHERE user_id = $1 AND book_id = $2';
        const book_id = parseInt(request.params.id);
        const user_id = request.session.username;
        await getPool().query(statement, [user_id, book_id]);
        return response.status(200).send();
    } catch (err) {
        console.error(err);
        return response.status(404).send();
    }
};

const DeleteSwap = async (request, response,) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const swap_id = parseInt(request.params.id);
        const statement = 'DELETE FROM request WHERE id = $1';
        await getPool().query(statement, [swap_id]);
        return response.status(200).send();
    } catch (err) {
        console.error(err);
        return response.status(404).send();
    }
}

const addImage = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    if (!request.file) {
        return response.status(400).send();
    }
    try {
        const statement = 'INSERT INTO bookimage (user_id, book_id, image) VALUES ($1, $2, $3 )';
        const book_id = parseInt(request.params.id);
        const user_id = request.session.username;
        await getPool().query(statement, [user_id, book_id, request.file.buffer]);
        return response.status(201).send();
    } catch (err) {
        console.error(err);
        return response.status(404).send();
    }
}

const UpdateSwap = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const swap_id = request.params.id;
        var { status_id } = request.body;
        var status = await getPool().query("SELECT name FROM status WHERE id = $1", [status_id]);
        if (typeof status === 'undefined' || status.rows.length == 0) {
            return response.status(404).send();
        }
        const status_name = status.rows[0].name;
        const datefield = status_name == "accepted" ? "accept_date" : "reject_date";
        const now = new Date(Date.now()).toISOString();
        const statement = "UPDATE request SET status_id = $1, " + datefield + " = $2 WHERE id = $3 RETURNING receiver_user_id, book_id";
        try {
            let result = await getPool().query(statement, [status_id, now, swap_id]);
            if (status_name == 'accepted') {
                var receiver_user_id = result.rows[0].receiver_user_id;
                var sender = await getPool().query("SELECT name, email FROM appuser WHERE id = $1", [receiver_user_id]);
                var book_id = result.rows[0].book_id;
                var bookStatement = fullBookSelect + "FROM (SELECT * FROM book WHERE id = $1) AS book " + fullBookJoins;
                var book = await getPool().query(bookStatement, [book_id]);
                book = utils.combine_books_with_authors(book.rows);
                await utils.send_email(sender.rows[0], book);
            }
            return response.status(200).send();
        } catch (err) {
            console.error(err);
            return response.status(404).send();
        }
    } catch (err) {
        console.error(err);
        return response.status(500).send();
    }
}

module.exports = {
    bookShowcase,
    Search,
    MyBook,
    addBook,
    updateBook,
    SignIn,
    SignUp,
    DeleteBook,
    Swaps,
    DeleteSwap,
    ScheduleSwap,
    addImage,
    UpdateSwap,
};