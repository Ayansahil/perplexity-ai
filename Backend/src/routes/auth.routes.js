import { Router } from "express";
import { register, verifyEmail, login, getMe, updateProfile, changePassword, logout } from "../controllers/auth.controller.js";
import {registerValidator ,loginValidator} from "../validator/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const authRouter = Router();


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", authLimiter, registerValidator, register)


/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email, password }
 */
authRouter.post("/login", authLimiter, loginValidator, login)


/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user's details
 * @access Private
 */
authRouter.get('/get-me', authUser, getMe)


/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query { token }
 */
authRouter.get('/verify-email', verifyEmail)

/**
 * @route PATCH /api/auth/update-profile
 * @desc Update username / email
 * @access Private
 */
authRouter.patch('/update-profile', authUser, updateProfile)

/**
 * @route PATCH /api/auth/change-password
 * @desc Change password
 * @access Private
 */
authRouter.patch('/change-password', authUser, changePassword)

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
authRouter.post('/logout', authUser, logout)

export default authRouter;
