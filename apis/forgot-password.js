import express from 'express'
import { db } from '../mongodb/mongodb-connect.js'
import { transporter,mailOptions } from './mail-utils.js'
import dotenv from 'dotenv'
dotenv.config()
const forgotPasswordRouter = express.Router()
forgotPasswordRouter.post("/",async(req,res)=>{
    const userData = req.body
     const collection = db.collection("users")
        const userObj = await collection.findOne({email:userData.email})
    try {
       if(userObj){
        await collection.updateOne({email:userData.email},{$set:{otp:Math.floor(100000 + Math.random() * 900000)}})
        const get_otp = await collection.findOne({email:userData.email})
              await transporter.sendMail({
                ...mailOptions,
                to:userData.email,
                subject:"Password reset",
                text:
                `Hi!! ${get_otp.name}!!,
              otp: ${get_otp.otp}
              Enter your otp here,
              ${process.env.FE_URL}/get-otp?email=${get_otp.email}`,
              })
              res.send({msg:"Email sent successfully",code:1})
       }
       else{
          res.status(404).send({message:'you are not user',code:0})
       }
    } catch (error) {
      console.log(error)
        res.status(500).send("Something went wrong")
    }
})
export default forgotPasswordRouter;