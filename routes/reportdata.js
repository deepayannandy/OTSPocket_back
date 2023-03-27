const express = require("express")
const router= express.Router()

const poModel=require("../models/poModel")
const customerrate=require("../models/crsModel")
const verifie_token= require("../validators/verifyToken")
const woModel = require("../models/woModel")
const timeCard= require("../models/timecardModel")
const date = require('date-and-time')

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
    let workertimecards=[]
    wo.timecards.forEach(card=>{
        console.log(card)
        let desig=""
        wo.workers.forEach(worker=>{
            if(worker[1]==card["empname"])
            desig=worker[2]
        })
        workertimecards.push([card["empname"],desig,card["starttime"].replace(" ","").replace(" ",""),card["endtime"].replace(" ","").replace(" ",""),card["st"],card["ot"],card["tt"]])
        console.log(workertimecards)
    })
    let equip=[]
    for (let [key, value] of woEquip) {
        equip.push([key,value]);
        }
    let cons=[]
    for (let [key, value] of woCon) {
            cons.push([key,value]);
            }
    res.json([{"woname":wo.woNumber,"poname":po.poNumber,"equipments":equip,"consumables":cons,"workers":workertimecards, "ContactPerson":po.contactperson,"clientname":po.CustomerID,"address":po.address,"jt":wo.JT,"date":new Date(),"Manager":wo.managerId}])
})


router.get('/ets/:empid&:empname&:startdate&:enddate',async (req,res)=>{
    var getDaysArray = function(start, end) {
        for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
            arr.push(new Date(dt));
        }
        return arr;
    };
    let days=getDaysArray(req.params.startdate,req.params.enddate)
    let cards=[]
    let totalpo=0
    let totalnobill=0
    let totalhh=0
    for(let i=0;i<days.length;i++){
        let card = await  timeCard.findOne({ "empid": req.params.empid, "submitdate": { $regex: date.format(days[i], 'YYYY-MM-DD') } })
            if (card != null )
               {  
                totalhh=totalhh+card.hh;
                if(card.po!="Bench Time")
                {let po= await poModel.findOne({"poNumber":card.po})
                totalpo=totalpo+(card.st+card.ot)
                cards.push([date.format(days[i], 'YYYY-MM-DD'),card.wo ,po.CustomerID.split(" ")[0],(card.st+card.ot),"0",card.po,"-",card.status=="Approved"?"Completed":"Pending"])}
                else
                {   totalnobill=totalnobill+(card.st+card.ot)
                    cards.push([date.format(days[i], 'YYYY-MM-DD'), card.wo, "-" ,"0",(card.st+card.ot),"-","-",card.status=="Approved"?"Completed":"Pending"])}
            }
            else
                cards.push([date.format(days[i], 'YYYY-MM-DD'), "-","-","-","-","-","-","-"])
    }
    res.json({"empname":req.params.empname,"start":req.params.startdate,"end":req.params.enddate,"cards":cards,"billable":totalpo.toString(),"nonbillable":totalnobill.toString(),"hh":totalhh.toString()})
})

module.exports=router
