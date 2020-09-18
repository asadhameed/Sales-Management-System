const { func } = require('joi');
const jwt = require('jsonwebtoken')
require('dotenv').config()

/*****
 * 401 Unauthorized
 * 403 forbidden
 */
function userAuth(req, res, next) {
    const token = req.header('x-auth-token')

    if (!token)
        return res.status(401).send('you can not access customer list');
    try {

        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).send('Invalid token')
    }
}
function isAdmin(req, res, next) {
    if (!req.user.admin)
        return res.status(403).send('Access denied')
    next()
}

module.exports.userAuth = userAuth;
module.exports.isAdmin = isAdmin