const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
const session = require('express-session');
const compression = require('compression');
const routes = require('./routes/main');
const helmet = require('helmet');

// set the app to parse nested objects
app.use(express.urlencoded({extended: true})); 
// set the app to use gzip compression
app.use(compression());

// add cookie session params 
const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
var secret = 'secret'; // Secrete for the cookie storage. Should be random in production code
app.use(session({
	secret: secret,
	resave: false, // to avoid race conditions
	saveUninitialized: false, //per docs, is useful for implementing login sessions
  maxAge: expiryDate, // set max age of cookie to be 1 hour
}));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(helmet({contentSecurityPolicy: false}));
app.use('/api/', routes);
app.disable('x-powered-by');

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});