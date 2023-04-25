const express = require("express")
const router= express.Router()
const timecard=require("../models/timecardModel")
const usermodel=require("../models/userModel")
const verifie_token= require("../validators/verifyToken")
const woModel=require("../models/woModel")
const { route } = require("./user_auth")

//get all branch
router.get('/:costcenter',verifie_token,async (req,res)=>{
    console.log(req.params.costcenter)
    try{
        const timecardList=await timecard.find({"costcenter":req.params.costcenter})
        res.json(timecardList)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/',async (req,res)=>{
    console.log(req.params.costcenter)
    try{
        const timecardList=await timecard.find()
        res.json(timecardList)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
//get all of user
router.get('/byuser/:id',verifie_token,async (req,res)=>{
    console.log(req.params.id)
    try{
        const timecardList=await timecard.find({"empid":req.params.id})
        console.log(timecardList.length)
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
    let task="Bench Time"
    if(wo!= null){
        po=wo.poName;
        wo.workers.forEach(worker=>{
            if(worker[1]==req.body.empname)
            task=worker[2]
        })
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
        costcenter:req.body.costcenter,
        starttime: req.body.starttime,
        endtime: req.body.endtime,
        task:task,
        hh:req.body.hh
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
    if (req.tokendata.desig=="Employee") return res.status(500).json({message:"Access Pohibited!"})
    if(req.body.starttime!=null){
        res.timecard.starttime=req.body.starttime;
    }
    if(req.body.endtime!=null){
        res.timecard.endtime=req.body.endtime;
    }
    if(req.body.st!=null){
        res.timecard.st=req.body.st;
    }
    if(req.body.ot!=null){
        res.timecard.ot=req.body.ot;
    }
    if(req.body.tt!=null){
        res.timecard.tt=req.body.tt;
    }
    if(req.body.shift!=null){
        res.timecard.shift=req.body.shift;
    }
    if(req.body.status!=null){
        res.timecard.status=req.body.status;
        res.timecard.ap_date=new Date();
        const wo=await woModel.findOne({'woNumber':req.body.wo});
        if(wo!= null){
            console.log(wo.woNumber)
            wo.timecards.push(res.timecard)
            await wo.save()
        }
        const user=await usermodel.findById(res.timecard.empid);
        if(user!= null){
            console.log(user.fullname)
            if(user.hrs==undefined){
                user.hrs=(res.timecard.st+res.timecard.ot);
            }
            else{
                user.hrs=user.hrs+(res.timecard.st+res.timecard.ot);
            }
            await user.save()
        }
    }
    
    try{
        const newtimeCard=await res.timecard.save()
        res.status(201).json({"_id":newtimeCard.id})
    }catch(error){
        res.status(500).json({message: error.message})
        console.log(error.message)
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

router.get('/hrtimecard/:startdate&:enddate',async(req,res)=>{
    console.log(new Date(req.params.startdate),new Date(req.params.enddate))
    const usersdata = new Map();
    let fetchedtimecards=await  timecard.find({ 
        submitdate: { $gte: new Date(req.params.startdate), 
          $lte:new Date(req.params.enddate) 
        } 
        })
    
    if (fetchedtimecards.length>0){
        fetchedtimecards.forEach((card)=>{
            let id=card.empid
            if (!usersdata.has(id)){
                usersdata.set(id,{employee:card.empname,st:card.st,ot:card.ot,hh:card.hh,costcenter:card.costcenter})
            }
            else{
                let availabledata= usersdata.get(id)
                usersdata.set(id,{employee:card.empname,st:(card.st+availabledata.st),ot:(card.ot+availabledata.ot),hh:(card.hh+availabledata.hh),costcenter:card.costcenter})
            }
        })
        console.log(usersdata)
    }
    let finaldata=[]
    usersdata.forEach((k,v)=>{
        k.empid=v
        console.log(k)
        finaldata.push(k)
    })
    console.log(finaldata)
    try{
        res.json(finaldata)
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