import express from "express"
const app = express()
import dotenv from "dotenv"
dotenv.config()
import ConnectDB from "./utils/db.js";
import {router as blogRouter} from "./routes/blogsRoutes.js"
import {router as galleryRouter} from "./routes/galleryRoutes.js"
import {router as contactRouter} from "./routes/contactRoutes.js" 
import {router as adminRouter} from "./routes/adminRoutes.js" 
import cookieParser from "cookie-parser";
import cors from "cors"
// const nodemailer = require("nodemailer");

const PORT = process.env.PORT || 8080

// cors middleware
app.use(cors({
	origin : "http://localhost:3000",
	credentials : true
}))

// setting the nodemailer
// const transporter = nodemailer.createTransport({
// 	service: "gmail",
// 	auth: {
// 	  user: "your-email@gmail.com", // Replace with your email
// 	  pass: "your-email-password", // Use an app password instead of your main password
// 	},
//   });
  

// connecting our server to the DB
ConnectDB()

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())


// routing middlewares
app.use("/blogs" , blogRouter)
app.use("/gallery" ,galleryRouter)
app.use("/contact" , contactRouter)
app.use("/admin" , adminRouter)


app.listen(PORT , ()=>{
	console.log(`Server online on port ${PORT}`)
})