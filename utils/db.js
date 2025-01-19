import mongoose from "mongoose";

const ConnectDB = async()=>{
	try{
		const uri = process.env.MONGO_CONNECT_URI
		const connect = await mongoose.connect(uri)
		console.log("Database connected")

	}catch(err){
		console.log("error in connecting to db " , err.message)
	}
}

export default ConnectDB