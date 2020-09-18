const express = require('express');
const router = express.Router();
const {userAuth , isAdmin}= require('../../middleware/auth')

router.get('/', userAuth, (req, res)=>{
    res.send(req.user)
})

router.post('/', [userAuth, isAdmin], (req, res)=>{
    res.send(req.user+" you are post a customer")
})


module.exports=router;