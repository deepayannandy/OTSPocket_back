const mongoos=require("mongoose")

const ExpanceSchema= new mongoos.Schema({
    submitdate:{
        type:Date,
        required:true
    },
    empid:{
        type:String,
        required:true
    },
    empname:{
        type:String,
        required:true
    },
    mearchentname:{
        type:String,
        required:true
    },
    billamount:{
        type:Number,
        required:true
    },
    imageURL:{
        type:String,
        required:true
    },
    purpose:{
        type:String,
        required:true
    },
    costcenter:{
        type:String,
        required:true
    },
})

module.exports=mongoos.model('bills',ExpanceSchema)