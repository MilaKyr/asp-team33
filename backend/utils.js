const pgp = require('pg-promise')({ capSQL: true });
const nodemailer = require("nodemailer");
const fs = require("fs");
const config = require('./config');

function combineBooksWithAuthors(rows) {
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

function insertData(tableName, columnNames, values, extras = "") {
    const cs = new pgp.helpers.ColumnSet(columnNames, { table: tableName });
    return pgp.helpers.insert(values, cs) + extras;
}


async function sendEmail(user, book) {
    var transporter = nodemailer.createTransport({
        host: config.emailTransporter.host,
        port: config.emailTransporter.port,
        secure: config.emailTransporter.secure,
        auth: {
            user: config.emailTransporter.auth.user,
            pass: config.emailTransporter.auth.pass,
          },
    });

    var message = {
        from: config.emailTransporter.from,
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
        return {success: true};
    } catch(err) {
        return {success: false};
    }
}

function readCoverageReport(file) {
    var last_index;
    var newFile = {}
    Object.entries(file).forEach(entry => {
        const [key, value] = entry;
        if (!last_index) {
            last_index = key.split('/').length - 1;
        }
        var splitted = key.split('/');
        newFile[splitted[last_index]] = value;
      });
    return newFile
}

module.exports = {
    combineBooksWithAuthors,
    insertData,
    sendEmail,
    readCoverageReport,
};