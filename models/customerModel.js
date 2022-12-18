const mongoos=require("mongoose")

const CustomerSchema= new mongoos.Schema({
    Customer:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:false
    },
    contactperson:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    },
    phone:{
        type:String,
        required:false
    },
    branchID:{
        type:String,
        required:false
    },
})

module.exports=mongoos.model('customer',CustomerSchema)