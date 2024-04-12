import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const adminSchema = new Schema({
    adminName: { 
        type: String, 
        required: [true, "Coordinator name is required"] ,
        lowercase : true,
        trim : true,
        index : true,
    },
    email: { 
        type: String, 
        required: [true, "Coordinator email is required"] ,
        unique: [true, "Coordinator already exists"],
        lowercase : true,
        trim : true,
        index : true,
    },
    password: { 
        type: String, 
        required: [true, "Password field should not be empty"] ,
    },
    contactNo: { 
        type: Number, 
        required: [true, "Contact Number field should not be empty"] ,
        unique: [true, "Contact Number already exists"],
    },
    designation : { 
        type: String,
        required: [true, "Designation field should not be empty"] ,
    },
    image: {// cloudinary url
        type: String,
    },
    refreshTokens: {
        type: String,
    },
},{timestamps : true});


adminSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

adminSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            adminName : this.adminName,
            email: this.email,
            contactNo: this.contactNo,
            designation: this.designation,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
adminSchema.methods.generateRefreshToken = function(){
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

export const Admin = mongoose.model("Admin",adminSchema);