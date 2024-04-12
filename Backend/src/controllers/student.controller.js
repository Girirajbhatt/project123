import { asyncHandler } from "../utils/asyncHandler.js";
import { Faq } from "../models/faq.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js"
import { Student } from "../models/student.model.js";
import { Admin } from "../models/admin.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Company } from "../models/company.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async(studentId) =>{
    try {
        const student = await Student.findById(studentId)
        const accessTokens = student.generateAccessToken()
        const refreshTokens = student.generateRefreshToken()
        student.refreshTokens = refreshTokens
        await student.save({ validateBeforeSave: false })

        return {accessTokens, refreshTokens}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
}

const getAllFAQs = asyncHandler(async (req, res) => {
    try {
        const faqs = await Faq.find();
        return res.status(200).json(new ApiResponse(200, "Fetched all FAQs successfully", { faqs }));
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

const loginStudent = asyncHandler(async (req, res) =>{

    const {email,password} = req.body

    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    const student = await Student.findOne({email})

    if (!student) {
        throw new ApiError(404, "Student does not exist")
    }

   const isPasswordValid = await student.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid student password")
    }

   const {accessTokens, refreshTokens} = await generateAccessAndRefreshTokens(student._id)

    const loggedInStudent = await Student.findById(student._id).select("-password -refreshTokens")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessTokens", accessTokens, options)
    .cookie("refreshTokens", refreshTokens, options)
    .json(
        new ApiResponse(
            200, 
            {
                student: loggedInStudent, accessTokens, refreshTokens,
            },
            "Student logged In Successfully"
        )
    )

})

const logoutStudent = asyncHandler(async(req, res) => {
    await Student.findByIdAndUpdate(
        req.student._id,
        {
            $unset: {
                refreshTokens: 1 
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessTokens", options)
    .clearCookie("refreshTokens", options)
    .json(new ApiResponse(200, {}, "Student logged Out"))
})

const refreshAccessTokens = asyncHandler(async (req, res) => {
    const incomingRefreshTokens = req.cookies.refreshTokens || req.body.refreshTokens

    if (!incomingRefreshTokens) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshTokens,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const student = await Student.findById(decodedToken?._id)
    
        if (!student) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshTokens !== student?.refreshTokens) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessTokens, newRefreshTokens} = await generateAccessAndRefreshTokens(student._id)
    
        return res
        .status(200)
        .cookie("accessTokens", accessTokens, options)
        .cookie("refreshTokens", newRefreshTokens, options)
        .json(
            new ApiResponse(
                200, 
                {accessTokens, refreshTokens: newRefreshTokens},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword,confirmPassword} = req.body

    if (!(newPassword === confirmPassword)){
        throw new ApiError(400,"New password and confirm password must be same")
    }

    const student = await Student.findById(req.student?._id)
    const isPasswordCorrect = await student.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    student.password = newPassword
    await student.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentStudent = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.student,
        "Student fetched successfully"
    ))
})

const getCompanyDetails = asyncHandler(async(req, res) => {
    const companies = await Company.find({});
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        companies,
        "Company details fetched successfully"
    ))
});




export { 
    getAllFAQs,
    loginStudent,
    logoutStudent,
    refreshAccessTokens,
    changeCurrentPassword,
    getCurrentStudent,
 };
