import express from "express"
import { changeSecretCode, loginUser, logout, registerUser } from "../controllers/authController.js";
export const router = express.Router();

router.post("/register" , registerUser)
router.post("/login" ,  loginUser)
router.post("/change/secret-code" , changeSecretCode)
router.post("/logout" , logout)