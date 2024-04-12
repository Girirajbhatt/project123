import mongoose, {Schema} from "mongoose";

const companySchema = new Schema({
    name: { 
        type: String, 
        required: [true, "Company  name field should not be empty"] ,
        unique: [true, "Company already exists"],
        trim : true,
        index : true,
    },
    siteUrl : {
        type: String, 
        required: [true, "Site URL is required"] ,
        unique : [true, "Site already exists"],
        trim : true,
    },
    type : {
        type: String, 
        required: [true, "Company type is required"] ,
    },
    contactNo: {
        type: String, 
        required: [true, "Contact Number field should not be empty"],
        unique : true,
    },
    logo: {
        type: String, 
        required: true ,
        unique : true,
    },
    address: { 
        type: String, 
        required: [true," Address field should not be empty"],
        lowercase : true,
        trim : true,
    },
    description : {
        type : String,
        required : [true,"Company Description should not be empty"]
    },
    email: { 
        type: String, 
        required: [true, "Company Email is required"] ,
        unique: [true, "Company already exists"],
        lowercase : true,
        trim : true,
    },
}, { timestamps : true });

export const Company = mongoose.model("Company",companySchema);