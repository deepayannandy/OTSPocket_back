const mongoos=require("mongoose")

const laborRateSchema= new mongoos.Schema({
    designation:{
        type:String,
        required:true
    },
    catagory:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        required:true
    },
    URST:{
        type:Number,
        required:true
    },
    UROT:{
        type:Number,
        required:true
    }
})

module.exports=mongoos.model('laborRate',laborRateSchema)