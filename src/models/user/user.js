const mongoose = require('mongoose');
//const Joi = require('joi');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { check } = require('express-validator');
const { comparePassword } = require('./password-util');
const { boolean } = require('joi');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 5, maxlength: 50 },
    email: { type: String, required: true, minlength: 4, maxlength: 255, unique: true },
    password: { type: String, required: true, minlength: 6, maxlength: 1024 },
    admin: { type: Boolean, default: false }
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, name: this.name, admin: this.admin }, process.env.JWT_PRIVATE_KEY);
}

const User = mongoose.model('user', userSchema);

// function validateUserSignUp(user) {
//     console.log('validation start')
//     const schema = Joi.object({
//         name: Joi.string()
//             .min(5)
//             .max(50)
//             .required(),
//         email: Joi.string()
//             .min(4)
//             .max(255)
//             .required()
//             .email(),
//         password:Joi.string()
//             .min(6)
//             .max(255)
//             .required(),
//         confirmationPassword: Joi.ref('password')
//     })
//     return schema.validate(user ,{ abortEarly: false });
// }

const validation = {
    requiredName: check('name')
        .trim()
        .isLength({ min: 5, max: 50 })
        .withMessage('Name must be between 5 to 50 characters'),
    requiredEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Enter a valid email')
        .custom(async (email) => {
            const user = await User.findOne({ email })
            if (user)
                throw new Error("User already register")
        }),
    requiredPassword: check('password')
        .trim()
        .isLength({ min: 6, max: 100 })
        .withMessage('password must be between 6 to 100 characters'),
    requiredPasswordConfirmation: check('passwordConfirmation')
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password)
                throw new Error('Password must be match')
            return true
        }),
    requiredEmailExists: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Enter a valid email')
        .custom(async email => {
            const userLogin = await User.findOne({ email });
            if (!userLogin) throw new Error('Invalid Email or Password');
        }),
    requiredValidPasswordForUser: check('password')
        .trim()
        .isLength({ min: 6, max: 100 })
        .withMessage('password must be between 6 to 100 characters')
        .custom(async (password, { req }) => {
            const userLogin = await User.findOne({ email: req.body.email });
            if (!userLogin) throw new Error('Invalid Email or Password');
            const isValidPassword = await comparePassword(userLogin.password, password)
            if (!isValidPassword) throw new Error('Invalid Email or Password');
        })
}

module.exports.User = User;
module.exports.validation = validation;