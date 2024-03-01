const configPkg = require('config');
var dotenv = require('dotenv');
dotenv.config();
var config = module.exports = {};

config.port = process.env.PORT || 4000;

// postgres database
config.postgres = {};
config.postgres.user = process.env.DB_USER || configPkg.database.user;
config.postgres.host = process.env.DB_HOST || configPkg.database.host;
config.postgres.port = parseInt(process.env.DB_PORT) || configPkg.database.port;
config.postgres.password = process.env.DB_PASSWORD || configPkg.database.password;
config.postgres.database = process.env.DB_DATABASE || configPkg.database.database;

// session settings
config.session = {};
config.session.expiryDate = 2592000000; //30 days
config.session.secret = process.env.SESSION_SECRET || configPkg.session.secret;


config.cryptoKey = process.env.CRYPTO_KEY || configPkg.crypto_key;

config.searchFilters =  configPkg.search_filters;

// email 
config.emailTransporter = {};
config.emailTransporter.host = process.env.EMAIL_HOST || configPkg.email_transporter.host;
config.emailTransporter.port = parseInt(process.env.EMAIL_PORT) || configPkg.email_transporter.port;
config.emailTransporter.secure = true || configPkg.email_transporter.secure;
config.emailTransporter.from = configPkg.email_transporter.from;

config.emailTransporter.auth = {};
config.emailTransporter.auth.user = process.env.EMAIL_AUTH_USER || configPkg.email_transporter.auth.user;
config.emailTransporter.auth.pass = process.env.EMAIL_AUTH_PASSWORD || configPkg.email_transporter.pass;


// image resizing
config.imageResize = {};
config.imageResize.height = parseInt(process.env.IMAGE_RESIZE_HEIGHT) || configPkg.imageResize.height;
config.imageResize.width = parseInt(process.env.IMAGE_RESIZE_WIDTH) || configPkg.imageResize.width;
config.imageResize.fit = process.env.IMAGE_RESIZE_FIT || configPkg.imageResize.fit;

// JWT
config.jwt = {};
config.jwt.tokenHeaderKey = process.env.JWT_HEADER_KEY || configPkg.jwt.header_key;
config.jwt.secretKey = process.env.JWT_SECRET_KEY || configPkg.jwt.secretKey;
config.jwt.reactNativeUser = process.env.JWT_USER || configPkg.jwt.user;
config.jwt.reactNativePassword = process.env.JWT_USER_PASSWORD || configPkg.jwt.password;

config.jwt.signOptions = {};
config.jwt.signOptions.expiresIn = process.env.JWT_EXPIRES_IN || configPkg.jwt.expires_in;
config.jwt.signOptions.audience = process.env.JWT_AUDIENCE || configPkg.jwt.audience;
config.jwt.signOptions.algorithm = 'HS256';
config.jwt.signOptions.notBefore = 0;
config.jwt.signOptions.noTimestamp = false;
config.jwt.signOptions.allowInsecureKeySizes = false;
config.jwt.signOptions.allowInvalidAsymmetricKeyTypes = false;

config.jwt.verifyOptions = {};
config.jwt.verifyOptions.audience = process.env.JWT_AUDIENCE || configPkg.jwt.audience;
config.jwt.verifyOptions.algorithms = ['HS256'];
config.jwt.verifyOptions.clockTolerance = 0;
config.jwt.verifyOptions.ignoreExpiration = false;
config.jwt.verifyOptions.ignoreNotBefore = false;

module.exports = config;
