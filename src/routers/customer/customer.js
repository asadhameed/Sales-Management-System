const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer/customer')
const {userAuth , isAdmin}= require('../../middleware/auth')
const mongoose= require('mongoose')

router.get('/', async (req, res)=>{
    const customer = await Customer.find();
    res.send(customer)
})

router.get('/:id', async (req, res)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        console.log('not valid')
        return res.status(404).send("not valid id")
    }
       
    const _id=req.params.id;
    const customer = await Customer.findById(_id)
    res.send(customer)
})
router.post('/',async(req, res)=>{
    const customer= new Customer(req.body);
   await customer.save();
    res.send(" you are post a customer")
})


module.exports=router;