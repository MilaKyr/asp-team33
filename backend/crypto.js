const crypto = require('crypto');

ALGORITHM = "AES-256-CBC"; 
HMAC_ALGORITHM = "SHA256"; 
IV = crypto.randomBytes(16);
KEY = crypto.randomBytes(32);

function encrypt(seq) {
    cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY, 'hex'), IV);
    let encryptedText = cipher.update(seq, "utf-8", "hex");

    // Creating the hash in the required format
    encryptedText += cipher.final("hex");
    return encryptedText + "," + IV.toString('hex')
}


module.exports =  {
    encrypt,
}