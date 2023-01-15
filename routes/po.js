const express = require("express")
const router= express.Router()
const po=require("../models/poModel")


//create branch
const verifie_token= require("../validators/verifyToken")

router.post('/',verifie_token,async (req,res)=>{
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    const finddata= await po.findOne({"poNumber":req.body.poNumber})
    if(finddata!=null){
        return res.status(404).json({message:"PO# already exist!"})
    }

    const datenow=year + "-" + month + "-" + date+":"+date_ob.getHours()+":"+date_ob.getMinutes();
    const PO= new po({
        CustomerID:req.body.CustomerID,
        JD:req.body.JD,
        JT:req.body.JT,
        poNumber:req.body.poNumber,
        timestamp:datenow,
        wos:req.body.wos,
        contact:req.body.contact,
        address:req.body.address,
        contactperson:req.body.contactperson,
        branchID:req.body.branchID,
        managerId:req.body.managerId,
        email:req.body.email,
        typeofpo:req.body.typeofpo,
        docs:req.body.docs
    })
    try{
        const newPo=await PO.save()
        res.status(201).json(newPo)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get a branch
router.get('/:id', getPo,(req,res)=>{
    res.send(res.PO)
})



//get all branch
router.get('/',async (req,res)=>{
    try{
        const pos=await po.find()
        res.json(pos)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


router.patch("/:id",getPo,async (req,res)=>{
    console.log(res.PO);
    if(req.body.wo!=null){
        res.PO.wos.push(req.body.wo)
    }
    if(req.body.docs!=null){
        res.PO.docs.contact(req.body.docs)
    }
    try{
        const newPo=await res.PO.save()
        res.status(201).json({"_id":newPo.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getPo(req,res,next){
    let PO
    try{
        PO=await po.findById(req.params.id)
        if(PO==null){
            return res.status(404).json({message:"Branch unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.PO=PO
    next()
}
module.exports=router
