import { Router } from "express";
import { register } from "../controllers/auth.controller";
import {registerValidator} from "../validator/auth.validator";

const authRouter = Router();


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register",registerValidator,register)

export default authRouter;
