const e = require("express")
const express = require("express")
const router= express.Router()
const equipments=require("../models/equipmentsModel")
const usermodel=require("../models/userModel")

const verifie_token= require("../validators/verifyToken")

//add equipments
router.post('/',verifie_token,async (req,res)=>{
    const eqp= new equipments({
        name:req.body.name,
        availableQnt:req.body.availableQnt,
        dispatchQnt:req.body.dispatchQnt,
        branchID:req.body.branchID
    })
    try{
        const newEqui=await eqp.save()
        res.status(201).json(newEqui.id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//add equipments
router.post('/dashboard/',async (req,res)=>{
    const eqp= new equipments({
        name:req.body.name,
        availableQnt:req.body.availableQnt,
        dispatchQnt:req.body.dispatchQnt,
        branchID:req.body.branchID
    })
    try{
        const newEqui=await eqp.save()
        res.status(201).json(newEqui.id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})



//get a equipments
router.get('/:id', getEquip,(req,res)=>{
    res.send(res.equip)
})

//get all equipments
router.get('/',verifie_token,async (req,res)=>{
    const user=await usermodel.findOne({_id:req.tokendata._id});
    if(!user) return res.status(400).send({"message":"User dose not exist!"});
    if(!user.empBranch) return res.status(400).send({"message":"No Employee branch found"});
    try{
        const equipmentsList=await equipments.find({branchID:user.empBranch})
        res.json(equipmentsList)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


//get all equipments
router.get('/dashboardEquipment/getall',async (req,res)=>{
    try{
        const equipmentsList=await equipments.find({})
        res.json(equipmentsList)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//update equipments
router.patch('/:id',verifie_token,getEquip,async(req,res)=>{
    if (req.tokendata.desig!="Manager") return res.status(500).json({message:"Access Pohibited!"})
    if(req.body.availableQnt!=null){
        res.equip.availableQnt=req.body.availableQnt;
    }
    if(req.body.dispatchQnt!=null){
        res.equip.dispatchQnt=req.body.dispatchQnt;
    }
    try{
        const newequip=await res.equip.save()
        res.status(201).json({"_id":newequip.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


//update equipments
router.patch('/dashboard/:id',getEquip,async(req,res)=>{
    if(req.body.availableQnt!=null){
        res.equip.availableQnt=req.body.availableQnt;
    }
    if(req.body.dispatchQnt!=null){
        res.equip.dispatchQnt=req.body.dispatchQnt;
    }
    try{
        const newequip=await res.equip.save()
        res.status(201).json({"_id":newequip.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getEquip(req,res,next){
    let equip
    try{
        equip=await equipments.findById(req.params.id)
        if(equip==null){
            return res.status(404).json({message:"Equipement unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.equip=equip
    next()
}
module.exports=router
