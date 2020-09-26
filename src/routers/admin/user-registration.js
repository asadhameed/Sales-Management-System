const express = require('express');
const _ = require('lodash')
//const { validationResult } = require('express-validator');
const router = express.Router();
const { User, validation } = require('../../models/user/user')
const { generatePassword } = require('../../models/user/password-util')
const signupTemplate =require('../../views/admin/auth/signup')
const {handleErrors}=require('../../middleware/handleErrors')
const { requiredName, requiredEmail, requiredPassword, requiredPasswordConfirmation } = validation;


router.get('/', (req, res) => {
    res.send(signupTemplate({}));
});


router.post('/', [requiredName, requiredEmail, requiredPassword, requiredPasswordConfirmation],handleErrors(signupTemplate), async (req, res, next) => {
    // const { errors } = validationResult(req);
    // if (errors.length > 0) return res.status(400).send('errors ' + errors[0].msg);
    let user = new User(_.pick(req.body, ['name', 'email', 'password']));
    user.password = await generatePassword(user.password);
    user = await user.save();
    res.send(_.pick(user, ['_id', 'name', 'email']))
});

module.exports = router;