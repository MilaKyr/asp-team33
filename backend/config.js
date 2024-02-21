const configPkg = require('./node_modules/config');
var dotenv = require('dotenv');
dotenv.config();
const server = configPkg.get('server');

var config = module.exports = {};

config.port = parseInt(process.env.API_PORT) || server.port;

// postgres database
config.postgres = {};
config.postgres.user = 'main';
config.postgres.host = process.env.DB_HOST || 'localhost';
config.postgres.port = parseInt(process.env.DB_PORT) || 5432;
config.postgres.password = process.env.DB_PASSWORD || "password";
config.postgres.database = process.env.DB_DATABASE || 'api';

// session settings
config.session = {};
config.session.expiryDate = 2592000000; //30 days
config.session.secret = process.env.SESSION_SECRET || "secret";


config.cryptoKey = process.env.CRYPTO_KEY || "RVRrt150sMijJktfIOyo7h0GoWZc84N4KLw9FhGIRhU=";

// email 
config.emailTransporter = {};
config.emailTransporter.host = process.env.EMAIL_HOST || "smtp.forwardemail.net";
config.emailTransporter.port = parseInt(process.env.EMAIL_PORT) || 465;
config.emailTransporter.secure = true;
config.emailTransporter.from = "bookswap@app.com";

config.emailTransporter.auth = {};
config.emailTransporter.auth.user = process.env.EMAIL_AUTH_USER || "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM";
config.emailTransporter.auth.pass = process.env.EMAIL_AUTH_PASSWORD || "REPLACE-WITH-YOUR-GENERATED-PASSWORD";

module.exports = config;
