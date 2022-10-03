const mongoos=require("mongoose")

const PoSchema= new mongoos.Schema({
    CustomerID:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    poNumber:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    wos:{
        type:Array,
        required:false,
    },
    branchID:{
        type:String,
        required:true
    }
})

module.exports=mongoos.model('po',PoSchema)