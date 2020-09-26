const express= require('express')
const bodyParse=require('body-parser')
const authRouter = require('../routers/admin/auth');
const userRegistrationRouter = require('../routers/admin/user-registration')
const customerRouter = require('../routers/customer/customer')
const error = require('../middleware/error');
module.exports = function name(app) {
    app.use(express.json());
    app.use(bodyParse.urlencoded({extended:true}))
    app.use('/', authRouter)
    app.use('/signup', userRegistrationRouter)
    app.use('/customer', customerRouter)
    app.use(error)
}
