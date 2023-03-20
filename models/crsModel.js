const mongoos=require("mongoose")

const CrSSchema= new mongoos.Schema({
    CustomerID:{
        type:String,
        required:true
    },
    CustomerName:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:false
    },
    timestamp:{
        type:String,
        required:true
    },
    managerId:{
        type:String,
        required:true
    },
    data:{
        type:Array,
        required:true
    },
})

module.exports=mongoos.model('crs',CrSSchema)