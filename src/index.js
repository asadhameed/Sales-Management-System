require('express-async-errors');
const winston = require('winston');
require('winston-mongodb')
const express = require('express');
const app = express();
require('./app-startup/app-routers')(app)
require('./app-startup/app-database-connection')()
require('dotenv').config();



/*************************
 *  This is handle only caught only uncaughtException. If there is unhandledRejection then winston exception is
 * not handle it
 winston.exceptions.handle(
    new winston.transports.File({ filename: 'exceptions.log' })
  );
 */
winston.exceptions.handle(
    new winston.transports.File({ filename: 'exceptions.log' }));

// process.on('uncaughtException', (ex) => {
//     console.log(" Exception Got to start the application")
//     winston.error(ex.message, ex)
//     process.exit(1);
// })
process.on('unhandledRejection', (ex) => {
    // console.log(" Exception Got an unhandled Rejection")
    // winston.error(ex.message, ex)
    // process.exit(1);
    throw ex;
})

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({
    db: 'mongodb://localhost/sale-management',
    level: 'info',
    options: { useNewUrlParser: true, useUnifiedTopology: true }
}))

/****************************************************
 * If error happened before the application start then winston can not log that error.
 * caught the exception in start of application and save in winston log
 * process.on('uncaughtException' , (ex)=>{
 * }) 
 */
//throw new Error("exception happened before application start")
/***************************
 * Uncaught the promise rejection
 * If promise is reject, caught the unhandled rejection
 * process.on('unhandledRejection', (ex)=>{
 * })
 *  const p = Promise.reject(new Error("promise is rejected"))
 * p.then(()=>console.log("done"))
 * 
 */


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))