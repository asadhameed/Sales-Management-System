const mongoose=require('mongoose')
const winston= require('winston')
module.exports = function () {
    mongoose.connect('mongodb://localhost/sale-management', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
        .then(() => winston.info('Connect with mongo db with sale management'))
}