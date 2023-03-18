const express = require("express")
const router= express.Router()
const customerrate=require("../models/crsModel")
const customer=require("../models/customerModel")
//create branch
const verifie_token= require("../validators/verifyToken")

router.post('/',verifie_token,async (req,res)=>{
    const customerData=await customer.find({"Customer":req.body.CustomerID})
    if(customerData.length<1) return res.status(400).json({message:"Customer not found!"})
    // console.log(customerData[0])
    const oldcustomerrate= await customerrate.find({"CustomerName":req.body.CustomerID})
    // console.log(oldcustomerrate)
    if(oldcustomerrate!=null){
        oldcustomerrate[0].data=req.body.data
        oldcustomerrate[0].timestamp=new Date()
        try{
            const csr=await oldcustomerrate[0].save()
            res.status(201).json(csr)
        }
        catch(error){
            res.status(400).json({message:error.message})
        }
    }
    else{
    const newcsr= new customerrate({
        CustomerID:customerData[0]._id,
        CustomerName:req.body.CustomerID,
        details:req.body.details,
        timestamp:new Date(),
        managerId:req.body.managerId,
        data:req.body.data
    })
    try{
        const csr=await newcsr.save()
        res.status(201).json(csr)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }}
})

//get a branch
router.get('/:id', getCSR,(req,res)=>{
    res.send(res.csr)
})

//get all branch
router.get('/',async (req,res)=>{
    try{
        const csrs=await customerrate.find()
        res.json(csrs)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getCSR(req,res,next){
    let csr
    console.log(req.params.id)
    try{
        csr=await customerrate.find({"CustomerName":req.params.id})
        if(csr==null){
            return res.status(404).json({message:"Branch unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.csr=csr
    next()
}
module.exports=router
