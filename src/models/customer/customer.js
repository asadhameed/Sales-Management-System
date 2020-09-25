const mongoose=require('mongoose');

const Customer = mongoose.model('customer' , new mongoose.Schema({
    name:{type:String, required:true, minlength:3, maxlength:20}
}))

module.exports=Customer;