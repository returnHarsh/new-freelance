import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
	code : {type : String , required : true}
},{timestamps : true})

export const Code = mongoose.model("codes" , codeSchema);