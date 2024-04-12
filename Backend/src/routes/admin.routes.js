import {Router} from "express";
import {createFAQ, registerStudent, addCompany} from "../controllers/admin.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/admin.middleware.js";

const router = Router()

router.route("/createFaq").post(verifyJwt, createFAQ);
router.route("/registerStudent").post(verifyJwt, upload.fields([
    {
        name : "resume",//name should be same as frontend
        maxCount : 1,
    }
]), registerStudent);

router.route("/addCompany").post(verifyJwt, upload.fields([
    {
        name : "logo",//name should be same as frontend
        maxCount : 1,
    }
]), addCompany);

export default router