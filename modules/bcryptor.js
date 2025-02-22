const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const salt_rounds = 10;
    const hashed_password = await bcrypt.hash(password, salt_rounds);
    return hashed_password;
}

async function verifyPassword(password, hashed_password) {
    const match = await bcrypt.compare(password, hashed_password);
    return match;
}

module.exports = {
    hashPassword,
    verifyPassword
};