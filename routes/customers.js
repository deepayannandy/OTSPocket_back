const express = require("express")
const router= express.Router()
const customer=require("../models/customerModel")

const verifie_token= require("../validators/verifyToken")

//create customer
router.post('/',verifie_token,async (req,res)=>{
    if (req.tokendata.desig!="Manager") return res.status(500).json({message:"Access Pohibited!"})
    const customerData= new customer({
        customer:req.body.customer,
        address:req.body.address,
        contact:req.body.contact,
        email:req.body.email,
    })
    try{
        const newCustomer=await customerData.save()
        res.status(201).json(newCustomer)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get a customer
router.get('/:id',verifie_token, getCustomer,(req,res)=>{
    if (req.tokendata.desig!="Manager") return res.status(500).json({message:"Access Pohibited!"})
    res.send(res.customer)
})
//patch a customer
router.patch('/:id',getCustomer,async (req,res)=>{
    console.log(req.params.id);
    if(req.body.address!=null){
        res.customer.address=req.body.address;
    }
    if(req.body.contact!=null){
        res.customer.contact=req.body.contact;
    }
    if(req.body.branchID!=null){
        res.customer.branchID=req.body.branchID;
    }
    try{
        const newcust=await res.customer.save()
        res.status(201).json({"_id":newcust.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//get all customer
router.get('/',verifie_token,async (req,res)=>{
    if (req.tokendata.desig!="Manager") return res.status(500).json({message:"Access Pohibited!"})
    try{
        const customerData=await customer.find()
        res.json(customerData)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//get all customer
router.get('/dashboardCustomers/getall',async (req,res)=>{
    try{
        const customerData=await customer.find()
        res.json(customerData)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getCustomer(req,res,next){
    let selectedcustomer
    console.log(req.params.id);
    try{
        selectedcustomer=await customer.findById(req.params.id)
        if(selectedcustomer==null){
            return res.status(404).json({message:"Customer unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.customer=selectedcustomer
    next()
}
module.exports=router
