import express from "express";
import {createAGallery , deleteGallery, getAllGalleries, getAllTheGalleries} from "../controllers/galleryController.js"
import { upload } from "../utils/multerConfig.js";

export const router = express.Router();

router.get("/" , getAllTheGalleries)
router.post("/upload" , upload.single("file") , createAGallery);
router.get("/all/:page" , getAllGalleries)
router.delete("/delete/:_id" , deleteGallery);

