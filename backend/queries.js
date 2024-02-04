const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
});

const bookShowcase = (request, response, next) => {
    pool.query("SELECT appuser.id as user_id, appuser.name, appuser.surname,\
                    book.id as book_id, book.title, book.description, book.edition, book.icbn_10, \
                    author.name||' '||author.surname as author, bookimage.image \
                    FROM userbook LEFT JOIN appuser ON appuser.id=userbook.user_id \
                    LEFT JOIN book ON userbook.book_id = book.id \
                    LEFT JOIN bookauthor ON book.id = bookauthor.book_id \
                    LEFT JOIN author ON author.id = bookauthor.author_id \
                    LEFT JOIN bookimage ON bookimage.book_id = book.id AND bookimage.user_id  = appuser.id", (err, results) => {
        if (err) next(err);
        var books = []
        var seen_ids = []
        for (var i = 0; i < results.rows.length; i++) {
            var row = results.rows[i];
            if (seen_ids.includes(row.book_id)) {
                var selected = books.filter(obj => {
                    return obj.book_id === row.book_id
                })[0];
                selected.authors.push(row.author);
            } else {
                seen_ids.push(row.book_id);
                row["authors"] = [row.author];
                delete row.author;
                books.push(row);
            }
        }
        response.status(200).json(books);
    });
};


const search = (request, response, next) => {
    response.status(200).json('TODO');
};

const SignIn = (request, response, next) => {
    var { email, password } = request.body;
    // var password_hash = crypto.encrypt(password);
    pool.query("SELECT id FROM appuser \
                WHERE email = $1 AND password_hash = $2", [email, password], (err, user) => {
        if (err) next(err);
        if (typeof user === "undefined") {
            return response.status(404).send();
        }
        // otherwise assign session'data
        var user_id = user.rows[0].id
        request.session.loggedin = true;
        request.session.username = user_id;
        return response.status(200).json(user_id);
    });
};

const SignUp = (request, response, next) => {
    var { email, password, name, surname } = request.body;
    console.log(request.body);
    // var password_hash = crypto.encrypt(password);
    pool.query("INSERT INTO appuser (email, password_hash, name, surname) \
                VALUES ($1, $2, $3, $4) RETURNING *", [email, password, name, surname], (err, user) => {
        if (err) next(err);
        var user_id = user.rows[0].id
        request.session.loggedin = true;
        request.session.username = user_id;
        return response.status(200).json(user_id);
    });
};



const MyBook = (request, response, next) => {
    if (!request.session.loggedin) return response.status(401).send();
    const book_id = parseInt(request.params.id);
    const user_id = request.session.username;
    pool.query("SELECT book.*, booktype.name as book_type_name \
                FROM userbook \
                LEFT JOIN book ON userbook.book_id = book.id \
                LEFT JOIN booktype ON booktype.id = book.type_id \
                WHERE user_id = $1 AND book_id = $2", [user_id, book_id], (err, result) => {
        if (err) next(err);
        response.status(200).json(result.rows[0]);
    });
};

const addBook = (request, response, next) => {
    if (!request.session.loggedin) return response.status(401).send();
    var {book_type_id, title, description, icbn_10, year, edition, course_id} = req.body;
    pool.query("WITH temp_table AS ( \
            INSERT INTO book (book_type_id, title, description, icbn_10, year, edition) VALUES ($1, $2, $3, $4, $5, $6) \
            ON CONFLICT DO NOTHING RETURNING id) \
            SELECT id FROM temp_table UNION ALL \
            SELECT id FROM book WHERE book_type_id = $1 AND title = $2 AND description = $3 AND icbn_10 = $4 AND year = $5 AND edition = $6",
        [book_type_id, title, description, icbn_10, year, edition],
        (err, result) => {
            if (err) next(err);
            book_id = result.rows[0].id;
            pool.query("INSERT INTO userbook (book_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                [book_id, request.session.username],
                (err, _) => {
                    if (err) next(err);
                    // TODO insert authors and course info
                    response.status(201).send(book_id);
            });
    });
}

const Swaps = (request, response, next) => {
    if (!request.session.loggedin) return response.status(401).send();
    const user_id = request.session.username;
    pool.query("SELECT request.*, status.name as status_name FROM request \
                LEFT JOIN status ON status.id = request.status_id \
                WHERE receiver_user_id = $1 AND status.name = 'pending'",
        [user_id], (err, results) => {
            console.log(err);
            if (err) next(err);
            response.status(200).json(results.rows);
        });
}

const ScheduleSwap = (request, response, next) => {
    response.status(200).json('TODO');

}
const updateBook = (request, response, next) => {
    if (!request.session.loggedin) return response.status(401).send();
    const book_id = parseInt(request.params.id);
    const { title, authors, year, description, edition, icbn_10, book_type } = request.body;

    response.status(200).json('TODO')
};

const DeleteBook = (request, response, next) => {
    if (!request.session.loggedin) return response.status(401).send();
    const book_id = parseInt(request.params.id);
    const user_id = request.session.username;
    pool.query('DELETE FROM userbook WHERE user_id = $1 AND book_id = $2',
        [user_id, book_id], (err, _) => {
            if (err) next(err);
            response.status(200).send();
        });
};

const DeleteSwap = (request, response, next) => {
    const swap_id = parseInt(request.params.id);
    pool.query('DELETE FROM request WHERE id = $1', [swap_id], (err, _) => {
        if (err) next(err);
        response.status(200).send();
    });
}


module.exports = {
    bookShowcase,
    search,
    MyBook,
    addBook,
    updateBook,
    SignIn,
    SignUp,
    DeleteBook,
    Swaps,
    DeleteSwap,
    ScheduleSwap,
};