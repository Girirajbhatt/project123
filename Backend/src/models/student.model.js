import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const studentSchema = new Schema({
    email: { 
        type: String, 
        required: [true, "College Email is required"] ,
        unique: [true, "College Email already exists"],
        lowercase : true,
        trim : true,
        index : true,
    },
    password: {
        type: String, 
        required: [true, "Password is required"] ,
    },
    resume: { // resume url cloudinary
        type: String,
        required : true,
        unique : true,
    },
    refreshTokens: { 
        type: String,
    },
  },{ timestamps : true });
  
studentSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

studentSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

studentSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

studentSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id, 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Student = mongoose.model("Student",studentSchema);