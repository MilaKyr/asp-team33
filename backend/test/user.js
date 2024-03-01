let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let config = require('../config');
let expect = chai.expect;
const insert_users = require('../insert_users');

var token;

const superUser = {
    "user": config.jwt.reactNativeUser,
    "password": config.jwt.reactNativePassword,
};
const newUser = {
    "email": "test@test.com", 
    "password": "password",
    "name": "John", 
    "surname": "Doe", 
    "city": "London", 
    "country": "UK"
};
const correctUser = {
    "email": "brooklyn@estes.com",
    "password": "notPassword"
};
const wrongPassword = {
    "email": "brooklyn@estes.com",
    "password": "notPassword"
};
const unknownUser = {
    "email": "test@test.com",
    "password": "notPassword"
};

chai.use(chaiHttp);
describe('User', () => {
    describe('/POST sing_up works', () => {

        before(async function() {
            await insert_users.flushDb();
            let response = await chai.request.agent(server)
                            .post('/api/token/generate')
                            .set('Accept', 'application/json')
                            .send(superUser);
            token = response.body.accessToken;
        });

        it('it should create new user', async function() {
            let res = await chai.request(server)
                            .post('/api/sign_up')
                            .set("Authorization", token)
                            .set('content-type', 'application/json')
                            .send(newUser);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.a("number");
        });
    });

    describe('/POST sing_up fails', () => {
        
        it('it should get error with empty body', async function() {
            let res = await chai.request(server).post('/api/sign_up').set("Authorization", token).send({});
            expect(res.status).to.equal(404);   
        });

        it('it should get error with empty token', async function() {
            let res = await chai.request(server).post('/api/sign_up').set('content-type', 'application/json').send(newUser);
            expect(res.status).to.equal(401);   
        });

        it('it should get error with wrong token', async function() {
            let token = "abc";
            let res = await chai.request(server).post('/api/sign_up')
            .set('content-type', 'application/json')
            .set('Authorization', "abc")
            .send(newUser);
            expect(res.status).to.equal(403);   
        });
    });

    describe('/POST sing_in ', () => {
        before(async function() {
            await insert_users.main();
        })

        it('it should get error with empty body', async function() {
            let res = await chai.request(server)
                    .post('/api/sign_in')
                    .set('Authorization', token)
                    .send({});
            expect(res.status).to.equal(404);   
        });

        it('it should get error with wrong password', async function() {
            let res = await chai.request(server)
                        .post('/api/sign_in')
                        .set('Authorization', token)
                        .send(wrongPassword);
            expect(res.status).to.equal(404);   
        });

        it('it should get error with unknown user', async function() {
            let res = await chai.request(server)
                        .post('/api/sign_in')
                        .set('Authorization', token)
                        .send(unknownUser);
            expect(res.status).to.equal(404);   
        });

        it('it should get error with empty token', async function() {
            let res = await chai.request(server)
                        .post('/api/sign_in')
                        .send(correctUser);
            expect(res.status).to.equal(401);   
        });

        it('it should get error with wrong token', async function() {
            let token = "abc";
            let res = await chai.request(server)
                    .post('/api/sign_in')
                    .set('Authorization', "abc")
                    .send(correctUser);
            expect(res.status).to.equal(403);   
        });
    });
});