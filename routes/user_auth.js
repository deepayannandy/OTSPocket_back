const express = require("express")
const router= express.Router()
const usermodel=require("../models/userModel")
const validator= require("../validators/validation")
const bcrypt = require("bcryptjs")
const jwt= require("jsonwebtoken")

const verifie_token= require("../validators/verifyToken")

//login user
router.post('/login',async (req,res)=>{

    //validate the data
    const valid=validator.login_validation(req.body);
    if(valid.error){
        return res.status(400).send({"message":valid.error.details[0].message});
    };
    const user=await usermodel.findOne({email:req.body.email});
    if(!user) return res.status(400).send({"message":"Email dose not exist!"});

    // validate password
    const validPass=await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send({"message":"Emailid or password is invalid!"});
    if (!user.active) return res.status(400).send({"message":"User is not an active user!"});

    //create and assign token
    const token= jwt.sign({_id:user._id,desig:user.desig},process.env.SECREAT_TOKEN);
    res.header('auth-token',token).send(token);
})
//create user
router.post('/register',async (req,res)=>{

    //validate the data
    const valid=validator.resistration_validation(req.body);
    if(valid.error){
        return res.status(400).send(valid.error.details[0].message);
    }
    const email_exist=await usermodel.findOne({email:req.body.email});
    if(email_exist) return res.status(400).send({"message":"Email already exist!"});

    //hash the password
    const salt= await bcrypt.genSalt(10);
    const hashedpassword= await bcrypt.hash(req.body.password,salt);

    const user= new usermodel({
        fullname:req.body.fullname,
        mobile:req.body.mobile,
        email:req.body.email,
        ssn:req.body.ssn,
        desig:"Employee",
        empBranch:req.body.empBranch,
        projid:"",
        payrate_ST:"0",
        salary:"0",
        active:false,
        password:hashedpassword,
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
router.get('/:id',verifie_token, getUser, (req,res,)=>{
    res.send(res.user)
})

//get all user
router.get('/',verifie_token,async (req,res)=>{
    try{
        const users=await usermodel.find()
        res.json(users)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//update user
router.patch('/:id',verifie_token,getUser,async(req,res)=>{
    if (req.tokendata.desig!="Manager") return res.status(500).json({message:"Access Pohibited!"})
    if(req.body.payrate_ST!=null){
        res.user.payrate_ST=req.body.payrate_ST;
    }
    if(req.body.salary!=null){
        res.user.salary=req.body.salary;
    }
    if(req.body.active!=null){
        res.user.active=req.body.active;
    }
    if(req.body.desig!=null){
        res.user.desig=req.body.desig;
    }
    if(req.body.projid!=null){
        if(!res.user.active) return res.status(400).send({"message":"User is not an active user!"});
        res.user.projid=req.body.projid;
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