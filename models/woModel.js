const { string } = require("joi")
const mongoos=require("mongoose")

const WoSchema= new mongoos.Schema({
    poID:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    woNumber:{
        type:String,
        required:true
    },
    startDate:{
        type:String,
        required:true
    },
    endDate:{
        type:String,
        required:false
    },
    workers:{
        type:Array,
        required:false,
    },
    timecards:{
        type:Array,
        required:false,
    },
    consumeables:{
        type:Array,
        required:false,
    },
    equipements:{
        type:Array,
        required:false,
    },
    rentedEquipements:{
        type:Array,
        required:false,
    },
    branchID:{
        type:String,
        required:true
    },
    managerId:{
        type:String,
        required:true
    }
})

module.exports=mongoos.model('wo',WoSchema)