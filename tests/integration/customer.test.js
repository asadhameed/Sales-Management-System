const request = require('supertest')
const { Customer } = require('../../src/models/customer/customer')
const { User } = require('../../src/models/user/user')
const mongoose = require('mongoose');
let server;
describe('Customer API', () => {
        beforeEach(() => {
                server = require('../../src/index')
        })
        afterEach(async () => {
                server.close();
                await Customer.deleteMany({})
                //await  mongoose.connection.dropCollection('customers')
                //  await Customer.remove({})
        })
        describe('Get', () => {
                it('Get all customer', async () => {
                        await Customer.collection.insertMany([
                                { name: "test1" },
                                { name: "test2" }
                        ])
                        const res = await request(server).get('/customer');
                        expect(res.status).toBe(200)
                        expect(res.body.length).toBe(2)
                })

                it('Should Return Customer if Valid id', async () => {
                        const customer = new Customer({ name: 'customer1' });
                        await customer.save();
                        const res = await request(server).get('/customer/' + customer._id);
                        expect(res.status).toBe(200);
                        expect(res.body).toHaveProperty('name', customer.name)
                })

                it('Should Return 404 if do not Valid id', async () => {
                        const res = await request(server).get('/customer/1');
                        expect(res.status).toBe(404);
                        // expect(res.body).toHaveProperty('name',customer.name)
                })
        })

        describe("Post Method", () => {
                it('should return 401 error if client is not login', async () => {
                        const res = await request(server)
                                .post('/customer')
                                .send({ name: "test Customer" });
                        expect(res.status).toBe(401)
                })

                it('should return 400 error if customer name is less then 3', async () => {
                        const token = new User().generateAuthToken();
                        const res = await request(server)
                                .post('/customer')
                                .set('x-auth-token', token)
                                .send({ name: "aa" });
                        expect(res.status).toBe(400)
                })
                it('should return 400 error if customer name is grater then 20', async () => {
                        const customer = new Array(22).join('a') // if we want customer name length 21 then we should have array length of 22
                        const token = new User().generateAuthToken();
                        const res = await request(server)
                                .post('/customer')
                                .set('x-auth-token', token)
                                .send({ name: customer });
                        expect(res.status).toBe(400)
                })

                it("should save customer if it is Valid", async () => {
                        const token = new User().generateAuthToken();
                        await request(server)
                                .post('/customer')
                                .set('x-auth-token', token)
                                .send({ name: 'Customer1' });
                        const customer = Customer.find({ name: 'Customer1' });
                        expect(customer).not.toBeNull()
                })

                it('should send in response if customer is valid', async () => {
                        const token = new User().generateAuthToken();
                        const res = await request(server)
                                .post('/customer')
                                .set('x-auth-token', token)
                                .send({ name: 'Customer' });
                       expect(res.body).toHaveProperty('_id')
                       expect(res.body).toHaveProperty('name', 'Customer')
                })


        })



})