import express from "express";
import {createAGallery , getAllGalleries} from "../controllers/galleryController.js"
import { upload } from "../utils/multerConfig.js";

export const router = express.Router();

router.post("/upload" , upload.single("file") , createAGallery);
router.get("/all/:page")

