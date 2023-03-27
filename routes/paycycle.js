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
    startdate.setDate(startdate.getDate()+15)
    console.log(startdate)
    const pc= new pay({
        status:req.body.status,
        startdate: req.body.startdate,
        enddate: date.format(startdate,'YYYY-MM-DD'),
    })
    try{
        const newpc=await pc.save()
        res.status(201).json(newpc.id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

module.exports=router