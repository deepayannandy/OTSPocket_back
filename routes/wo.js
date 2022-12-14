const express = require("express")
const router= express.Router()
const wo=require("../models/woModel")
const po=require("../models/poModel")
const user=require("../models/userModel")
const con=require("../models/consumeablesModel")
const equip=require("../models/equipmentsModel")
//create branch
const verifie_token= require("../validators/verifyToken")

router.post('/',getPo,verifie_token,async (req,res)=>{
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    const datenow=year + "-" + month + "-" + date;
    //T1I-CostCenter-ABC1216830
    const wonumber="T1IWO"+year+"-"+res.PO.CustomerID.substring(0, 3)+month+date+date_ob.getHours()+date_ob.getMinutes();
    const WO= new wo({
        poID:req.body.poID,
        description:req.body.description,
        woNumber:wonumber,
        startDate:datenow,
        workers:req.body.workers,
        contact:req.body.contact,
        branchID:req.body.branchID,
        managerId:req.body.managerId,
        consumeables:req.body.consumeables,
        equipements:req.body.equipements,
        rentedEquipements:req.body.rentedEquipements,
        endDate:"",
        timecards:[]
    })
    try{
        const newWo=await WO.save()
        res.PO.wos.push(newWo.wonumber)
        const newPo=await res.PO.save()
        for (worker in req.body.workers){
            workerdata=await user.findById(req.body.workers[worker])
            workerdata.projid=newWo.woNumber;
            const updateduser=await workerdata.save()
        }
        for (Con in req.body.consumeables){
            consumeable=await con.findById(req.body.consumeables[Con][0])
            consumeable.stockQnt=consumeable.stockQnt-req.body.consumeables[Con][1];
            const updatedconsumeable=await consumeable.save()
        }
        for (Equip in req.body.equipements){
            equipement=await equip.findById(req.body.equipements[Equip][0])
            equipement.availableQnt=equipement.availableQnt-req.body.equipements[Equip][1];
            equipement.dispatchQnt=equipement.dispatchQnt+req.body.equipements[Equip][1];
            const updatedequipements=await equipement.save()
        }
        res.status(201).json({"poid":newPo._id,"woid":newWo._id})
    }
    catch(error){
        res.status(400).json({message:error.message})
    }

})

//get a branch
router.get('/:id', getWo,(req,res)=>{
    res.send(res.WO)
})



//get all branch
router.get('/',async (req,res)=>{
    try{
        const wos=await wo.find()
        res.json(wos)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
// scheduling
router.get('/sghedulaing/get',async (req,res)=>{
    let fulldata=[]
    let data={}
    const wos=await wo.find()
    for (let wo in wos){
        console.log(wo);
        data.Subject=wos[wo].woNumber;
        data.StartTime=wos[wo].startDate;
        if(wos[wo].endDate==""){
            data.EndTime=new Date();
        }
    }
    try{
        
        res.json({"Message":"Hi"})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.patch("/:id",getWo,async (req,res)=>{
    if (req.body.addworkers!=null){
        res.WO.workers=res.WO.workers.concat(req.body.addworkers)
        for (worker in req.body.addworkers){
            workerdata=await user.findById(req.body.addworkers[worker])
            workerdata.projid=res.WO._id;
            const updateduser=await workerdata.save();
        }
    }
    if (req.body.addconsumeables!=null){
        res.WO.consumeables=res.WO.consumeables.concat(req.body.addconsumeables)
        for (Con in req.body.addconsumeables){
            consumeable=await con.findById(req.body.addconsumeables[Con][0])
            consumeable.stockQnt=consumeable.stockQnt-req.body.addconsumeables[Con][1];
            const updatedconsumeable=await consumeable.save()
        }
    }
    if (req.body.addequipements!=null){
        res.WO.equipements=res.WO.equipements.concat(req.body.addequipements)
        for (Equip in req.body.addequipements){
            equipement=await equip.findById(req.body.addequipements[Equip][0])
            equipement.availableQnt=equipement.availableQnt-req.body.addequipements[Equip][1];
            equipement.dispatchQnt=equipement.dispatchQnt+req.body.addequipements[Equip][1];
            const updatedequipements=await equipement.save()
        }
    }
    try{
        const newWo=await res.WO.save()
        res.status(201).json({"_id":newWo.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getWo(req,res,next){
    let WO
    try{
        WO=await wo.findById(req.params.id)
        if(WO==null){
            return res.status(404).json({message:"WO unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.WO=WO
    next()
}

async function getPo(req,res,next){
    let PO
    try{
        PO=await po.findById(req.body.poID)
        if(PO==null){
            return res.status(404).json({message:"PO unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.PO=PO
    next()
}

module.exports=router
