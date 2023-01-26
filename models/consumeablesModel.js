const mongoos=require("mongoose")

const ConsumeableSchema= new mongoos.Schema({
    name:{
        type:String,
        required:true
    },
    stockQnt:{
        type:Number,
        required:true
    },
    dispatchQnt:{
        type:Number,
        required:true
    },
    UR:{
        type:Number,
        required:false
    },
    desc:{
        type:String,
        required:false
    },
    branchID:{
        type:String,
        required:true
    },
})

module.exports=mongoos.model('consumeables',ConsumeableSchema)