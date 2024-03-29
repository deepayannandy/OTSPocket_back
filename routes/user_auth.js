const express = require("express")
const router= express.Router()
const usermodel=require("../models/userModel")
const validator= require("../validators/validation")
const bcrypt = require("bcryptjs")
const jwt= require("jsonwebtoken")
const nodemailer = require('nodemailer');
const mongodb=require("mongodb");
require("dotenv").config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'appsdny@gmail.com',
    pass: process.env.MAILER_PASS,
  },
  port:465,
  host:"smtp.gmail.com"
});

const verifie_token= require("../validators/verifyToken")

//login user
router.post('/login',async (req,res)=>{

    //validate the data
    const valid=validator.login_validation(req.body);
    if(valid.error){
        return res.status(400).send({"message":valid.error.details[0].message});
    };
    const user=await usermodel.findOne({email:req.body.email});
    if(!user) return res.status(400).send({"message":"User dose not exist!"});

    // validate password
    const validPass=await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send({"message":"Emailid or password is invalid!"});
    if (!user.active) return res.status(400).send({"message":"User is not an active user!"});

    //create and assign token
    const token= jwt.sign({_id:user._id,desig:user.desig},process.env.SECREAT_TOKEN);
    res.header('auth-token',token).send(token);
})

//login admin
router.post('/dashboardlogin/',async (req,res)=>{

    //validate the data
    const valid=validator.login_validation(req.body);
    if(valid.error){
        return res.status(400).send({"message":valid.error.details[0].message});
    };
    const user=await usermodel.findOne({email:req.body.email});
    if(!user) return res.status(400).send({"message":"User dose not exist!"});
    if(user.desig!="Admin") return res.status(400).send({"message":"Access Denied"});
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
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
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
    
    const datenow=year + "-" + ("0" + month).slice(-2) + "-" + ("0" + date).slice(-2);
    console.log(datenow);

    var regestereduserMail = {
        from: 'appsdny@gmail.com',
        to: req.body.email,
        subject: 'Tier1Integrity || Onboarding process has been started ||',
        text: `Hi ${req.body.fullname},
Congratulations on your successful registration at Tier1Integrity. Your Profile is shared with the management team for an approval.
      
Your login id: ${req.body.email}
Password: ${req.body.password}
      
* Do Not Share this mail *
              
We will let you know as soon as your profile got approved.
      
Thank you 
Team Tier1Integrity`      
      };
var managementMail = {
        from: 'appsdny@gmail.com',
        to: "admin@t1integrity.com",//'admin@t1integrity.com'
        subject: `${req.body.fullname}|| Approval Required ||`,
        text: `Dear Management,
New registered user(s) need your approval. 
         
User Details
    Full name: ${req.body.fullname}
    Email: ${req.body.email}
    Cost Centre: ${req.body.empBranch}
    Contact: ${req.body.mobile}
         
* Do Not Share this mail *
         
Thank you
Team Tier1Integrity`      
      };

    const user= new usermodel({
        fullname:req.body.fullname,
        mobile:req.body.mobile,
        email:req.body.email,
        ssn:req.body.ssn,
        desig:req.body.desig,
        empBranch:req.body.empBranch,
        projid:"",
        payrate_ST:"0",
        salary:"0",
        active:false, 
        password:hashedpassword,
        Status:"Pending",
        StatusBg:"#FEC90F",
        onBoardingDate:datenow,
        desigcatagory:req.body.desigcatagory,
    })
    try{
        const newUser=await user.save()
        transporter.sendMail(regestereduserMail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          transporter.sendMail(managementMail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.status(201).json({"_id":newUser.id})
        
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//create user
router.post('/register/dashboard/',async (req,res)=>{
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    //validate the data
    const valid=validator.resistration_validation(req.body);
    if(valid.error){
        console.log(valid.error.details[0].message);
        return res.status(400).send(valid.error.details[0].message);

    }
    const email_exist=await usermodel.findOne({email:req.body.email});
    if(email_exist) {
        console.log("Email already exist!");
        return res.status(400).send({"message":"Email already exist!"});
    }

    //hash the password
    const salt= await bcrypt.genSalt(10);
    const hashedpassword= await bcrypt.hash(req.body.password,salt);
    
    const datenow=year + "-" + month + "-" + date;
    console.log(datenow);

    const user= new usermodel({
        fullname:req.body.fullname,
        mobile:req.body.mobile,
        email:req.body.email,
        ssn:req.body.ssn,
        desig:req.body.desig,
        empBranch:req.body.empBranch,
        projid:"",
        payrate_ST:"0",
        salary:"0",
        active:true, 
        password:hashedpassword,
        Status:"Active",
        StatusBg:"#8BE78B",
        onBoardingDate:datenow,
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
// get my data
router.get("/mydata/me",verifie_token,async (req,res)=>{
    console.log(req.tokendata._id)
    const user=await usermodel.findOne({_id:req.tokendata._id});
    if(!user) return res.status(400).send({"message":"User dose not exist!"});
    res.send(user)

})

//get all user
router.get('/',verifie_token,async (req,res)=>{
    const user=await usermodel.findOne({_id:req.tokendata._id});
    if(!user) return res.status(400).send({"message":"User dose not exist!"});
    if(!user.empBranch) return res.status(400).send({"message":"No Employee branch found"});
    console.log(user.empBranch)
    try{
        const users=await usermodel.find({empBranch:user.empBranch});
        res.json(users)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//update user
router.patch('/:id',getUser,async(req,res)=>{
    // if (req.tokendata.desig!="Manager") return res.status(500).json({message:"Access Pohibited!"})
    if(req.body.email!=null){
        res.user.email=req.body.email;
    }
    if(req.body.fullname!=null){
        res.user.fullname=req.body.fullname;
    }
    if(req.body.payrate_ST!=null){
        res.user.payrate_ST=req.body.payrate_ST;
    }
    if(req.body.salary!=null){
        res.user.salary=req.body.salary;
    }
    if(req.body.active!=null){
        res.user.active=req.body.active;
        if (req.body.active==false){
            res.user.Status="Pending";
            res.user.StatusBg="#FEC90F";
        }
        else{
            res.user.Status="Active";
            res.user.StatusBg="#8BE78B";
            var approveduserMail = {
                from: 'appsdny@gmail.com',
                to: res.user.email,
                subject: 'Tier1Integrity || Onboarding process approved||',
                text: `Hi ${res.user.fullname},
Congratulations your profile has been approved at Tier1Integrity.
              
Thank you 
Team Tier1Integrity`      
              };
              transporter.sendMail(approveduserMail, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
        }
    }
    if (req.body.Status!=null){
        var patchMail = {
            from: 'appsdny@gmail.com',
            to: res.user.email,
            subject: 'Tier1Integrity - Profile Status',
            text: `Hi ${res.user.fullname},
Your request to remove your profile from our database has been initiated.
          
* Confidential *

Thank you 
Team Tier1Integrity`      
          };
          transporter.sendMail(patchMail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.user.Status=req.body.Status;
        res.user.StatusBg=req.body.StatusBg;
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


router.get('/dashboardUserState/get',async (req,res)=>{
    console.log("hi");
    try{
        let branch1_active=0;
        let branch2_active=0;
        let branch3_active=0;
        let branch4_active=0;
        let branch5_active=0;
        const branch1=await usermodel.find({empBranch:"Pasadena, TX 77506"});
        branch1.forEach(reasult=>{
            if(reasult.active){
                branch1_active=branch1_active+1;
            };
        });
        const branch2=await usermodel.find({empBranch:"Nederland, TX 77627"});
        branch2.forEach(reasult=>{
            if(reasult.active){
                branch2_active=branch2_active+1;
            };
        });
        const branch3=await usermodel.find({empBranch:"Snyder, TX 79549"});
        branch3.forEach(reasult=>{
            if(reasult.active){
                branch3_active=branch3_active+1;
            };
        });
        const branch4=await usermodel.find({empBranch:"Angleton, TX 77515"});
        branch4.forEach(reasult=>{
            if(reasult.active){
                branch4_active=branch4_active+1;
            };
        });
        const branch5=await usermodel.find({empBranch:"Port Lavaca, TX 77979"});
        branch5.forEach(reasult=>{
            if(reasult.active){
                branch5_active=branch5_active+1;
            };
        });
        const active=branch1_active+branch2_active+branch3_active+branch4_active+branch5_active;
        const notactive=(branch1.length+branch2.length+branch3.length+branch4.length+branch5.length)-active;
        res.json({totaluser:notactive+active,branch1:branch1.length,branch1_active:branch1_active,branch2:branch2.length,branch2_active:branch2_active,branch3:branch3.length,branch3_active:branch3_active,branch4:branch4.length,branch4_active:branch4_active,branch5:branch5.length,branch5_active:branch5_active, active:active,notactive:notactive})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


router.get('/dashboardUserState/get/:date',async (req,res)=>{
    console.log(">>"+req.params.date);
    try{
        let cc1=0;
        let cc2=0;
        let cc3=0;
        let cc4=0;
        let cc5=0;
        const alluser=await usermodel.find();
        alluser.forEach(element=>{
            console.log(element.empBranch);
            console.log(element.onBoardingDate);
            if(element.empBranch=="Pasadena, TX 77506" && element.onBoardingDate==req.params.date){
                console.log("found");
                cc1=cc1+1;
            }
            else if(element.empBranch=="Nederland, TX 77627" && element.onBoardingDate==req.params.date){
                cc2=cc2+1;
            }
            else if(element.empBranch=="Snyder, TX 79549" && element.onBoardingDate==req.params.date){
                cc3=cc3+1;
            }
            else if(element.empBranch=="Angleton, TX 77515" && element.onBoardingDate==req.params.date){
                cc4=cc4+1;
            }
            else if(element.empBranch=="Port Lavaca, TX 77979" && element.onBoardingDate==req.params.date){
                cc5=cc5+1;
            }
        });
        
        res.json([
            { month: 'HOU', sales: cc1, color: 'white' }, { month: 'SNY', sales: cc3, color: 'white' },
            { month: 'NED', sales: cc2, color: 'white' }, { month: 'ANG', sales: cc4, color: 'white' },
            { month: 'PLV', sales: cc5, color: 'white' }
        ])
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
//get all user
router.get('/dashboardUserState/getall',async (req,res)=>{
    try{
        const users=await usermodel.find();
        res.json(users)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.delete("/:id",async (req,res)=>{
    console.log(req.params.id)
    user=await usermodel.findById(req.params.id)
        if(user==null){
            return res.status(404).json({message:"User unavailable!"})
        }
    var regestereduserMail = {
        from: 'appsdny@gmail.com',
        to: user.email,
        subject: 'Tier1Integrity - Profile Status',
        text: `Hi ${user.fullname},
Your profile has been successfully removed from our database.
      
* Confidential *
      
Thank you 
Team Tier1Integrity`      
      };
    const reasult= await usermodel.deleteOne({_id: new mongodb.ObjectId(req.params.id)})

    try{
        transporter.sendMail(regestereduserMail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.json(reasult)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.patch('/forgotpassword/:email',async (req,res)=>{
    let user=await usermodel.findOne({"email":req.params.email})
    if(user==null){
        return res.status(404).json({message:"User unavailable!"})
    }
    console.log(req.params.email)
    //hash the password
    const salt= await bcrypt.genSalt(10);
    const hashedpassword= await bcrypt.hash(req.body.password,salt);
    var regestereduserMail = {
        from: 'appsdny@gmail.com',
        to: req.params.email,
        subject: 'Tier1Integrity - Password Changed Successfully',
        text: `Hello ${user.fullname},
Your Password has been changed successfully.

* If you didnt change the password please contact Admin Support Team *
      
Thank you 
Team Tier1Integrity`      
      };
    try{
        transporter.sendMail(regestereduserMail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        user.password=hashedpassword
        let newuser= await user.save();
        res.status(200).json({message: "Success"})
    }catch(error){
        res.status(500).json({message: error.message})
    }


})

router.get('/forgotpassword/:email',async (req,res)=>{
    console.log(req.params.email)
    let otp=Math.floor(100000 + Math.random() * 900000)
    console.log("OTP: "+otp);
    var regestereduserMail = {
        from: 'appsdny@gmail.com',
        to: req.params.email,
        subject: 'Tier1Integrity - OTP for Password Change',
        text: `Use the below one time password to reset your password.
${otp}

* Confidential *
      
Thank you 
Team Tier1Integrity`      
      };
      try{
        transporter.sendMail(regestereduserMail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.json(otp)
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