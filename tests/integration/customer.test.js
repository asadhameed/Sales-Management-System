const request = require('supertest')
const Customer = require('../../src/models/customer/customer')
const mongoose = require('mongoose');
let server;
describe('Customer API', () => {
        describe('Get', () => {
                beforeEach(() => {
                        server = require('../../src/index')
                })
                afterEach(async () => {
                        server.close();
                        await Customer.deleteMany({})
                        //await  mongoose.connection.dropCollection('customers')
                        //  await Customer.remove({})
                })
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
                       const res= await request(server).get('/customer/'+ customer._id);
                        expect(res.status).toBe(200);
                        expect(res.body).toHaveProperty('name',customer.name)
                })

                it('Should Return 404 if do not Valid id', async () => {
                        
                       const res= await request(server).get('/customer/1');
                        expect(res.status).toBe(404);
                       // expect(res.body).toHaveProperty('name',customer.name)
                })
        })
})