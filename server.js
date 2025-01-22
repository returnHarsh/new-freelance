import express from "express"
const app = express()
import dotenv from "dotenv"
dotenv.config()
import ConnectDB from "./utils/db.js";
import {router as blogRouter} from "./routes/blogsRoutes.js"
import {router as galleryRouter} from "./routes/galleryRoutes.js"
import {router as contactRouter} from "./routes/contactRoutes.js" 


const PORT = process.env.PORT || 8080

// connecting our server to the DB
ConnectDB()

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended : true}))


// routing middlewares
app.use("/blogs" , blogRouter)
app.use("/gallery" ,galleryRouter)
app.use("/contac" , contactRouter)


app.listen(PORT , ()=>{
	console.log(`Server online on port ${PORT}`)
})