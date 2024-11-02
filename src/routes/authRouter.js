const express = require('express');
const validateSignUpData = require('../utils/validation');
const User = require("../model/user");
const  bcrypt  = require("bcrypt");

const router = express.Router();

router.post("/signup", async(req,res)=>{
    // console.log(req.body);
    //     // Validation of data
        try{
            validateSignUpData(req);
        // Encrypt password
    
        const {firstName, lastName, emailId,password} = req.body;
    
        const passwordHash = await bcrypt.hash(password, 10);
        // console.log(passwordHash);
        
        
    
    
    
    
        //creating a new instance of the user model
        const user = new User({
            firstName, 
            lastName, 
            emailId,
            password:passwordHash});
       
        await user.save();
        res.send("User Added Succesfully");
       }
       catch(err){
        res.status(400).send("Error in saving the user details...." + err.message);
       }
    });


    router.post("/login", async(req,res) => {
        try {
            const { emailId, password } = req.body;
            const user = await User.findOne({emailId : emailId});
            
            if(!user){
                throw new Error("Invalid Credential");
            }

            const isPassword = await bcrypt.compare(password, user.password);

            if(isPassword){
                const token = await user.getJWT();
                res.cookie("token", token,{
                    expires: new Date(Date.now() + 3600000),
                });
    
                return res.status(200).json({ user });
            }
            else {
                return res.status(401).json({ message: "Incorrect password" });
            }

            }
           catch (err) {
            res.status(400).send(err.message);
            
        }
    });

    router.post("/logout", async(req,res) => {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        });
        res.send("Logout Successful");
    })



    module.exports = router;