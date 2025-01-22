import mongoose, { Schema } from "mongoose";

const authSchema = new Schema({
	name : {type : String , required : true},
	email : {type : String , required : true},
	password : {type : String , required : true},
} , {timestamps : true})

export const Auth = mongoose.model("auths" , authSchema)