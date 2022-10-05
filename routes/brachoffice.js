const express = require("express")
const router= express.Router()
const branchoffice=require("../models/branchOfficeModel")
//create branch
const verifie_token= require("../validators/verifyToken")

router.post('/',verifie_token,async (req,res)=>{
    const brachOffice= new branchoffice({
        branchname:req.body.branchname,
        address:req.body.address,
        active:true,
        contact:req.body.contact,
    })
    try{
        const newBranch=await brachOffice.save()
        res.status(201).json(newBranch)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get a branch
router.get('/:id', getBranch,(req,res)=>{
    res.send(res.branch)
})

//get all branch
router.get('/',async (req,res)=>{
    try{
        const branchOffices=await branchoffice.find()
        res.json(branchOffices)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getBranch(req,res,next){
    let branch
    try{
        branch=await branchoffice.findById(req.params.id)
        if(branch==null){
            return res.status(404).json({message:"Branch unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.branch=branch
    next()
}
module.exports=router
