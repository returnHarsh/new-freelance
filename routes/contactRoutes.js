import express from "express";
import {deleteAppointment, getAllContacts , getAllContactsAtOnce, registerContact} from "../controllers/contactController.js"

export const router = express.Router();

router.post("/register" , registerContact )
// router.get("/:page" , getAllContacts);
router.get("/" , getAllContactsAtOnce)
router.delete("/delete/:_id" , deleteAppointment)