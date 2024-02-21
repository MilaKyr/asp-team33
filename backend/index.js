const express = require('express');
var config = require('./config');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const compression = require('compression');
const routes = require('./routes/main');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

// set the app to parse nested objects
app.use(express.urlencoded({extended: true})); 
// set the app to use gzip compression
app.use(compression());

// add cookie session params 
app.use(session({
	store: new (require('connect-pg-simple')(session))({
    // Insert connect-pg-simple options here
  }),
  saveUninitialized: true,
  secret: config.session.secret,
  resave: false,
  cookie: {maxAge: config.session.expiryDate}
}));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(helmet({contentSecurityPolicy: false}));
app.use('/api/', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.disable('x-powered-by');

app.listen(config.port, () => {
  console.log(`App running on port ${config.port}.`);
});