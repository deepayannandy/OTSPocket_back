const { boolean } = require("joi")
const mongoos=require("mongoose")

const PayCycleSchema= new mongoos.Schema({
    startdate:{
        type:String,
        required:true
    },
    enddate:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
})
module.exports=mongoos.model('paycycle',PayCycleSchema)