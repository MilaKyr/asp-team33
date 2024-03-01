const express = require('express');
var cors = require('cors')
var fs = require('fs');
const session = require('express-session');
const compression = require('compression');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const helmet = require('helmet');
const pgSession = require('connect-pg-simple')(session);

var config = require('./config');
const routes = require('./routes/main');
var utils = require('./utils');
const swaggerDocument = require('./docs/swagger.json');
const { getPool } = require('./postgresql');

const app = express();

// set the app to parse nested objects
app.use(express.urlencoded({extended: true})); 
// set the app to use gzip compression
app.use(compression());


const postgreStore = new pgSession({
  pool: getPool(),
  createTableIfMissing: true,
})


// add cookie session params 
app.use(session({
	store: new (require('connect-pg-simple')(session))({
    // Insert connect-pg-simple options here
  }),
  saveUninitialized: true,
  secret: config.session.secret,
  resave: false,
  cookie: {maxAge: config.session.expiryDate},
  store: postgreStore,
}));

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(helmet({contentSecurityPolicy: false}));
app.use('/api/', routes);

app.get('/coverage', (_, res) => {
  var file = JSON.parse(fs.readFileSync('public/coverage-summary.json', 'utf8'));
  return res.json(utils.readCoverageReport(file));
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.disable('x-powered-by');

app.listen(config.port, () => {
  console.log(`App running on port ${config.port}.`);
});

module.exports = app;
