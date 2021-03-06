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
                await server.close();
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
                // Define Happy path, and in each test change the one parameter according to test
                let token;
                let name;
                const exec = async () => {
                        return await request(server)
                                .post('/customer')
                                .set('x-auth-token', token)
                                .send({ name });
                }

                beforeEach(() => {
                        token = new User().generateAuthToken();
                        name = 'Customer'
                })

                it('should return 401 error if client is not login', async () => {
                        token = '';
                        const res = await exec();
                        expect(res.status).toBe(401);
                })

                it('should return 400 error if customer name is less then 3', async () => {
                        name = 'aa';
                        const res = await exec();
                        expect(res.status).toBe(400);
                })
                it('should return 400 error if customer name is grater then 20', async () => {
                        name = new Array(22).join('a'); // if we want customer name length 21 then we should have array length of 22
                        const res = await exec();
                        expect(res.status).toBe(400);
                })

                it("should save customer if it is Valid", async () => {
                        await exec();
                        const customer = Customer.find({ name: 'Customer' });
                        expect(customer).not.toBeNull();
                })

                it('should send in response if customer is valid', async () => {
                        const res = await exec();
                        expect(res.body).toHaveProperty('_id');
                        expect(res.body).toHaveProperty('name', 'Customer');
                })

        })

        describe('Delete Customer', () => {
                let token;
                let id;
                beforeEach(() => {
                        token = new User({ isAdmin: false }).generateAuthToken();
                        id = '1'
                })

                const exec = () => {
                        return request(server)
                                .del('/customer')
                                .set('x-auth-token', token)
                                .send({ id });
                }

                it('Should return  401 if user is not login', async () => {
                        token = ''
                        const res = await exec();
                        expect(res.status).toBe(401);
                })

                it('Should return  401 if invalid token', async () => {
                        token = 'aaa'
                        const res = await exec();
                        expect(res.status).toBe(400);
                })

                it('Should return  401 if valid token but not admin', async () => {

                        const res = await exec();
                        expect(res.status).toBe(403);
                })

                it('Should return 404 if login and admin but not valid customer id', async () => {
                        token = new User({ isAdmin: true }).generateAuthToken();
                        const res = await exec();
                        expect(res.status).toBe(404);
                })

                it('Should return 404 if valid customer id  but not found ', async () => {
                        token = new User({ isAdmin: true }).generateAuthToken();
                        id = mongoose.Types.ObjectId();
                        const res = await exec();
                        expect(res.status).toBe(404);
                })

                it('Should return 200 if valid customer and delete', async () => {
                        const customer = new Customer({ name: 'customer1' });
                        await customer.save();
                        token = new User({ isAdmin: true }).generateAuthToken();
                        id = customer._id
                        const res = await exec();
                        expect(res.status).toBe(200);
                        expect(res.body).toHaveProperty('_id')
                        expect(res.body).toHaveProperty('name', 'customer1')
                })

        })

})