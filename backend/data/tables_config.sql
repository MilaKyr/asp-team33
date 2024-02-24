CREATE DATABASE api;
\c api;

CREATE TABLE appuser(
    id SERIAL PRIMARY KEY,
    name varchar(100) NOT NULL,
    surname varchar(150),
    email varchar(100) NOT NULL UNIQUE,
    password_hash varchar(256) NOT NULL UNIQUE,
    city varchar(256) NOT NULL,
    country varchar(256) NOT NULL
);


CREATE TABLE booktype (
    id SERIAL PRIMARY KEY,
    name varchar(25) NOT NULL UNIQUE
);

CREATE TABLE book(
    id SERIAL PRIMARY KEY,
    type_id integer,
    icbn_10 varchar(25),
    title text NOT NULL,
    year integer,
    description text NOT NULL,
    edition integer,
    FOREIGN KEY(type_id) REFERENCES BookType(id) ON DELETE CASCADE
);

CREATE TABLE userbook(
    id SERIAL PRIMARY KEY,
    user_id integer,
    book_id integer,
    FOREIGN KEY(user_id) REFERENCES appuser(id) ON DELETE CASCADE,
    FOREIGN KEY(book_id) REFERENCES book(id) ON DELETE CASCADE,
    UNIQUE(user_id, book_id)
);


CREATE TABLE author (
    id SERIAL PRIMARY KEY,
    name varchar(50) NOT NULL,
    surname varchar(50) NOT NULL,
    UNIQUE (name, surname)
);


CREATE TABLE bookauthor (
    id SERIAL PRIMARY KEY,
    book_id integer NOT NULL,
    author_id integer NOT NULL,
    FOREIGN KEY(author_id) REFERENCES author(id) ON DELETE CASCADE,
    FOREIGN KEY(book_id) REFERENCES book(id) ON DELETE CASCADE,
    UNIQUE(book_id, author_id)
);

CREATE TABLE course (
    id SERIAL PRIMARY KEY,
    name varchar(100) NOT NULL UNIQUE
);

CREATE TABLE bookcourse (
    id SERIAL PRIMARY KEY,
    book_id integer NOT NULL,
    course_id integer NOT NULL,
    FOREIGN KEY(course_id) REFERENCES course(id) ON DELETE CASCADE,
    FOREIGN KEY(book_id) REFERENCES book(id) ON DELETE CASCADE,
    UNIQUE(book_id, course_id)
);


CREATE TABLE bookimage (
    id SERIAL PRIMARY KEY,
    book_id integer NOT NULL,
    user_id integer,
    image bytea NOT NULL,
    FOREIGN KEY(user_id) REFERENCES appuser(id) ON DELETE CASCADE,
    FOREIGN KEY(book_id) REFERENCES book(id) ON DELETE CASCADE,
    UNIQUE(book_id, user_id)
);


CREATE TYPE status_name AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE status(
    id SERIAL PRIMARY KEY,
    name status_name NOT NULL
);

CREATE TABLE request(
    id SERIAL PRIMARY KEY,
    receiver_user_id integer NOT NULL,
    sender_user_id integer NOT NULL,
    book_id integer NOT NULL,
    status_id integer NOT NULL,
    request_date timestamp,
    accept_date timestamp,
    reject_date timestamp,
    FOREIGN KEY(receiver_user_id) REFERENCES appuser(id) ON DELETE CASCADE,
    FOREIGN KEY(sender_user_id) REFERENCES appuser(id) ON DELETE CASCADE,
    FOREIGN KEY(book_id) REFERENCES book(id) ON DELETE CASCADE,
    FOREIGN KEY(status_id) REFERENCES status(id) ON DELETE CASCADE
);
