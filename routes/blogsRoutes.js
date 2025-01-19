import express from "express"
import {createBlogs, getAllBlogs , getBlogBySlug} from "../controllers/blogsController.js"
export const router = express.Router()
import {upload} from "../utils/multerConfig.js"

router.get("/:page" , getAllBlogs)
router.get("/:slug" , getBlogBySlug)
router.post("/createnew" , upload.single("file") ,  createBlogs)

// module.exports = {router}