const mongoos=require("mongoose")

const EquipmentSchema= new mongoos.Schema({
    name:{
        type:String,
        required:true
    },
    availableQnt:{
        type:Number,
        required:true
    },
    dispatchQnt:{
        type:Number,
        required:true
    },
    branchID:{
        type:String,
        required:true
    },
})

module.exports=mongoos.model('equipment',EquipmentSchema)