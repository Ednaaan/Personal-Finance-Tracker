const User = require("../model/user");
const Jwt = require("jsonwebtoken");

const userAuth = async(req,res,next)=>{
    //Read the token from the req cookies
  try {
    const{token} = req.cookies;
    if(!token){
       return res.status(401).send("Please Login");
    }
    const decodeObj = await Jwt.verify(token, "Adnan@2409");

    const {_id} = decodeObj;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("Usernot found");
    }
    req.user = user;
    next();
    
  } catch (err) {
    res.status(400).send("Error:" + err.message);
    
  }



}

module.exports={
    userAuth,
};