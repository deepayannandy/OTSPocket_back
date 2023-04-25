const express = require("express")
const router= express.Router()
const expances=require("../models/expanceModel")
const usermodel=require("../models/userModel")
const verifie_token= require("../validators/verifyToken")

//get all branch
router.get('/:costcenter',verifie_token,async (req,res)=>{
    console.log(req.params.costcenter)
    try{
        const expanceList=await expances.find({"costcenter":req.params.costcenter})
        res.json(expanceList)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/',async (req,res)=>{
    console.log(req.params.costcenter)
    try{
        const expanceList=await expances.find()
        res.json(expanceList)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
//get all of user
router.get('/byuser/:id',verifie_token,async (req,res)=>{
    console.log(req.params.id)
    try{
        const expanceList=await expances.find({"empid":req.params.id})
        res.json(expanceList)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post("/",async(req,res)=>{
    const user=await usermodel.findOne({'_id':req.body.empid});
    if(user== null) return res.status(400).json({message:"User not found"})
    const exp= new expances({
        submitdate:req.body.submitdate,
        empid:req.body.empid,
        empname:user.fullname,
        mearchentname:req.body.mearchentname,
        billamount:req.body.billamount,
        imageURL:req.body.imageURL,
        purpose:req.body.purpose,
        costcenter:user.empBranch,
    })
    try{
        const newExpance=await exp.save()
        res.status(201).json(newExpance.id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})


//middleware
async function getCard(req,res,next){
    let tc
    try{
        tc=await expances.findById(req.params.id)
        if(tc==null){
            return res.status(404).json({message:"Time Card unavailable!"})
        }
    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.timecard=tc
    next()
}

module.exports=router