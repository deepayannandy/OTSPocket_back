const e = require("express")
const express = require("express")
const router= express.Router()
const equipments=require("../models/equipmentsModel")

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

//get a equipments
router.get('/:id',verifie_token, getEquip,(req,res)=>{
    res.send(res.equip)
})

//get all branch
router.get('/',verifie_token,async (req,res)=>{
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
