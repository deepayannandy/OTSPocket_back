const mongoos=require("mongoose")

const userSchema= new mongoos.Schema({
    fullname:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    ssn:{  
        type:String,
        required:true
    },
    desig:{
        type:String,
        required:true
    },
    projid:{
        type:String,
        required:false
    },
    payrate_ST:{
        type:Number,
        required:false
    },
    salary:{
        type:Number,
        required:false
    },
    empBranch:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    nPlusOne:{
        type:String,
        required:false
    }
})

module.exports=mongoos.model('User',userSchema )