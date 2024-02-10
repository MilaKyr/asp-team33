const crypto = require('crypto');
const config = require('config');
const key = config.get('crypto_key');

ALGORITHM = "aes-256-gcm"; 
KEY = key.toString('base64');


function encrypt(plaintext) {
    const iv = crypto.randomBytes(12).toString('base64');
    const cipher = crypto.createCipheriv(
        ALGORITHM, 
        Buffer.from(KEY, 'base64'), 
        Buffer.from(iv, 'base64')
      );
      let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
      ciphertext += cipher.final('base64');
      const tag = cipher.getAuthTag();
      return ciphertext + "," + iv + "," + tag.toString('base64');
}

function decrypt(ciphertext, iv, tag) {
    const decipher = crypto.createDecipheriv(
        ALGORITHM, 
        Buffer.from(KEY, 'base64'),
        Buffer.from(iv, 'base64')
      );
      
      decipher.setAuthTag(Buffer.from(tag, 'base64'));
      let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
      plaintext += decipher.final('utf8');
    
      return plaintext;
}

module.exports =  {
    encrypt,
    decrypt,
}