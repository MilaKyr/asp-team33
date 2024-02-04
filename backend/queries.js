const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
});

const bookShowcase = (request, response) => {
    pool.query("SELECT appuser.id as user_id, appuser.name, appuser.surname,\
                    book.id as book_id, book.title, book.description, book.edition, book.icbn_10, \
                    author.name||' '||author.surname as author, bookimage.image \
                    FROM userbook LEFT JOIN appuser ON appuser.id=userbook.user_id \
                    LEFT JOIN book ON userbook.book_id = book.id \
                    LEFT JOIN bookauthor ON book.id = bookauthor.book_id \
                    LEFT JOIN author ON author.id = bookauthor.author_id \
                    LEFT JOIN bookimage ON bookimage.book_id = book.id AND bookimage.user_id  = appuser.id", (error, results) => {
        if (error) {
            throw error;
        }
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


const search = (request, response) => {
    response.status(200).json('TODO');
};

const SignIn = (request, response) => {
    var { email, password_hash } = request.body;
    // var password_hash = crypto.encrypt(password);
    pool.query("SELECT id FROM appuser \
                WHERE email = $1 AND password_hash = $2", [email, password_hash], (error, user) => {
        if (error) {
            throw error;
        }
        if (typeof user === "undefined") {
            return response.status(404).send();
        }
        // otherwise assign session'data
        var user_id = user[0].id
        request.session.loggedin = true;
        request.session.username = user_id;
        // redirect to author's home page
        return response.status(200).json(user_id);
    });
};

const SignUp = (request, response) => {
    var { email, password_hash, name, surname } = request.body;
    // var password_hash = crypto.encrypt(password);
    pool.query("INSERT INTO appuser (email, password, name, surname) \
                VALUES ($1, $2, $3, $4) RETURNING *", [email, password_hash, name, surname], (error, user) => {
        if (error) {
            throw error;
        }
        var user_id = user[0].id
        request.session.loggedin = true;
        request.session.username = user_id;
        // redirect to author's home page
        return response.status(200).json(user_id);
    });
};



const MyBook = (request, response) => {
    console.log(request.session.username);
    // if (!request.session.loggedin) return response.status(401).send();
    pool.query("SELECT book.id, book.title, book.year, book.description, book.edition, booktype.name as book_type \
                FROM userbook \
                LEFT JOIN book ON userbook.book_id = book.id \
                LEFT JOIN booktype ON booktype.id = book.type_id \
                WHERE user_id = $1 AND book_id = $2", [request.session.username, request.query.book_id], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(200).json(result.rows[0]);
    });
};

const addBook = (request, response) => {
    // if (!request.session.loggedin) return response.status(401).send();
    pool.query("SELECT id FROM booktype WHERE name = $1", [request.query.book_type], (error, result) => {
        if (error) {
            throw error;
        }
        book_type_id = result[0].id;

        pool.query("with temp_table as ( \
            INSERT INTO book (title, description, year, edition, type_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING RETURNING id \
        ) \
        select id from temp_table \
        union all \
        select id from book where title = $1 AND description = $2 AND year = $3 AND edition = $4 AND type_id = $5",
            [request.query.title, request.query.description, request.query.year, request.query.edition, book_type_id],
            (error, result) => {
                if (error) {
                    throw error;
                }
                book_id = result[0].id;
                pool.query("INSERT INTO book (book_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                    [book_id, request.session.username],
                    (error, _) => {
                        if (error) {
                            throw error;
                        }
                        response.status(201).send();
                    });
            });
    });
}

const Swaps = (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    pool.query('SELECT * FROM request WHERE receiver_user_id = $1 AND status.name = "pending"',
        [request.session.username], (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        });
}

const ScheduleSwap = (request, response) => {
    response.status(200).json('TODO');

}
const updateBook = (request, response) => {
    // if (!request.session.loggedin) return response.status(401).send();
    const book_id = parseInt(request.params.id);
    const { title, authors, year, description, edition, icbn_10, book_type } = request.body;

    response.status(200).json('TODO')
};

const DeleteBook = (request, response) => {
    if (!request.session.loggedin) return response.status(401).send();
    pool.query('DELETE FROM userbook WHERE user_id = $1 AND book_id = $2',
        [request.session.username, request.query.book_id], (error, _) => {
            if (error) {
                throw error;
            }
            response.status(200).send();
        });
};

const DeleteSwap = (request, response) => {
    const book_id = parseInt(request.params.id);
    pool.query('DELETE FROM request WHERE rid = $1', [book_id], (error, _) => {
        if (error) {
            throw error;
        }
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