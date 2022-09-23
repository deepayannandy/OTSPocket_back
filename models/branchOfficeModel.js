const mongoos=require("mongoose")

const branchSchema= new mongoos.Schema({
    branchname:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    }
})

module.exports=mongoos.model('branchOffice',branchSchema)