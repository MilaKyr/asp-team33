const crypto = require('./crypto');

const Pool = require('pg').Pool;
const utils = require("./utils");

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
});

var AVAILABLE_FILTERS = ["course_id", "title", "author"];

var fullBookStatement = "SELECT appuser.id AS user_id, appuser.name, appuser.surname, \
book.id AS book_id, book.title, book.description, book.edition, book.icbn_10, \
author.name||' '||author.surname AS author, bookimage.image, course.name AS course \
FROM userbook LEFT JOIN appuser ON appuser.id=userbook.user_id \
LEFT JOIN book ON userbook.book_id = book.id \
LEFT JOIN bookauthor ON book.id = bookauthor.book_id \
LEFT JOIN author ON author.id = bookauthor.author_id \
LEFT JOIN bookimage ON bookimage.book_id = book.id AND bookimage.user_id  = appuser.id \
LEFT JOIN bookcourse ON bookcourse.book_id = book.id \
LEFT JOIN course ON course.id = bookcourse.course_id";

const bookShowcase = async (request, response) => {
    try {
        var statement = fullBookStatement + " LIMIT 20";
        const results = await pool.query(statement);
        var books = utils.combine_books_with_authors(results.rows);
        response.status(200).json(books);
    } catch (err) {
        console.error(err);
        response.status(500).send();
    }
};


const Search = async (request, response) => {
    try {
        if (Object.keys(request.query).length === 0 && request.query.constructor === Object) {
            const results = await pool.query(fullBookStatement)
            const books = utils.combine_books_with_authors(results.rows);
            return response.status(200).json(books);
        } else {
            let statement;
            var filter_by = Object.keys(request.query)[0];
            var params = [request.query[filter_by].toLowerCase()];
            if (!AVAILABLE_FILTERS.includes(filter_by)) {
                return response.status(404).send();
            }
            if (filter_by == "course_id") {
                statement = " WHERE course.id = $1";
            } else if (filter_by == "title") {
                statement = " WHERE LOWER(book.title) LIKE '%' || $1 || '%'";
            } else {
                statement = " WHERE LOWER(author.name) LIKE '%' || $1 || '%' OR LOWER(author.surname) LIKE '%' || $1 || '%'";
            }
            const results = await pool.query(fullBookStatement + statement, params);
            var books = utils.combine_books_with_authors(results.rows);
            return response.status(200).json(books);
        }
    } catch (err) {
        console.error(err);
        response.status(500).send();
    }
};

const SignIn = async (request, response) => {
    try {
        var { email, password } = request.body;
        var statement = "SELECT id, password_hash FROM appuser WHERE email = $1";
        const user = await pool.query(statement, [email]);
        if (typeof user === "undefined") {
            return response.status(404).send();
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
        response.status(500).send();
    }
};

const SignUp = async (request, response) => {
    try {
        var { email, password, name, surname } = request.body;
        var password_hash = crypto.encrypt(password);
        var statement = "INSERT INTO appuser (email, password_hash, name, surname) VALUES ($1, $2, $3, $4) RETURNING id";
        const user = await pool.query(statement, [email, password_hash, name, surname]);
        var user_id = user.rows[0].id;
        request.session.loggedin = true;
        request.session.username = user_id;
        return response.status(200).json(user_id);
    } catch (err) {
        console.error(err);
        response.status(500).send();
    }
};

const MyBook = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const book_id = request.params.id;
        const user_id = request.session.username;
        var statement = "SELECT book.*, booktype.name as book_type_name FROM userbook \
        LEFT JOIN book ON userbook.book_id = book.id \
        LEFT JOIN booktype ON booktype.id = book.type_id \
        WHERE user_id = $1 AND book_id = $2";
        const result = await pool.query(statement, [user_id, book_id]);
        response.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        response.status(500).send();
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
    const book = await pool.query(statement, [book_type_id, title, description, icbn_10, year, edition]);
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
    const db_authors = await pool.query("WITH temp_table AS ( " + insert_query + ") SELECT id FROM temp_table UNION ALL \
        SELECT id FROM (SELECT id, name||' '||surname as full_name FROM author) \
        WHERE \"full_name\" =ANY($1::text[])", [author_names]);

    values = [];
    db_authors.rows.map((author_row) => {
        values.push({ book_id: book_id, author_id: author_row.id });
    });
    var insert_query = utils.insert_data("bookauthor", ["book_id", "author_id"], values, " ON CONFLICT DO NOTHING");
    await pool.query(insert_query);
}

const addBook = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        var book_id = await insertBookModel(request);
        await pool.query("INSERT INTO userbook (book_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [book_id, request.session.username]);
        var { course_id } = request.body;
        await pool.query("INSERT INTO bookcourse (book_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [book_id, course_id]);
        await insertAuthorModel(request, book_id);
        response.status(200).json(book_id);
    } catch (err) {
        console.error(err);
        response.status(500).send();
    }
}

const updateBook = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const book_id = request.params.id;
        var { book_type_id, title, description, icbn_10, year, edition,
            course_id, authors } = request.body;
        await pool.query("UPDATE book SET title = $1, description = $2, icbn_10 = $3, \
        year = $4, edition = $5, type_id = $6 WHERE id = $7", [title, description, icbn_10, year, edition, book_type_id, book_id]);
        await pool.query("UPDATE bookcourse SET course_id = $1 WHERE id = $2", [course_id, book_id]);
        var values = []
        for (author of authors) {
            values.push({ name: author.name, surname: author.surname });
        }
        var query = utils.insert_data("author", ["name", "surname"], values,
            " ON CONFLICT (name, surname) DO UPDATE SET name = EXCLUDED.name, surname = EXCLUDED.surname RETURNING id");
        const res = await pool.query(query);
        const author_ids = values.map((index) => ({ book_id: book_id, author_id: res.rows[index].id }));

        var query = utils.insert_data("bookauthor", ["book_id", "author_id"], author_ids, " ON CONFLICT DO NOTHING");
        await pool.query(query);
        response.status(200).send();
    } catch (err) {
        console.error(err);
        response.status(500).send();
    }
};

const Swaps = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const user_id = request.session.username;
        const statement = "SELECT request.*, status.name as status_name FROM request \
        LEFT JOIN status ON status.id = request.status_id \
        WHERE receiver_user_id = $1 AND status.name = 'pending'";
        const results = await pool.query(statement, [user_id]);
        return response.status(200).json(results.rows);
    } catch (err) {
        console.error(err);
        response.status(500).send();
    }
}

const ScheduleSwap = async (request, response) => {
    response.status(200).json('TODO');

}

const DeleteBook = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const statement = 'DELETE FROM userbook WHERE user_id = $1 AND book_id = $2';
        const book_id = parseInt(request.params.id);
        const user_id = request.session.username;
        await pool.query(statement, [user_id, book_id]);
        response.status(200).send();
    } catch (err) {
        console.error(err);
        response.status(500).send();
    }
};

const DeleteSwap = async (request, response,) => {
    if (!request.session.loggedin) return response.status(401).send();
    try {
        const swap_id = parseInt(request.params.id);
        const statement = 'DELETE FROM request WHERE id = $1';
        await pool.query(statement, [swap_id]);
        response.status(200).send();
    } catch (err) {
        console.error(err);
        response.status(500).send();
    }
}

const addImage = async (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    response.status(200).json('TODO');
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
};