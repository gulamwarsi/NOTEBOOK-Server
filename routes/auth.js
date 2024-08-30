const express = require("express");
const User = require("../models/User");
const bcrypt=require("bcryptjs")
const router = express.Router();
const { body, validationResult } = require("express-validator");
var jwt =require('jsonwebtoken')
//create a user using post "/api/auth".Does'nt require Auth . No login required
var fetchUser=require("../middleware/fetchuser")
const JWT_SCERET = 'Sarifisagoodb$oy'
//Route 1
router.post(
  "/createUser",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password", "Password must be atleast 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false
    // if there are error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    // check wheather the user with this email exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, errors: "sorry a user with this email is already exist" });
      }
      const salt= await bcrypt.genSalt(10)
     const secPass= await bcrypt.hash(req.body.password, salt)
      //create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data={
        user:{
          id:user.id
        }
      }
      const authtoken=jwt.sign(data, JWT_SCERET)
    
      //res.json(user)
      success=true
      res.json({success,authtoken})
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//Authenticate a user using:Post "api/auth/sign. No login rquired"
//Route 2
router.post(
  "/login",
  [
    body("email",'Enter a valid email').isEmail(),
    body("password",'Password can not be blank').exists(),
  ],async(req,res)=>{
    let success=false
    // if there are error  return Bad request and the error
    const errors=validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password}=req.body
    try{
      let user= await User.findOne({email})
      if(!user){
        success=false
        return res.status(400).json({error:"Please try to login with correct credentials"})
      }
      const passwordcompare= await  bcrypt.compare(password, user.password)
      if(!passwordcompare){
        success=false
        return res.status(400).json({error:"Please try to login with correct credentials"})
      }
      const payload={
        user:{
          id:user.id
        }
      }
      const authtoken=jwt.sign(payload, JWT_SCERET)
      success=true
      res.json({success,authtoken})

    } catch (error) {
      console.error(error.message);
      res.status(500).send(" Internal server error occured");
    }
  })
  //Route 3  Get loggdin User Details using "Post" /api/auth/getUser .login required
  router.post(
    "/getUser",fetchUser,async(req,res)=>{
try{  
  userId=req.user.id
  const  user= await User.findById(userId).select("-password")
  res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send(" Internal server error occured");
    }
  })
 


module.exports = router;