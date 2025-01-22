import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema({
	name : {type : String},
	phone : {type : String , required : true},
	email : {type : String , required : false},
	address : {type : String , required : false}
} , {timestamps : true})

export const Contact = mongoose.model("contacts" , contactSchema);