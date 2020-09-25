const request = require('supertest');
const {User}= require('../../../src/models/user/user')
const {Customer}= require('../../../src/models/customer/customer')

let server;
describe('Auth middleWare', () => {
    beforeEach(() => { server = require('../../../src/index') })
    afterEach( async() => {
        server.close();
       await  Customer.deleteMany({})
    })
    let token;
    const exec = () => {
        return request(server)
            .post('/customer')
            .set('x-auth-token', token)
            .send({ name: 'Customer' })
    }
    it("should return 401 if token is not provide",async () => {
            token='';
            const res = await exec();
            expect(res.status).toBe(401);
    })
    it('should return 400 if token is invalid', async ()=>{
        token='aaa';
        const res= await exec();
        expect(res.status).toBe(400)
    })

    it('Should return 200 if token is valid', async()=>{
        token = new User().generateAuthToken();
        const res = await exec();
        expect(res.status).toBe(200)
    })
})