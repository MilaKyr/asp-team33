let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let expect = chai.expect;
let config = require('../config');
const insert_users = require('../insert_users');


chai.use(chaiHttp);
var token;

const superUser = {
    "user": config.jwt.reactNativeUser,
    "password": config.jwt.reactNativePassword,
};

describe('Search', () => {
    before(async function() {
        let response = await chai.request.agent(server)
                            .post('/api/token/generate')
                            .set('Accept', 'application/json')
                            .send(superUser);
        token = response.body.accessToken;
        await insert_users.main();
    })

    describe('/GET search ', () => {
        it('it should GET all books in search', async function() {
            let res = await chai.request(server).get('/api/search').set("Authorization", token).send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(7);
        });

        it('it should get error with unknown query', async function() {
            let res = await chai.request(server).get('/api/search').set("Authorization", token).query({uk: "uk"}).send();
            expect(res.status).to.equal(404);   
        });

        it('it should get error with wrong token', async function() {
            let res = await chai.request(server).get('/api/search').set("Authorization", "abc").query({uk: "uk"}).send();
            expect(res.status).to.equal(403);   
        });

        it('it should get error with empty token', async function() {
            let res = await chai.request(server).get('/api/search').send();
            expect(res.status).to.equal(401);   
        });
    });

    describe('/GET search by title (lowercase) ', () => {
        it('it should GET books by title', async function() {
            let res = await chai.request(server).get('/api/search').query({title: 'Python'}).set("Authorization", token).send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(3);
        });
    });

    describe('/GET search by title (CamelCase) ', () => {
        it('it should GET books by title', async function() {
            let res = await chai.request(server).get('/api/search?title=Python%20and').set("Authorization", token).send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(1);
        });
    });

    describe('/GET search by course_id', () => {
        it('it should GET books by courses', async function() {
            let course_res = await chai.request(server).get('/api/courses').set("Authorization", token).send();
            const courses = course_res.body;
            courses.forEach(async (course) => {
                let res = await chai.request(server).get('/api/search?course_id='+course.id).set("Authorization", token).send();
                expect(res.status).to.equal(200);
                const body = res.body;
                expect(body).to.be.a('array');
            })
        });
    });

    describe('/GET search by location', () => {
        it('it should GET books by country', async function() {
            let locations_res = await chai.request(server).get('/api/locations').set("Authorization", token).send();
            const locations = locations_res.body;
            locations.forEach(async (location) => {
                let res = await chai.request(server).get('/api/search?location='+location.country).set("Authorization", token).send();
                expect(res.status).to.equal(200);
                const body = res.body;
                expect(body).to.be.a('array');
            })
        });
    });

    describe('/GET search by authors', () => {
        it('it should GET books by unknown authors name', async function() {
            let res = await chai.request(server).get('/api/search?author=Unknown').set("Authorization", token).send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(0);
        });

        it('it should GET books by authors name', async function() {
            let res = await chai.request(server).get('/api/search').query({author: 'wes'}).set("Authorization", token).send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(1);
        });

        it('it should GET books by authors surname', async function() {
            let res = await chai.request(server).get('/api/search').query({author: 'Stallings'}).set("Authorization", token).send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(1);
        });

    });
});