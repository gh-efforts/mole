const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
require('dotenv').config();

const config = require('./config');

console.log(config);

// Setup server
const app = new Koa();
// Koa body parser
app.use(bodyParser());

// TODO: need to check ...

// Routing
require('./routes')(app);

http.createServer(app.callback()).listen(config.port);
