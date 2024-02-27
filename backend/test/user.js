let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let expect = chai.expect;
const insert_users = require('../insert_users');

chai.use(chaiHttp);
describe('User', () => {
    describe('/POST sing_up ', () => {
        it('it should create new user', async function() {
            var new_user = {
                "email": "test@test.com", 
                "password": "password",
                "name": "John", 
                "surname": "Doe", 
                "city": "London", 
                "country": "UK"
            };
            let res = await chai.request(server).post('/api/sign_up').send(new_user);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.a("number");
        });

        it('it should get error with empty body', async function() {
            let res = await chai.request(server).post('/api/sign_up').send({});
            expect(res.status).to.equal(404);   
        });
    });

    describe('/POST sing_in ', () => {
        before(async function() {
            await insert_users.main();
        })

        it('it should get error with empty body', async function() {
            let res = await chai.request(server).post('/api/sign_in').send({});
            expect(res.status).to.equal(401);   
        });

        it('it should get error with wrong body', async function() {
            let res = await chai.request(server).post('/api/sign_in')
            .send({"email": "brooklyn@estes.com","password": "notPassword"});
            expect(res.status).to.equal(404);   
        });
    });
});