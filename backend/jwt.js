const config = require('./config');
const jwt = require('jsonwebtoken');

const options = {
    complete: true,
    audience: config.jwt.audience,
    algorithms: ['HS256'],
    clockTolerance: 0,
    ignoreExpiration: false,
    ignoreNotBefore: false
}

function generateJWToken() {
    let data = {
        time: Date(),
        userId: config.jwt.reactNativeUser,
        password: config.jwt.reactNativePassword,
        isHuman: false
    }
    return jwt.sign(data, config.jwt.secretKey, config.jwt.signOptions);
}

function validateJWToken(token) {
    try {
        var _ = jwt.verify(token, config.jwt.secretKey, config.jwt.verifyOptions);
        return { success: true};
      } catch (error) {
        return { success: false, error: error.message };
      }
}



module.exports =  {
    generateJWToken,
    validateJWToken,
}