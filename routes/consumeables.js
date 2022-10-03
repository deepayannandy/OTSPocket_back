const e = require("express")
const express = require("express")
const router= express.Router()
const consumeables=require("../models/consumeablesModel")

const verifie_token= require("../validators/verifyToken")
//add consumeables
router.post('/',verifie_token,async (req,res)=>{
    const con= new consumeables({
        name:req.body.name,
        stockQnt:req.body.stockQnt,
        dispatchQnt:req.body.dispatchQnt,
        desc:req.body.desc,
        branchID:req.body.branchID
    })
    try{
        const newConsumeables=await con.save()
        res.status(201).json(newConsumeables.id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get a consumeable
router.get('/:id',verifie_token,getConsu,(req,res)=>{
    res.send(res.consume)
})

//get all branch
router.get('/',verifie_token,async (req,res)=>{
    try{
        const consumeablesList=await consumeables.find()
        res.json(consumeablesList)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//update consumeable

//middleware
async function getConsu(req,res,next){
    let consume
    try{
        consume=await consumeables.findById(req.params.id)
        if(consume==null){
            return res.status(404).json({message:"Consumeable unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.consume=consume
    next()
}
module.exports=router
