const { check } = require('express-validator');
const mongoose = require('mongoose');

const Customer = mongoose.model('customer', new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 20 }
}))

const validation = {
    requiredName: check('name')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Name must be between 3 to 20 characters')
}

module.exports.Customer = Customer;
module.exports.validation = validation;