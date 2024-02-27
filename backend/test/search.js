let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let expect = chai.expect;
const insert_users = require('../insert_users');


chai.use(chaiHttp);

describe('Search', () => {
    before(async function() {
        await insert_users.main();
    })

    describe('/GET search ', () => {
        it('it should GET all books in search', async function() {
            let res = await chai.request(server).get('/api/search').send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(7);
        });
    });

    describe('/GET search by title (lowercase) ', () => {
        it('it should GET books by title', async function() {
            let res = await chai.request(server).get('/api/search?title=Python').send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(3);
        });
    });

    describe('/GET search by title (CamelCase) ', () => {
        it('it should GET books by title', async function() {
            let res = await chai.request(server).get('/api/search?title=Python%20and').send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(1);
        });
    });

    describe('/GET search by course_id', () => {
        it('it should GET books by courses', async function() {
            let course_res = await chai.request(server).get('/api/courses').send();
            const courses = course_res.body;
            courses.forEach(async (course) => {
                let res = await chai.request(server).get('/api/search?course_id='+course.id).send();
                expect(res.status).to.equal(200);
                const body = res.body;
                expect(body).to.be.a('array');
            })
        });
    });

    describe('/GET search by location', () => {
        it('it should GET books by country', async function() {
            let locations_res = await chai.request(server).get('/api/locations').send();
            const locations = locations_res.body;
            locations.forEach(async (location) => {
                let res = await chai.request(server).get('/api/search?location='+location.country).send();
                expect(res.status).to.equal(200);
                const body = res.body;
                expect(body).to.be.a('array');
            })
        });
    });

    describe('/GET search by authors', () => {
        it('it should GET books by unknown authors name', async function() {
            let res = await chai.request(server).get('/api/search?author=Unknown').send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(0);
        });

        it('it should GET books by authors name', async function() {
            let res = await chai.request(server).get('/api/search?author=wes').send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(1);
        });

        it('it should GET books by authors surname', async function() {
            let res = await chai.request(server).get('/api/search?author=Stallings').send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(1);
        });

    });

});