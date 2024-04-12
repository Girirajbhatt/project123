import mongoose,{Schema} from "mongoose";

const faqSchema = new Schema({
    question : {
        type : String,
        required : [true,"Question field is required"]
    },
    answer : {
        type : String,
        required : [true,"Answer field is required"]
    }
})

export const Faq = mongoose.model("Faq",faqSchema);
