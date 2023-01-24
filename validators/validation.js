//validation
const joi =require("joi")

const resistration_validation=data=>{
const schema=joi.object().keys({ 
    email:joi.string().email().required(),
    ssn:joi.string().min(4).max(9).required(),
    mobile: joi.string().length(10).pattern(/[1-9]{1}[0-9]{9}/).required(),
    password:joi.string().min(6).required(), 
    fullname:joi.string().min(6).required(),
    empBranch:joi.string().min(6).required(),
    desig:joi.string().required(),
    projid:joi.required(),
});
return schema.validate(data);
}

const login_validation=data=>{
    const schema=joi.object().keys({ 
        email:joi.string().email().required(),
        password:joi.string().min(6).required(), 
    });
    return schema.validate(data);
    }

module.exports.resistration_validation=resistration_validation;
module.exports.login_validation=login_validation;