const e = require("express")
const express = require("express")
const router= express.Router()
const usermodel=require("../models/userModel")


//create user
router.post('/',async (req,res)=>{
    const user= new usermodel({
        fullname:req.body.fullname,
        mobile:req.body.mobile,
        email:req.body.email,
        ssn:req.body.ssn,
        desig:req.body.desig,
        uid:req.body.uid,
        empBranch:req.body.empBranch,
        projid:req.body.projid,

    })
    try{
        const newUser=await user.save()
        res.status(201).json({"_id":newUser.id})
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get a user
router.get('/:id', getUser, (req,res,)=>{
    res.send(res.user)
})

//get all user
router.get('/',async (req,res)=>{
    try{
        const users=await usermodel.find()
        res.json(users)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//update user
router.patch('/:id',getUser,async(req,res)=>{
    if(req.body.projid!=null){
        console.log(req.body.projid)
        res.user.projid=req.body.projid
    }
    try{
        const newUser=await res.user.save()
        res.status(201).json({"_id":newUser.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getUser(req,res,next){
    let user
    try{
        console.log(req.params.id)
        user=await usermodel.findById(req.params.id)
        if(user==null){
            return res.status(404).json({message:"User unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.user=user
    next()
}
module.exports=router