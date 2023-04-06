const express = require("express")
const router= express.Router()
const date = require('date-and-time')
const certification=require("../models/certificationModel")


//get all branch
router.get('/:id',async (req,res)=>{
    try{
        const certificates=await certification.find({"Office":req.params.id})
        res.json(certificates)
    }catch(error){
        res.status(400).json({message: error.message})
    }
})
//get all branch
router.get('/',async (req,res)=>{
    try{
        const certificates=await certification.find()
        res.json(certificates)
    }catch(error){
        res.status(400).json({message: error.message})
    }
})

router.post("/",async(req,res)=>{
    const cf= new certification({
        startdate:req.body.startdate,
        enddate:req.body.enddate,
        employeeid:req.body.employeeid,
        employeename:req.body.employeename,
        CertificateName:req.body.CertificateName,
        Certificateid:req.body.Certificateid,
        Office:req.body.Office,
        Department:req.body.Department,
        Supervisor:req.body.Supervisor,
    })
    try{
        const newcf=await cf.save()
        res.status(201).json(newcf.id)
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