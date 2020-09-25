const { User } = require('../../../src/models/user/user');
const { userAuth, isAdmin } = require('../../../src/middleware/auth')
const mongoose = require('mongoose')
describe('auth middleware', () => {
    let user;
    
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    };
    const exec = () => {
        const token = new User(user).generateAuthToken()
        req = {
            header: jest.fn().mockReturnValue(token)
        };
        res = mockResponse();
        next = jest.fn();
        userAuth(req, res, next)
    }

    it('should populate req.user with the payload of a valid jwt', () => {
        user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
        exec();
        expect(req.user).toMatchObject(user)
    })

    it('should return 403 if user is not the admin ', async () => {
        user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: false }
        exec();
        res = await isAdmin(req, res, next)
        expect(res.status).toHaveBeenCalledWith(403);
    })
})