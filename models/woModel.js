const mongoos=require("mongoose")

const PoSchema= new mongoos.Schema({
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
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    workers:{
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
    }
})

module.exports=mongoos.model('po',PoSchema)