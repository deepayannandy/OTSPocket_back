const e = require("express")
const express = require("express")
const router= express.Router()
const consumeables=require("../models/consumeablesModel")
const usermodel=require("../models/userModel")

const verifie_token= require("../validators/verifyToken")
//add consumeables
router.post('/',verifie_token,async (req,res)=>{
    const con= new consumeables({
        name:req.body.name,
        stockQnt:req.body.stockQnt,
        dispatchQnt:req.body.dispatchQnt,
        desc:req.body.desc,
        branchID:req.body.branchID,
        UR:(req.body.branchID== null?0:req.body.UR)
    })
    try{
        const newConsumeables=await con.save()
        res.status(201).json(newConsumeables.id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

router.post('/dashboard/',async (req,res)=>{
    const con= new consumeables({
        name:req.body.name,
        stockQnt:req.body.stockQnt,
        dispatchQnt:req.body.dispatchQnt,
        desc:req.body.desc,
        branchID:req.body.branchID,
        UR:(req.body.branchID== null?0:req.body.UR)
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
router.get('/:id',getConsu,(req,res)=>{
    res.send(res.consume)
})

//get all consumeable
router.get('/',verifie_token,async (req,res)=>{
    const user=await usermodel.findOne({_id:req.tokendata._id});
    if(!user) return res.status(400).send({"message":"User dose not exist!"});
    if(!user.empBranch) return res.status(400).send({"message":"No Employee branch found"});
    try{
        const consumeablesList=await consumeables.find({branchID:user.empBranch})
        res.json(consumeablesList)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//get all consumeable
router.get('/dashboardConsumable/getall',async (req,res)=>{
    try{
        const consumeablesList=await consumeables.find()
        res.json(consumeablesList)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//update consumeable
router.patch('/:id',verifie_token,getConsu,async(req,res)=>{
    if (req.tokendata.desig!="Manager") return res.status(500).json({message:"Access Pohibited!"})
    if (req.body.UR!=null){
        res.consume.UR=req.body.UR;
    }
    if(req.body.stockQnt!=null){
        res.consume.stockQnt=req.body.stockQnt;
    }
    if(req.body.dispatchQnt!=null){
        res.consume.dispatchQnt=req.body.dispatchQnt;
    }
    try{
        const newconsume=await res.consume.save()
        res.status(201).json({"_id":newconsume.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//update consumeable
router.patch('/dashboard/:id',getConsu,async(req,res)=>{
    if (req.body.UR!=null){
        res.consume.UR=req.body.UR;
    }
    if(req.body.stockQnt!=null){
        res.consume.stockQnt=req.body.stockQnt;
    }
    if(req.body.dispatchQnt!=null){
        res.consume.dispatchQnt=req.body.dispatchQnt;
    }
    try{
        const newconsume=await res.consume.save()
        res.status(201).json({"_id":newconsume.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

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
