import express from 'express'
import { db } from '../mongodb/mongodb-connect.js'


const checkOtpRouter= express.Router()
checkOtpRouter.post('/',async(req,res)=>{
    const userData = req.body
    const entered_otp = userData.otp
     const userObj = await db.collection('users').findOne({email:userData.email})
     const actual_otp = userObj.otp
     try {
          if(entered_otp == actual_otp){
            res.send({message:'otp get successfully',code:1,email:userObj.email})
            await db.collection('users').updateOne({email:userData.email},{$unset:{otp:''}})
     }
     else{
        res.send({message:'Your otp is incorrect',code:0})
     }
     } catch (error) {
        res.send({message:'Something went wrong'})
     }
   


})
export default checkOtpRouter;