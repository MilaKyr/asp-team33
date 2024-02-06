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

module.exports = {
    combine_books_with_authors
};