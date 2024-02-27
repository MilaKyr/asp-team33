let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let expect = chai.expect;

chai.use(chaiHttp);
describe('SingUp', () => {
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
    });
});