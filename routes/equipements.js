const e = require("express")
const express = require("express")
const router= express.Router()
const equipments=require("../models/equipmentsModel")

//add equipments
router.post('/',async (req,res)=>{
    const eqp= new equipments({
        name:req.body.name,
        availableQnt:req.body.availableQnt,
        dispatchQnt:req.body.dispatchQnt,
        branchID:req.body.branchID
    })
    try{
        const newConsumeables=await eqp.save()
        res.status(201).json(newConsumeables.id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get a equipments
router.get('/:id', getEquip,(req,res)=>{
    res.send(res.consume)
})

//get all branch
router.get('/',async (req,res)=>{
    try{
        const equipmentsList=await equipments.find()
        res.json(equipmentsList)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//update equipments

//middleware
async function getEquip(req,res,next){
    let equip
    try{
        equip=await consumeables.findById(req.params.id)
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
