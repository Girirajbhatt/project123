import {Router} from "express";
import {getAllFAQs, loginStudent, logoutStudent, refreshAccessTokens} from "../controllers/student.controller.js"
import { verifyJWT } from "../middlewares/student.middleware.js";

const router = Router()

router.route("/getFaqs").get(getAllFAQs);
router.route("/loginStudent").post(loginStudent);

router.route("/logoutStudent").post(verifyJWT,logoutStudent);
router.route("/refresh-token").post(refreshAccessTokens)

export default router