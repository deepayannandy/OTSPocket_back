require("dotenv").config()

const https= require("https");
var cors = require('cors');
const fs= require("fs");
const path= require("path");
const express= require("express");
const app= express();
const mongoos=require("mongoose");
const aws =require('aws-sdk');
const { crypto, randomBytes } =require('crypto');

const region=process.env.region;
const bucketName=process.env.bucketName;
const accessKeyId=process.env.accessKeyId;
const secretAccessKey=process.env.secretAccessKey;

const s3= new  aws.S3 ({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion:'v4',
})

mongoos.connect(process.env.DATABASE_URL)
const db= mongoos.connection
db.on('error',(error)=> console.error(error))
db.once('open',()=> console.log('Connected to Database!'))


app.use(express.json())
app.use(cors());

const userRouter= require("./routes/user_auth")
const branchOfficeRouter= require("./routes/brachoffice")
const consumeablesRouter= require("./routes/consumeables.js")
const equipmentsRouter= require("./routes/equipements.js")
const timeCardRouter= require("./routes/timeCard.js")
const customersRouter= require("./routes/customers.js")
const poRouter= require("./routes/po.js")
const woRouter= require("./routes/wo.js")
const lrRouter= require("./routes/laborRate")
const csrRouter= require("./routes/customerrate")
const reportRouter= require("./routes/reportdata")
const pcRouter= require("./routes/paycycle")

app.use("/api/user",userRouter)
app.use("/api/branchoffice",branchOfficeRouter)
app.use("/api/consumeables",consumeablesRouter)
app.use("/api/equipements", equipmentsRouter)
app.use("/api/timecard",timeCardRouter)
app.use("/api/customer",customersRouter)
app.use("/api/po",poRouter)
app.use("/api/wo",woRouter)
app.use("/api/lr",lrRouter)
app.use("/api/csr",csrRouter)
app.use("/api/report",reportRouter)
app.use("/api/paycycle",pcRouter)

const sslServer=https.createServer(
    {
        key:fs.readFileSync(path.join(__dirname, 'cert','key.pem')),
        cert:fs.readFileSync(path.join(__dirname, 'cert','cert.pem')),
    },app
)

sslServer.listen(3443,()=> console.log("https Server is listning!"))

app.get('/s3url/:name',async (req,res)=>{
    console.log(req.params.name)
    const imagename=req.params.name
    
    const params=({
        Bucket:bucketName,
        Key:imagename,
        Expires:60,
    })
    const uploadUrl=await s3.getSignedUrlPromise('putObject',params)
    res.send({uploadUrl})
})
app.listen(6622,()=>{
    console.log("Http Server is listning!")
})