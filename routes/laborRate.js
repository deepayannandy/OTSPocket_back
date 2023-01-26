const express = require("express")
const router= express.Router()
const laborRate=require("../models/laborRateModel")
//create LR
const verifie_token= require("../validators/verifyToken")

router.post('/',async (req,res)=>{
    const lR= new laborRate({
        designation:req.body.designation,
        catagory:req.body.catagory,
        active:true,
        UROT:req.body.UROT,
        URST:req.body.URST,
    })
    try{
        const newLR=await lR.save()
        res.status(201).json(newLR)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get a LR
router.get('/:id', getLaborRate,(req,res)=>{
    res.send(res.LR)
})



//get all LR
router.get('/',async (req,res)=>{
    try{
        const laborRates=await laborRate.find()
        res.json(laborRates)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//update equipments
router.patch('/:id',getLaborRate,async(req,res)=>{
    // if (req.tokendata.desig!="Manager") return res.status(500).json({message:"Access Pohibited!"})
    if (req.body.URST!=null){
        res.LR.URST=req.body.URST;
    }
    if (req.body.UROT!=null){
        res.LR.UROT=req.body.UROT;
    }
    if (req.body.active!=null){
        res.LR.active=req.body.active;
    }
    try{
        const newlr=await res.LR.save()
        res.status(201).json({"_id":newlr.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//get all LR by catagory
router.get('/catagory/:id',async (req,res)=>{
    try{
        const laborRates=await laborRate.find({catagory:req.params.id})
        res.json(laborRates)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getLaborRate(req,res,next){
    let lr
    try{
        lr=await laborRate.findById(req.params.id)
        if(lr==null){
            return res.status(404).json({message:"Branch unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.LR=lr
    next()
}
module.exports=router
