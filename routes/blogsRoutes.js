import express from "express"
import {createBlogs, deleteBlog, getAllBlogs , getAllBlogsAtOnce, getBlogBySlug} from "../controllers/blogsController.js"
export const router = express.Router()
import {upload} from "../utils/multerConfig.js"

// test to send all blogs at once

router.get("/" , getAllBlogsAtOnce);
// router.get("/:page" , getAllBlogs)
router.get("/:slug" , getBlogBySlug)
router.post("/delete" , deleteBlog)
router.post("/createnew" , upload.single("file") ,  createBlogs)

// module.exports = {router}