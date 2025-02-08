import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema({
	name : {type : String},
	clinicAddress : {type : String},
	time : {type : String},
	date : {type : Date},
	service : {type : String},
	phone : {type : String , required : true},
	email : {type : String , required : false},
	message : {type : String , required : false}
} , {timestamps : true})

export const Contact = mongoose.model("contacts" , contactSchema);