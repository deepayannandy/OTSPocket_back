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
    uid:{
        type:String,
        required:true
    },
    empBranch:{
        type:String,
        required:true
    }
})

module.exports=mongoos.model('User',userSchema )