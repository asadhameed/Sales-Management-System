const express = require('express');
const _ = require('lodash')
const { validationResult } = require('express-validator');
const router = express.Router();
const { User, validation } = require('../../models/user/user.js')
const { requiredEmailExists, requiredValidPasswordForUser } = validation;

router.post('/', [requiredEmailExists, requiredValidPasswordForUser],async (req, res) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) return res.status(400).send('Error' + errors[0].msg);
    const user = await User.findOne({ email: req.body.email });
    const token = user.generateAuthToken()
   res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']))
});
module.exports = router;