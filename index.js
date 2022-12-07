require("dotenv").config()

const https= require("https");
const fs= require("fs");
const path= require("path");
const express= require("express");
const app= express();
const mongoos=require("mongoose");


mongoos.connect(process.env.DATABASE_URL)
const db= mongoos.connection
db.on('error',(error)=> console.error(error))
db.once('open',()=> console.log('Connected to Database!'))


app.use(express.json())

const userRouter= require("./routes/user_auth")
const branchOfficeRouter= require("./routes/brachoffice")
const consumeablesRouter= require("./routes/consumeables.js")
const equipmentsRouter= require("./routes/equipements.js")
const timeCardRouter= require("./routes/timeCard.js")
const customersRouter= require("./routes/customers.js")

app.use("/api/user",userRouter)
app.use("/api/branchoffice",branchOfficeRouter)
app.use("/api/consumeables",consumeablesRouter)
app.use("/api/equipements", equipmentsRouter)
app.use("/api/timecard",timeCardRouter)
app.use("/api/customer",customersRouter)


const sslServer=https.createServer(
    {
        key:fs.readFileSync(path.join(__dirname, 'cert','key.pem')),
        cert:fs.readFileSync(path.join(__dirname, 'cert','cert.pem')),
    },app
)

sslServer.listen(3443,()=> console.log("https Server is listning!"))

app.listen(6622,()=>{
    console.log("Server is listning!")
})