require("dotenv").config()

const express= require("express");
const app= express()
const mongoos=require("mongoose");

mongoos.connect(process.env.DATABASE_URL)
const db= mongoos.connection
db.on('error',(error)=> console.error(error))
db.once('open',()=> console.log('Connected to Database!'))


app.use(express.json())

const userRouter= require("./routes/user")
const branchOfficeRouter= require("./routes/brachoffice")

app.use("/user",userRouter)
app.use("/branchoffice",branchOfficeRouter)

app.listen(6622,()=>{
    console.log("Server is listning!")
})