const express = require("express")
const router= express.Router()
const timecard=require("../models/timecardModel")
const usermodel=require("../models/userModel")
const verifie_token= require("../validators/verifyToken")
const woModel=require("../models/woModel")

//get all branch
router.get('/',verifie_token,async (req,res)=>{
    try{
        const timecardList=await timecard.find()
        res.json(timecardList)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post("/",verifie_token,async(req,res)=>{
    const wo=await woModel.findOne({'woNumber':req.body.wo});
    const user=await usermodel.findOne({'_id':req.body.empid});
    if(user== null) return res.status(400).json({message:"User not found"})
    let po=req.body.wo;
    if(wo!= null){
        po=wo.poName;
    }

    const tc= new timecard({
        submitdate :req.body.submitdate,
        empid :req.tokendata._id,
        status :"Submitted",
        empname:req.body.empname,
        shift:req.body.shift,
        po : po,
        wo :req.body.wo,
        st :req.body.st,
        ot :req.body.ot,
        tt :req.body.tt,
        starttime: req.body.starttime,
        endtime: req.body.endtime,
    })
    try{
        user.projid=""
        const newuser=await user.save()
        const newTimecard=await tc.save()
        res.status(201).json(newTimecard.id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})
router.patch('/update/:id',verifie_token,getCard,async(req,res)=>{
    if (req.tokendata.desig!="Manager") return res.status(500).json({message:"Access Pohibited!"})
    if(req.body.status!=null){
        res.timecard.status=req.body.status;
        res.timecard.ap_date=new Date();
    }
    try{
        const newtimeCard=await res.timecard.save()
        res.status(201).json({"_id":newtimeCard.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
//get timecard by po
router.get('/filter/:po',verifie_token,async (req,res)=>{
    try{
        const timecardList=await timecard.find({po:req.params.po})
        res.json(timecardList)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
//get timecard by po
router.get('/filter/:po',verifie_token,async (req,res)=>{
    try{
        const timecardList=await timecard.find({po:req.params.po})
        res.json(timecardList)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getCard(req,res,next){
    let tc
    try{
        tc=await timecard.findById(req.params.id)
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