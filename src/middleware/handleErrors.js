const {validationResult} = require('express-validator');
module.exports={
    handleErrors(templateFunc, dataCb){
        return async (req, res , next)=>{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                let data={};
                    if(dataCb){
                        data = await dataCb(req);
                    }
                    
                return res.status(400).send(templateFunc({errors, ...data}));
            }
            next();
        }
    },
    requireAut(req, res, next){
        
        if(!req.session.userID){
            return res.redirect('/signin')
        }
        next();

    }
}