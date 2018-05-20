const crypto = require('crypto')

let SaltLength = 9;

function createHash(password) {
    let salt = generateSalt(SaltLength);
    let hash = sha512(password, salt)
    return hash;
}

function validateHash(hash, password) {
    let salt = hash.salt;
    let validHash = sha512(password, salt)
    return hash.passwordHash === validHash.passwordHash;
}

function generateSalt(len) {
    let set = process.env.PASSWORD_CRYPT_SALT_RANDOM,
        setLen = set.length,
        salt = '';
    for (let i = 0; i < len; i++) {
        let p = Math.floor(Math.random() * setLen);
        salt += set[p];
    }
    return salt;
}

function sha512(password, salt) {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

module.exports = {
    'hash': createHash,
    'validate': validateHash
};