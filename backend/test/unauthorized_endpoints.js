let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
let expect = chai.expect;
const { getPool } = require('../postgresql');
const insert_users = require('../insert_users');

chai.use(chaiHttp);


describe('Unauthorized GET endpoints', () => {
    before(async function() {
        await insert_users.main();
    });

  describe('/GET bookShowcase', () => {
      it('it should GET all the books', async function() {
        let res = await chai.request(server)
            .get('/api/').send();
        expect(res.status).to.equal(200);
        const body = res.body;
        expect(body).to.be.a('array');
        expect(body).to.have.lengthOf(7);
        });
    });

  describe('/GET courses ', () => {
    it('it should GET all the courses', async function() {
        let res = await chai.request(server)
            .get('/api/courses').send();
        expect(res.status).to.equal(200);
        const body = res.body;
        expect(body).to.be.a('array');
        expect(body).to.have.lengthOf(2);
        });
    });

    describe('/GET book_types ', () => {
        it('it should GET all the book types', async function() {
            let res = await chai.request(server)
              .get('/api/book_types').send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(1);
        });
    });

    describe('/GET request_statuses ', () => {
        it('it should GET all the request statuses', async function() {
            let res = await chai.request(server)
              .get('/api/request_statuses').send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(3);
        });
    });


    describe('/GET locations ', () => {
        it('it should GET all the cities and countries available in the DB', async function() {
            let res = await chai.request(server)
              .get('/api/locations').send();
            expect(res.status).to.equal(200);
            const body = res.body;
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(4);
        });
    });
});