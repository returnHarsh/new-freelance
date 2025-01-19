import {Gallery} from "../models/gallery.js";
import { putObjectUrl } from "../utils/uploadInS3.js";
import axios from "axios"

export const getAllGalleries = async(req,res)=>{
	try{
		const {page} = req.params;
		const pageNumber = parseInt(page , 10) || 1
		const numberOfGalleriesPerPage = 10
		const skip = (pageNumber-1) * numberOfGalleriesPerPage
		const galleries = await Gallery.find({}).skip(skip).limit(numberOfGalleriesPerPage).lean();
		if(!galleries.length) return res.json({success : false , message : "no galleries found" })
	}catch(err){
		console.log("error in getAllGalleries " , err.message)
	}
}

export const createAGallery = async(req,res)=>{
	try{
		const image = req.file;
		const {des} = req.body;
		if(!image || !des) return res.json({success : false , message : "all fields are required"})

		// now we need to upload the image into s3
		const response = await putObjectUrl("freelance-gallery")

		await axios({
			url : response.url,
			method : "put",
			data : image.buffer,
			headers: {
				"Content-Type": image.mimetype, // Explicitly set Content-Type
			  },
		})
		const gallery = await Gallery.create({
			galleryImageName : response.fileName,
			galleryImageUrl : `https://freelance-gallery.s3.ap-south-1.amazonaws.com/${response.fileName}`,
			des
		})

		return res.json({success : true , message : "gallery is uploaded" , data : gallery})

	}catch(err){
		console.log("error in createAGallery " , err.message )
	}
}

export const editGallery = async(req,res)=>{
	try{
		const image = req.file;
		const {des , _id} = req.body;

		const gallery = await Gallery.findById(_id);
		if(!gallery) return res.json({success : false , message : "No gallery with this id exists"})

		if(image){
			// here we have to reupload the image
		const response = await putObjectUrl("freelance-gallery")

		await axios({
			url : response.url,
			method : "put",
			data : image.buffer,
			headers: {
				"Content-Type": image.mimetype, // Explicitly set Content-Type
			  },
		})

		gallery.galleryImageName = response.fileName
		gallery.galleryImageUrl =  `https://freelance-gallery.s3.ap-south-1.amazonaws.com/${response.fileName}`
		}

		gallery.des = des || gallery.des

		return res.json({success : true , message : "Gallery is being updated" , data : gallery})


	}catch(err){
		console.log("error in editGallery " , err.message)
	}
}
