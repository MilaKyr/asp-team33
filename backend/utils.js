const pgp = require('pg-promise')({ capSQL: true });
const nodemailer = require("nodemailer");

function combine_books_with_authors(rows) {
    var books = []
    var seen_ids = []
    for (row of rows) {
        if (seen_ids.includes(row.book_id)) {
            var selected = books.filter(obj => {
                return obj.book_id === row.book_id
            })[0];
            if (!selected.authors.includes(row.author)) {
                selected.authors.push(row.author);
            }
        } else {
            seen_ids.push(row.book_id);
            row["authors"] = [row.author];
            delete row.author;
            books.push(row);
        }
    }
    return books;
}

function insert_data(tableName, columnNames, values, extras = "") {
    const cs = new pgp.helpers.ColumnSet(columnNames, { table: tableName });
    return pgp.helpers.insert(values, cs) + extras;
}


async function send_email(user, book) {
    var transporter = nodemailer.createTransport({
        host: "smtp.forwardemail.net",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
            pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
          },
    });

    var message = {
        from: "bookswap@app.com",
        to: user.email,
        subject: "New information about your book swap!",
        text: "Hurra! Your swap request was accepted. \
        You requested a book: \
        " + book.title + " by "+ book.authors +". \
        \
        You can contact "+ user.name +" on the email: "+ user.email +" \
        \
        We're hoping it'll be a success! \
        BookSwap team",
        html: "<h1>Hurra! Your swap request was accepted</h1>\
        <p>You requested a book: <br><strong>"+ book.title +"</strong>\
        <i>by "+ book.authors +"</i>.</p>\
        <p>You can contact <i>"+ user.name +"</i> on the email: <a href='mailto:"+ user.email +"'>"+ 
        user.email + "</a></p> <br> <p><i>We're hoping it'll be a success!<br>BookSwap team</i></p>",
    };
    try {
        await transporter.sendMail(message);
    } catch(err) {
        console.log(err);
    }
    
}

module.exports = {
    combine_books_with_authors,
    insert_data,
    send_email,
};