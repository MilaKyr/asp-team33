let chai = require('chai');
let chaiHttp = require('chai-http');
let config = require('../config');
let server = require('../index');
let expect = chai.expect;
const insert_users = require('../insert_users');


chai.use(chaiHttp);

var token;
let agent;
var swapId;
const loginInfo = {
    "email": "brooklyn@estes.com",
    "password": "brooklyn"
};
const superUser = {
    "user": config.jwt.reactNativeUser,
    "password": config.jwt.reactNativePassword,
};
const swapUser = {
    "email": "dana@chambers.com",
    "password": "dana",
    "name": "Dana",
};



describe('Swaps', () => {
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
        await agent.post('/api/sign_in').set("Authorization", token).send(loginInfo)
    });

    afterEach(() => {
        agent.close();
    });

    describe('/GET my_swaps ', () => {

        it('it should not authorize to get swaps', async function() {
            let res = await chai.request(server).get('/api/my_swaps').send();
            expect(res.status).to.equal(401);   
        });

        it('it should GET all swaps', async function() {
            let res = await agent.get('/api/my_swaps').send();
            expect(res.status).to.equal(200);
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.lengthOf(1);
        });
    });

    describe('/PUT update_swap ', () => {

        it('it should not authorize to update swap', async function() {
            let res = await chai.request(server).put('/api/update_swap/' + swapId).send({});
            expect(res.status).to.equal(401);   
        });


        it('it should update swap status', async function() {
            let existing_swaps_res = await agent.get('/api/my_swaps').send();
            let statuses_res = await agent.get('/api/request_statuses').set("Authorization", token).send();
            swapId = existing_swaps_res.body[0].id;
            const newStatusId = statuses_res.body.find(function (status) {return status.id != existing_swaps_res.body[0].status_id});
            
            var updatedSwap = {
                "status_id": newStatusId.id
            }

            let update_res = await agent.put('/api/update_swap/' + swapId).send(updatedSwap);
            expect(update_res.status).to.equal(200);

            let updated_res = await agent.get('/api/my_swaps/' + swapId).send();
            expect(updated_res.status).to.equal(200);
            expect(updated_res.body.status_id).to.equal(newStatusId.id);
        });

        it('should fail to update swap with wrong status_id', async function() {
            var updatedSwap = {"status_id": -1}
            let update_res = await agent.put('/api/update_swap/' + swapId).send(updatedSwap);
            expect(update_res.status).to.equal(404);
        });

        it('should fail to update swap with unknown status_id', async function() {
            var updatedSwap = {"status_id": 1}
            let update_res = await agent.put('/api/update_swap/' + swapId).send(updatedSwap);
            expect(update_res.status).to.equal(404);
        });

        it('it should get error with unknown query', async function() {
            let res = await agent.put('/api/update_swap/' + swapId).send({});
            expect(res.status).to.equal(404);   
        });

        it('it should get error with unknown swapId', async function() {
            let res = await agent.put('/api/update_swap/0').send({});
            expect(res.status).to.equal(404);   
        });

    });

    describe('/POST schedule_swap ', () => {
        it('it should not authorize to post swap', async function() {
            let res = await chai.request(server).post('/api/schedule_swap').send({});
            expect(res.status).to.equal(401);   
        });

        it('it should create new swap', async function() {
            let books_res = await agent.get('/api/').set("Authorization", token).send();
            const requestedBook = books_res.body.find(function (book) {return book.user_name = swapUser.name});
            
            var newSwap = {
                "receiver_id": requestedBook.user_id,
                "book_id": requestedBook.book_id,
            }

            let update_res = await agent.post('/api/schedule_swap').send(newSwap);
            expect(update_res.status).to.equal(200);
            swapId = update_res.body;

            let updated_res = await agent.get('/api/my_swaps/' + swapId).send();
            expect(updated_res.status).to.equal(200);
            expect(updated_res.body).to.be.a("object");
            expect(updated_res.body.receiver_user_id).to.equal(requestedBook.user_id);
            expect(updated_res.body.book_id).to.equal(requestedBook.book_id);
        });

        it('it should get error with unknown query', async function() {
            let res = await agent.post('/api/schedule_swap').send({});
            expect(res.status).to.equal(404);   
        });
    });

    describe('/GET sent_swaps', () => {
        it('it should not authorize to get sent swap', async function() {
            let res = await chai.request(server).get('/api/sent_swaps').send();
            expect(res.status).to.equal(401);   
        });

        it('it should check number of sent swaps', async function() {
            let res = await agent.get('/api/sent_swaps').send();
            expect(res.status).to.equal(200);
            expect(res.body).to.be.a("array");
            expect(res.body).to.have.lengthOf(1);
        });

        it('it should delete swap', async function() {
            let res = await agent.delete('/api/my_swaps/' + swapId).send();
            expect(res.status).to.equal(200);
        });

        it('it should check updated number of sent swap', async function() {
            let res = await agent.get('/api/sent_swaps').send();
            expect(res.status).to.equal(200);
            expect(res.body).to.be.a("array");
            expect(res.body).to.have.lengthOf(0);
        });

        it('it should fail to delete swap with wrong swapId', async function() {
            let res = await agent.delete('/api/my_swaps/Unk').send();
            expect(res.status).to.equal(404);
        });

        it('it should fail to get swap with wrong swapId', async function() {
            let res = await agent.get('/api/my_swaps/Unk').send();
            expect(res.status).to.equal(404);
        });

    });

});