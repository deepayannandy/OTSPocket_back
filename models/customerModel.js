const mongoos=require("mongoose")

const CustomerSchema= new mongoos.Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
})

module.exports=mongoos.model('customer',CustomerSchema)