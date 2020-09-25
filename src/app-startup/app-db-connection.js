const mongoose=require('mongoose')
const winston= require('winston')
module.exports = function () {
    const db=process.env.DB_URL;
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
        .then(() => winston.info(`Connect ${db}`))
}