let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let config = require('../config');
let should = chai.should();
let expect = chai.expect;
const { getPool } = require('../postgresql');
const insert_users = require('../insert_users');
const {access} = require('fs/promises');

chai.use(chaiHttp);

var token;
const file = 'public/coverage-summary.json';

const superUser = {
    "user": config.jwt.reactNativeUser,
    "password": config.jwt.reactNativePassword,
};

const wrongSuperUser = {
    "user": "super_user",
    "password": "some-secret-password",
};

describe('Base endpoints', () => {
    
    describe('/POST token/generate', () => {

        it('it should generate token', async function() {
            let res = await chai.request(server).post('/api/token/generate').send(superUser);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("accessToken");
        });

        it('it should fail with wrong super user', async function() {
            let res = await chai.request(server).post('/api/token/generate').send(wrongSuperUser);
            expect(res.status).to.equal(401);
        });

        it('it should fail with wrong super user data type', async function() {
            wrongSuperUser.user = 1;
            let res = await chai.request(server).post('/api/token/generate').send(wrongSuperUser);
            expect(res.status).to.equal(404);
        });

    });

    describe('/GET api-docs', () => {
    
        it('it should GET all the books', async function() {
            let res = await chai.request(server).get('/api-docs').send();
            expect(res.status).to.equal(200);
        });
    });

    describe('/GET coverage', () => {
        var deleteFile = false;

        before(async function() {
            try {
                await access(file);
            } catch {
                fs.writeFile(file);
                deleteFile = true;
            }
        });

        after(async function() {
            if (deleteFile) {
                fs.unlink(file)
            }
        });
    
        it('it should /GET coverage', async function() {
            let res = await chai.request(server).get('/coverage').send();
            expect(res.status).to.equal(200);
        });
    });

    describe('/GET health_check', () => {

        it('it should test health_check', async function() {
            let res = await chai.request(server).get('/api/health_check').send();
            expect(res.status).to.equal(200);
        });

    });

    describe('/GET endpoints with token authorization', () => {
        before(async function() {
            await insert_users.main();
            let response = await chai.request.agent(server)
                                .post('/api/token/generate')
                                .set('Accept', 'application/json')
                                .send(superUser);
            token = response.body.accessToken;
        });

        describe('/GET bookShowcase', () => {
            it('it should GET all the books', async function() {
                let res = await chai.request(server).get('/api/').set("Authorization", token).send();
                expect(res.status).to.equal(200);
                const body = res.body;
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(7);
                });
    
            it('it should fail due to empty token', async function() {
                let res = await chai.request(server).get('/api/').send();
                expect(res.status).to.equal(401);
            });
    
            it('it should fail due to wrong token', async function() {
                let res = await chai.request(server).get('/api/').set("Authorization", "abc").send();
                expect(res.status).to.equal(403);
            });
        });
    
        describe('/GET courses', () => {
    
            it('it should GET all the courses', async function() {
                let res = await chai.request(server).get('/api/courses').set("Authorization", token).send();
                expect(res.status).to.equal(200);
                const body = res.body;
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(2);
                });
    
            it('it should fail due to empty token', async function() {
                let res = await chai.request(server).get('/api/courses').send();
                expect(res.status).to.equal(401);
            });
            
            it('it should fail due to wrong token', async function() {
                let res = await chai.request(server).get('/api/courses').set("Authorization", "abc").send();
                expect(res.status).to.equal(403);
            });
    
        });
        describe('/GET book_types', () => {
            it('it should GET all the book types', async function() {
                let res = await chai.request(server).get('/api/book_types').set("Authorization", token).send();
                expect(res.status).to.equal(200);
                const body = res.body;
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(1);
            });
    
            it('it should fail due to empty token', async function() {
                let res = await chai.request(server).get('/api/book_types').send();
                expect(res.status).to.equal(401);
            });
    
            it('it should fail due to wrong token', async function() {
                let res = await chai.request(server).get('/api/book_types').set("Authorization", "abc").send();
                expect(res.status).to.equal(403);
            });
    
        });
    
        describe('/GET request_statuses', () => {
            it('it should GET all the request statuses', async function() {
                let res = await chai.request(server).get('/api/request_statuses').set("Authorization", token).send();
                expect(res.status).to.equal(200);
                const body = res.body;
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(3);
            });
    
            it('it should fail due to empty token', async function() {
                let res = await chai.request(server).get('/api/request_statuses').send();
                expect(res.status).to.equal(401);
            });
    
            it('it should fail due to wrong token', async function() {
                let res = await chai.request(server).get('/api/request_statuses').set("Authorization", "abc").send();
                expect(res.status).to.equal(403);
            });
        });
    
        describe('/GET locations', () => {
            it('it should GET all the cities and countries available in the DB', async function() {
                let res = await chai.request(server).get('/api/locations').set("Authorization", token).send();
                expect(res.status).to.equal(200);
                const body = res.body;
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(4);
            });
    
            it('it should fail due to empty token', async function() {
                let res = await chai.request(server).get('/api/locations').send();
                expect(res.status).to.equal(401);
            });
    
            it('it should fail due to wrong token', async function() {
                let res = await chai.request(server).get('/api/locations').set("Authorization", "abc").send();
                expect(res.status).to.equal(403);
            });
        });

    });    
});