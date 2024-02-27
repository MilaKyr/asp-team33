let chai = require('chai');
let fs = require('fs').promises;
const compareImages = require("resemblejs/compareImages");
let chaiHttp = require('chai-http');
let server = require('../index');
let expect = chai.expect;
const insert_users = require('../insert_users');

chai.use(chaiHttp);

var imageDir = "data/tests/";
var imageName = "placeholder.jpg"
var bookId;
var userId;
var loginInfo = {
    "email": "brooklyn@estes.com",
    "password": "brooklyn"
};



describe('Image', () => {
    before(async function() {
        await insert_users.main();
    })

    beforeEach(async function() {
        agent = chai.request.agent(server);
        await agent.post('/api/sign_in').send(loginInfo)
    });

    afterEach(() => {
        agent.close();
    });


    describe('Get current image ', () => {
        it('it should get current image for the book', async function() {
            let books_res = await agent.get('/api/my_books').send();
            bookId = books_res.body[0].book_id;
            userId = books_res.body[0].user_id;
            let res = await agent.get('/api/image').query({book_id: bookId, user_id: userId}).send();
            expect(res.status).to.equal(200);
            expect(res.body).to.be.a('string');   
        });

        it('it should get error with unknown bookId', async function() {
            let res = await agent.get('/api/image').query({book_id: 0, user_id: userId}).send();
            expect(res.status).to.equal(404);   
        });

        it('it should get error with unknown useId', async function() {
            let res = await agent.get('/api/image').query({book_id: bookId, user_id: 0}).send();
            expect(res.status).to.equal(404);   
        });
    });

    describe('Add new image ', () => {

            it('it should not authorize set new image', async function() {
                let res = await chai.request(server).post('/api/add_image/'+ bookId)
                        .attach('image', await fs.readFile(imageDir+imageName), 'placeholder.jpg');
                expect(res.status).to.equal(401);   
            });

            it('it should set new image', async function() {
                let res = await agent.post('/api/add_image/'+ bookId)
                        .attach('image', await fs.readFile(imageDir+imageName), 'placeholder.jpg');
                expect(res.status).to.equal(201);   
            });

            it('it should check the new image', async function() {
                let orgImageBuffer = await fs.readFile(imageDir+imageName, (data) => {return data});
                let res = await agent.get('/api/image').query({book_id: bookId, user_id: userId}).send();
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('string');
                let resImageBuffer = Buffer.from(res.body, "base64");
                let result = await compareImages(orgImageBuffer, resImageBuffer, {scaleToSameSize: true});
                expect(result.rawMisMatchPercentage).to.be.below(20);
            });

            it('it should get error with no file', async function() {
                let res = await agent.post('/api/add_image/'+ bookId)
                expect(res.status).to.equal(400);   
            });

            it('it should get error with unknown bookId', async function() {
                let res = await agent.get('/api/image').query({book_id: 0, user_id: userId}).send();
                expect(res.status).to.equal(404);   
            });
    
            it('it should get error with unknown useId', async function() {
                let res = await agent.get('/api/get_image').query({book_id: bookId, user_id: 0}).send();
                expect(res.status).to.equal(404);   
            });
        });
});