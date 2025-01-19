import mongoose, { Schema } from "mongoose";


const gallerySchema = new Schema({
	galleryImageName : {
		type : String,
		requried : true
	},
	galleryImageUrl : {
		type : String,
		required : true
	},
	des : {
		type : String,
		required : true
	}
} , {timestamps : true})

export const Gallery = new mongoose.model("gallery" , gallerySchema);