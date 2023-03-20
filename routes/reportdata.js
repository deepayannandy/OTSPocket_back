const express = require("express")
const router= express.Router()

const poModel=require("../models/poModel")
const customerrate=require("../models/crsModel")
const verifie_token= require("../validators/verifyToken")
const woModel = require("../models/woModel")

router.get('/dts/:id',async (req,res)=>{
    const wo=await woModel.findById(req.params.id)
    const po=await poModel.findById(wo.poID)
    const csr=await customerrate.findById(wo.csrid)
    let woEquip= new Map();
    wo.equipements.forEach((Element)=>{
        woEquip.set(Element[2], Element[1])
    })
    let woCon= new Map();
    wo.consumeables.forEach((Element)=>{
        woCon.set(Element[2], Element[1])
    })
    csr.data.forEach((element)=>{
        if(element.Category=="Equipment" && woEquip.get(element.Item_Description)==undefined)
        {woEquip.set(element.Item_Description, "-")}
        if(element.Category=="Consumables" && woCon.get(element.Item_Description)==undefined)
        {woCon.set(element.Item_Description, "-")}
    })
    let equip=[]
    for (let [key, value] of woEquip) {
        equip.push([key,value]);
        }
    let cons=[]
    for (let [key, value] of woCon) {
            cons.push([key,value]);
            }
    res.json([{"woname":wo.woNumber,"poname":po.poNumber,"equipments":equip,"consumables":cons,"workers":wo.workers, "ContactPerson":po.contactperson,"clientname":po.clientname,"address":po.address,"jt":wo.JT,"date":new Date(),"Manager":wo.managerId}])
})








module.exports=router
