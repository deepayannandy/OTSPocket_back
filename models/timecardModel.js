const mongoos=require("mongoose")

const TimecardSchema= new mongoos.Schema({
    submitdate:{
        type:Date,
        required:true
    },
    empid:{
        type:String,
        required:true
    },
    status:{
        type:Number,
        required:true
    },
    branchID:{
        type:String,
        required:true
    },
    po:{
        type:String,
        required:true
    },
    wo:{
        type:String,
        required:true
    },
    st:{
        type:Number,
        required:true
    },
    ot:{
        type:Number,
        required:true
    },
    tt:{
        type:Number,
        required:true
    },
    ap_date:{
        type:Date,
        required:false
    },
})

module.exports=mongoos.model('timecard',TimecardSchema)