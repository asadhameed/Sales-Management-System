require('express-async-errors');
const winston  = require('winston');
require('winston-mongodb')
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const authRouter = require('./routers/admin/auth');
const userRegistrationRouter = require('./routers/admin/user-registration')
const customerRouter = require('./routers/customer/customer')
const error = require('./middleware/error')

 process.on('uncaughtException' , (ex)=>{
     console.log(" Exception Got to start the application")
     winston.error(ex.message, ex)
     process.exit(1);
     }) 

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({db:'mongodb://localhost/sale-management',options:{ useNewUrlParser: true, useUnifiedTopology: true}}))
mongoose.connect('mongodb://localhost/sale-management', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('Connect with mongo db with sale management'))
    .catch(err => console.log('Error occurs in sale management database', err))
if (!process.env.JWT_PRIVATE_KEY) {
    console.error("FATAl Error: JwtPrivateKey is not define ")
    process.exit(1);
}
/****************************************************
 * If error happened before the application start then winston can not log that error.
 * catch the exception in start of application and save in winston log
 * process.on('uncaughtException' , (ex)=>{
 * }) 
 */
throw new Error("exception happened before application start") 
app.use(express.json());
app.use('/signin', authRouter)
app.use('/signup', userRegistrationRouter)
app.use('/customer', customerRouter)

app.use(error)
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))