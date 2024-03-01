let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let config = require('../config');
let expect = chai.expect;
const insert_users = require('../insert_users');


chai.use(chaiHttp);

let agent;
let token;
var bookId;
const superUser = {
    "user": config.jwt.reactNativeUser,
    "password": config.jwt.reactNativePassword,
};
const loginInfo = {
    "email": "brooklyn@estes.com",
    "password": "brooklyn"
};
var bookCnt = 0;

describe('Books', () => {
    before(async function() {
        await insert_users.main();
        let response = await chai.request.agent(server)
                            .post('/api/token/generate')
                            .set('Accept', 'application/json')
                            .send(superUser);
        token = response.body.accessToken;
    })

    beforeEach(async function() {
        agent = chai.request.agent(server);
        await agent.post('/api/sign_in').set('Authorization', token).send(loginInfo)
    });

    afterEach(() => {
        agent.close();
    });

    describe('/GET my_books ', () => {

        it('it should not authorize get users books', async function() {
            let res = await chai.request(server).get('/api/my_books').send();
            expect(res.status).to.equal(401);   
        });

        it('it should GET all specific users books', async function() {
            let res = await agent.get('/api/my_books').send();
            expect(res.status).to.equal(200);
            const body = res.body;
            bookCnt = body.length;
            bookId = body[0].book_id;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(1);
            
           
        });
    });


    describe('/GET my_book ', () => {
        it('it should not authorize get specific book', async function() {
            let res = await chai.request(server).get('/api/my_book/' + bookId).send();
            expect(res.status).to.equal(401);   
        });

        it('it should fail with wrong type of bookId', async function() {
            let res = await agent.get('/api/my_book/Book1').send();
            expect(res.status).to.equal(404);   
        });

        it('it should GET book by bookId', async function() {
            let res = await agent.get('/api/my_book/' + bookId).send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('object');
            expect(body.book_id).to.be.eq(bookId);
            expect(body.title).to.be.eq('The CERT Guide to Insider Threats: How to Prevent, Detect, and Respond to Information Technology Crimes (Theft, Sabotage, Fraud)');
            expect(body.edition).to.be.eq(1);
            expect(body.icbn_10).to.be.eq('0321812573');
            expect(body.authors).to.be.a('array');
            expect(body.authors).to.have.lengthOf(3);
        });
    });


    describe('/POST add_book ', () => {
        it('it should not authorize to post new book', async function() {
            let res = await chai.request(server).post('/api/add_book').send({});
            expect(res.status).to.equal(401);   
        });

        it('it should POST new book', async function() {
            let book_type_res = await chai.request(server).get('/api/book_types').set("Authorization", token).send();
            let courses_res = await chai.request(server).get('/api/courses').set("Authorization", token).send();
            var newBookJson = {
                book_type_id: book_type_res.body[0].id, 
                title: "Test title", 
                description: "Test description", 
                icbn_10: "1111111111", 
                year : 1999, 
                edition: 1, 
                course_id: courses_res.body[0].id,
                authors: [{"name": "John", "surname": "Doe"}, {"name": "Jane", "surname": "Doe"}]
            };
            let res = await agent.post('/api/add_book').set('content-type', 'application/json').send(newBookJson);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.a('number');
            bookId = res.body;

            let all_books_res = await agent.get('/api/my_books/').send();
            expect(all_books_res.status).to.equal(200);
            expect(all_books_res.body).to.be.a('array');
            expect(all_books_res.body).to.have.lengthOf(bookCnt + 1);
        });

        it('it should get error with empty params', async function() {
            let res = await agent.post('/api/add_book/').send({});
            expect(res.status).to.equal(404);   
        });
    });

    describe('/PUT update_book', () => {
        it('it should not authorize to update book', async function() {
            let res = await chai.request(server).put('/api/update_book/' + bookId).send({});
            expect(res.status).to.equal(401);   
        });

        it('it should update title', async function() {
            var newBookTitle = "New updated title";
            let existing_book_res = await agent.get('/api/my_book/' + bookId).send();
            let existing_book = existing_book_res.body;
            expect(existing_book).to.be.a('object');
            var updated_book = {
                "book_type_id": existing_book.book_type_id, 
                "title": newBookTitle, 
                "description": existing_book.description, 
                "icbn_10": existing_book.icbn_10, 
                "year" : existing_book.year, 
                "edition": existing_book.edition, 
                "course_id": existing_book.course_id,
                "authors" : [{"name": "John", "surname": "Doe"}, {"name": "Jane", "surname": "Doe"}]
            }
            let res = await agent.put('/api/update_book/' + bookId).send(updated_book);
            expect(res.status).to.equal(200);

            let updated_book_res = await agent.get('/api/my_book/' + bookId).send();
            expect(updated_book_res.body.title).to.be.eq(newBookTitle);
        });

        it('it should update year', async function() {
            var newBookYear = 2024;
            let existing_book_res = await agent.get('/api/my_book/' + bookId).send();
            let existing_book = existing_book_res.body;
            expect(existing_book).to.be.a('object');
            var updated_book = {
                "book_type_id": existing_book.book_type_id, 
                "title": existing_book.title, 
                "description": existing_book.description, 
                "icbn_10": existing_book.icbn_10, 
                "year" : newBookYear, 
                "edition": existing_book.edition, 
                "course_id": existing_book.course_id,
                "authors" : [{"name": "John", "surname": "Doe"}, {"name": "Jane", "surname": "Doe"}]
            }
            let res = await agent.put('/api/update_book/' + bookId).send(updated_book);
            expect(res.status).to.equal(200);

            let updated_book_res = await agent.get('/api/my_book/' + bookId).send();
            expect(updated_book_res.body.year).to.be.eq(newBookYear);
        });

        it('it should update description', async function() {
            var newBookDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
            let existing_book_res = await agent.get('/api/my_book/' + bookId).send();
            let existing_book = existing_book_res.body;
            expect(existing_book).to.be.a('object');
            var updated_book = {
                "book_type_id": existing_book.book_type_id, 
                "title": existing_book.title, 
                "description": newBookDescription, 
                "icbn_10": existing_book.icbn_10, 
                "year" : existing_book.year, 
                "edition": existing_book.edition, 
                "course_id": existing_book.course_id,
                "authors" : [{"name": "John", "surname": "Doe"}, {"name": "Jane", "surname": "Doe"}]
            }
            let res = await agent.put('/api/update_book/' + bookId).send(updated_book);
            expect(res.status).to.equal(200);

            let updated_book_res = await agent.get('/api/my_book/' + bookId).send();
            expect(updated_book_res.body.description).to.be.eq(newBookDescription);
        });

        it('it should update ICBN 10', async function() {
            var newBookIcbn = "0000000";
            let existing_book_res = await agent.get('/api/my_book/' + bookId).send();
            let existing_book = existing_book_res.body;
            expect(existing_book).to.be.a('object');
            var updated_book = {
                "book_type_id": existing_book.book_type_id, 
                "title": existing_book.title, 
                "description": existing_book.description, 
                "icbn_10": newBookIcbn, 
                "year" : existing_book.year, 
                "edition": existing_book.edition, 
                "course_id": existing_book.course_id,
                "authors" : [{"name": "John", "surname": "Doe"}, {"name": "Jane", "surname": "Doe"}]
            }
            let res = await agent.put('/api/update_book/' + bookId).send(updated_book);
            expect(res.status).to.equal(200);

            let updated_book_res = await agent.get('/api/my_book/' + bookId).send();
            expect(updated_book_res.body.icbn_10).to.be.eq(newBookIcbn);
        });

        it('it should update edition', async function() {
            var newBookEdition = 999;
            let existing_book_res = await agent.get('/api/my_book/' + bookId).send();
            let existing_book = existing_book_res.body;
            expect(existing_book).to.be.a('object');
            var updated_book = {
                "book_type_id": existing_book.book_type_id, 
                "title": existing_book.title, 
                "description": existing_book.description, 
                "icbn_10": existing_book.icbn_10, 
                "year" : existing_book.year, 
                "edition": newBookEdition, 
                "course_id": existing_book.course_id,
                "authors" : [{"name": "John", "surname": "Doe"}, {"name": "Jane", "surname": "Doe"}]
            }
            let res = await agent.put('/api/update_book/' + bookId).send(updated_book);
            expect(res.status).to.equal(200);

            let updated_book_res = await agent.get('/api/my_book/' + bookId).send();
            expect(updated_book_res.body.edition).to.be.eq(newBookEdition);
        });

        it('it should update course', async function() {
            let existing_book_res = await agent.get('/api/my_book/' + bookId).send();
            let existing_book = existing_book_res.body;
            expect(existing_book).to.be.a('object');

            let courses_res = await chai.request(server).get('/api/courses').set("Authorization", token).send();
            const newBookCourseId = courses_res.body.find(function (course) {return course.id != existing_book.course_id});
            var updated_book = {
                "book_type_id": existing_book.book_type_id, 
                "title": existing_book.title, 
                "description": existing_book.description, 
                "icbn_10": existing_book.icbn_10, 
                "year" : existing_book.year, 
                "edition": existing_book.edition, 
                "course_id": newBookCourseId.id,
                "authors" : [{"name": "John", "surname": "Doe"}, {"name": "Jane", "surname": "Doe"}]
            }
            let res = await agent.put('/api/update_book/' + bookId).send(updated_book);
            expect(res.status).to.equal(200);
            let updated_book_res = await agent.get('/api/my_book/' + bookId).send();
            expect(updated_book_res.body.course_id).to.be.eq(newBookCourseId.id);
        });

        it('it should update authors', async function() {
            var newBookAuthors = [{"name": "John", "surname": "Doe"}, {"name": "Janette", "surname": "Doe"}, 
                                    {"name": "Lui", "surname": "Test"} ];
            let existing_book_res = await agent.get('/api/my_book/' + bookId).send();
            let existing_book = existing_book_res.body;
            expect(existing_book).to.be.a('object');
            expect(existing_book.authors).to.have.lengthOf(2);
            var updated_book = {
                "book_type_id": existing_book.book_type_id, 
                "title": existing_book.title, 
                "description": existing_book.description, 
                "icbn_10": existing_book.icbn_10, 
                "year" : existing_book.year, 
                "edition": existing_book.edition, 
                "course_id": existing_book.course_id,
                "authors" : newBookAuthors
            }
            let res = await agent.put('/api/update_book/' + bookId).send(updated_book);
            expect(res.status).to.equal(200);

            let updated_book_res = await agent.get('/api/my_book/' + bookId).send();
            expect(updated_book_res.body.authors).to.have.lengthOf(3);
            expect(updated_book_res.body.authors).to.have.all.members(["John Doe", "Janette Doe", "Lui Test"]);
        });

        it('it should get error with empty params', async function() {
            let res = await agent.put('/api/update_book/' + bookId).send({});
            expect(res.status).to.equal(404);   
        });
    });


    describe('/DELETE my_book ', () => {

        it('it should not authorize to delete book', async function() {
            let res = await chai.request(server).delete('/api/my_book/' + bookId).send();
            expect(res.status).to.equal(401);   
        });
        
        it('it should delete specified book', async function() {
            let res = await agent.delete('/api/my_book/' + bookId).send();
            expect(res.status).to.equal(200);
        });

        it('it should get error with unknown bookId', async function() {
            let res = await agent.delete('/api/my_book/abc').send({});
            expect(res.status).to.equal(404);   
        });
    });
});