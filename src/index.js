const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const authRouter = require('./routers/admin/auth');
const userRegistrationRouter = require('./routers/admin/user-registration')
const customerRouter = require('./routers/customer/customer')
const error = require('./middleware/error')

mongoose.connect('mongodb://localhost/sale-management', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('Connect with mongo db with sale management'))
    .catch(err => console.log('Error occurs in sale management database', err))
if (!process.env.JWT_PRIVATE_KEY) {
    console.error("FATAl Error: JwtPrivateKey is not define ")
    process.exit(1);
}
app.use(express.json());
app.use('/signin', authRouter)
app.use('/signup', userRegistrationRouter)
app.use('/customer', customerRouter)

app.use(error)
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))