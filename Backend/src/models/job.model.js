import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const jobSchema = new Schema({
    companyId: { 
        type: Schema.Types.ObjectId, 
        ref : "Company"
    },
    passOutBatch : {
        type: String, 
        required: [true, "Pass-out batch field should not be empty"],
        index : true ,
    },
    profile : {
        type: String, 
        required: [true, "Job profile field should not be empty"] ,
        lowercase : true,
        trim : true,
    },
    description: {
        type: String, 
        required: true, 
    },
    duration : {
        type: String, 
        required: [true, "Duration field should not be empty"] ,
        trim : true,
    },
    type : {
        type: String, 
        required: [true, "Job type must be selected"] ,
        enum : ["Full Time","Part Time","Contract"]
    },
    requirements: { 

    },
    location: { 
        type: String, 
        required: [true, "Location field should not be empty"] ,
        lowercase : true,
        trim : true,
    },
    packageDetails : {

    },
    selectionProcess : {

    },
    deadline: { 
        type: Date, 
        required: true,
        // default : Date.now(), 
    },
},{ timestamps : true });

jobSchema.plugin(mongooseAggregatePaginate);

export const Job = mongoose.model("Job",jobSchema);