const express = require('express');
const app = express();
require('./app-startup/app-log')()
require('./app-startup/app-routers')(app)
require('./app-startup/app-db-connection')()
require('dotenv').config();


if (!process.env.JWT_PRIVATE_KEY) {
    console.error("FATAl Error: JwtPrivateKey is not define ")
    process.exit(1);
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))