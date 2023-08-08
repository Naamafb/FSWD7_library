// Importing express module
const express=require("express")
const router=express.Router()

// Handling request using router
router.get("/",(req,res,next)=>{
	res.send("This is the homepage request")
})

// Importing the router
module.exports=router
