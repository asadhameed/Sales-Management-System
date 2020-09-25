const express = require('express');
const router = express.Router();
const { Customer, validation } = require('../../models/customer/customer')
const { userAuth, isAdmin } = require('../../middleware/auth')
const mongoose = require('mongoose')
const isValidId = require('../../middleware/validateObjectId');
const { validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    const customer = await Customer.find();
    res.send(customer)
})

router.get('/:id', [isValidId], async (req, res) => {
    const _id = req.params.id;
    const customer = await Customer.findById(_id)
    res.send(customer)
})
router.post('/', [userAuth, validation.requiredName], async (req, res) => {
    const { errors } = validationResult(req)
    if (errors.length > 0) return res.status(400).send('Error' + errors[0].msg);
    const customer = new Customer(req.body);
    await customer.save();
    res.send(customer)
})


module.exports = router;