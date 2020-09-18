
const crypto = require('crypto')
const util = require('util')
const scrypt = util.promisify(crypto.scrypt)
async function generatePassword(plainPassword) {
    const salt = crypto.randomBytes(8).toString('hex')
    const buff = await scrypt(plainPassword, salt, 64)
    return `${buff.toString('hex')}::${salt}`;
}

async function comparePassword(hashPassword, suppliedPassword) {
    const [hash, salt] = hashPassword.split('::');
    const buff = await scrypt(suppliedPassword, salt, 64)
    return hash === buff.toString('hex') ? true : false;

}

module.exports.generatePassword = generatePassword;
module.exports.comparePassword = comparePassword;