const mongoos=require("mongoose")

const PoSchema= new mongoos.Schema({
    CustomerID:{
        type:String,
        required:true
    },
    JD:{
        type:String,
        required:true
    },
    poNumber:{
        type:String,
        required:true
    },
    timestamp:{
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
    typeofpo:{
        type:String,
        required:true
    },
    deos:{
        type:Array,
        required:false
    }
})

module.exports=mongoos.model('po',PoSchema)