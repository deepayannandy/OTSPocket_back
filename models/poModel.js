const mongoos=require("mongoose")

const PoSchema= new mongoos.Schema({
    CustomerID:{
        type:String,
        required:true
    },
    //JD
    description:{
        type:String,
        required:true
    },
    poNumber:{
        type:String,
        required:true
    },
    startDate:{
        type:String,
        required:true
    },
    wos:{
        type:Array,
        required:false,
    },
    branchID:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    managerId:{
        type:String,
        required:true
    },
    //T&M , Lumpsum, MSA, DailyTimesheet, Callout, Others
    // typeofpo:{
    //     type:String,
    //     required:true
    // }
})

module.exports=mongoos.model('po',PoSchema)