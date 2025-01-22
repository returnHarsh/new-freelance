import express from "express";
import {getAllContacts , registerContact} from "../controllers/contactController.js"

export const router = express.Router();

router.get("/:page" , getAllContacts);
router.post("/register" , registerContact )
