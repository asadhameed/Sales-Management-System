const express = require('express');
const app = express();
require('./app-startup/app-log')();
require('./app-startup/app-config')();
require('./app-startup/app-routers')(app);
require('./app-startup/app-db-connection')();


const port = process.env.PORT || 3000
const server=app.listen(port, () => console.log(`Listening on port ${port}`))
module.exports=server; // this is exports for integration test