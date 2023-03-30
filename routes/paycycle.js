const express = require("express")
const router= express.Router()
const date = require('date-and-time')
const pay=require("../models/paycycleModel")


//get all branch
router.get('/',async (req,res)=>{
    try{
        const paycycles=await pay.findOne({"status":true})
        res.json(paycycles)
    }catch(error){
        res.status(400).json({message: error.message})
    }
})

router.post("/",async(req,res)=>{
    let startdate=new Date(req.body.startdate)
    let start=new Date(req.body.startdate)
    startdate.setDate(startdate.getDate()+14)
    console.log(startdate)
    const pc= new pay({
        status:req.body.status,
        startdate: req.body.startdate,
        enddate: date.format(startdate,'YYYY-MM-DD'),
        weekno: start.getWeek(),
    })
    try{
        const newpc=await pc.save()
        res.status(201).json(newpc.id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})
Date.prototype.getWeek = function() {
    var dt = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - dt) / 86400000) + dt.getDay()+1)/7);
};
module.exports=router