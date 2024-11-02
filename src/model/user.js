const mongoose = require("mongoose");
const validator = require("validator");
const Jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        minLength:3,
        maxLength: 25,
        
    },
    lastName: {
        type: String,
    },
    emailId:{
        type:String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email: " + value);
            }

        }

    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is weak: " + value);
            }

        }
    },
    age : {
        type:Number,
        min:18,

    },
    photoUrl: {
        type: String,
    },

},
    {
        Timestamp: true,
    }
);
userSchema.methods.getJWT = async function() {
    const user  = this;
    const token = await Jwt.sign({_id:user._id}, "Adnan@2409", {
        expiresIn: "7d",
    });
    return token;
};

module.exports = mongoose.model("User", userSchema);

