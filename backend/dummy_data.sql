CREATE DATABASE api;
\c api;

CREATE TABLE appuser(
    id SERIAL PRIMARY KEY,
    name varchar(40) NOT NULL,
    surname varchar(150),
    email varchar(50) NOT NULL UNIQUE,
    password_hash varchar(40) NOT NULL UNIQUE
);


CREATE TABLE booktype (
    id SERIAL PRIMARY KEY,
    name varchar(25) NOT NULL UNIQUE
);

CREATE TABLE book(
    id SERIAL PRIMARY KEY,
    type_id integer,
    icbn_10 integer,
    title varchar(50) NOT NULL,
    year integer,
    description varchar(512) NOT NULL,
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



INSERT INTO appuser (NAME,surname, EMAIL,password_hash)
VALUES ( 'John', 'Smith', 'abc@abc.com', '123456abc' ), ('Mike', 'Johnass', 'cba@cba.com', 'test123');

INSERT INTO BookType (NAME)
VALUES ( 'book');

INSERT INTO book (type_id,title,year, description, edition)
VALUES ( 1, 'Computer Security: Principles and Practice', 2011, 'In recent years, the need for education in computer security and related topics has grown dramatically – and is essential for anyone studying Computer Science or Computer Engineering. This is the only text available to provide integrated, comprehensive, up-to-date coverage of the broad range of topics in this subject. In addition to an extensive pedagogical program, the book provides unparalleled support for both research and modeling projects, giving students a broader perspective.', 2 ),
(1, 'Python for Data Analysis', 2017, 'Written by Wes McKinney, the creator of the Python pandas project, this book is a practical, modern introduction to data science tools in Python. It’s ideal for analysts new to Python and for Python programmers new to data science and scientific computing. Data files and related material are available on GitHub', 2);

INSERT INTO userbook (user_id,book_id)
VALUES ( 1, 1), ( 2, 1), ( 2, 2);

INSERT INTO author (name, surname)
VALUES ('William', 'Stallings'), ('Lawrie', 'Brown'), ('Wes', 'McKinney');

INSERT INTO bookauthor (book_id, author_id)
VALUES (1, 1), (1, 2), (2, 3);

INSERT INTO course (name)
VALUES ('Computer security'), ('Programming with Data');

INSERT INTO bookcourse (book_id, course_id)
VALUES (1, 1), (2, 2);

INSERT INTO bookimage (book_id, user_id, image)
VALUES (1, 1, pg_read_binary_file('/assets/computer_security_principles_and_practice.jpg')),
(1, 2, pg_read_binary_file('/assets/computer_security_principles_and_practice.jpg')),
(2, 2, pg_read_binary_file('/assets/python_data_analysis.jpeg'));

INSERT INTO status (name) VALUES ('pending'), ('accepted'), ('rejected');

INSERT INTO request(receiver_user_id, sender_user_id, book_id, status_id, request_date) 
VALUES (2, 1, 2, 1, '2024-02-01 11:30:30');
