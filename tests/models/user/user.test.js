const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require('../../../src/models/user/user');
require('dotenv').config()


describe('user.generateAuthToken', () => {
    it('should return valid token', () => {
        const payLoad ={ _id: new mongoose.Types.ObjectId().toHexString(), name: 'test', isAdmin: true };
        const user = new User(payLoad)
        const toke = user.generateAuthToken();
        const decode = jwt.verify(toke, process.env.JWT_PRIVATE_KEY)
        expect(decode).toMatchObject(payLoad)
    })
})