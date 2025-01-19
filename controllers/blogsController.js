import Blogs from "../models/blogs.js";
import {getObjectUrl  , putObjectUrl} from "../utils/uploadInS3.js"
import axios from "axios";

export const getAllBlogs = async(req,res)=>{
	try{
		const{page} = req.params
		const numberOfBlogsPerPage = 10;
		const pageNumber = parseInt(page, 10) || 1;
		const skip = (pageNumber - 1) * numberOfBlogsPerPage;

		// with this approach sending only 10 blogs according to the page number
		const allBlogs = await Blogs.find({}).skip(skip).limit(numberOfBlogsPerPage).lean();
		if(!allBlogs.length) return res.json({success : true , message : "No blogs found"})

		// now after fetching all the blogs we have to do pagination
		return res.json({success : true , message : "Blogs found" , data : allBlogs})
	}catch(err){
		console.log("error in get all blogs " , err.message)
	}
}

export const getBlogBySlug = async(req,res)=>{
	try{
		const{slug} = req.params
		const getBlogBySlug = Blogs.findOne({slug}).lean();
		if(!getBlogBySlug) return res.json({success : false , message : "No Blog found with this slug"})
		return res.json({success : true , message : "Blog found with this slug" , data : getBlogBySlug})
	}catch(err){
		console.log("error in getBlogBySlug " , err.message)
	}
}

export const createBlogs = async(req,res)=>{
	try{
		const coverImage = req.file
		const{  title , slug , metaTitle , metaDescription , content} = req.body;
		if(!title || !slug || !metaTitle || !metaDescription || !content.length) return res.json({success : false , message : "all fields are required"})
		
		// we need to check if , for this slug if any blog exists previously or not
		const isBlogexists = await Blogs.findOne({slug});
		if(isBlogexists) return res.json({success : false , message : "A blog with this slug already exists."});
		
		if(coverImage){
			console.log("Cover image is uploaded")
			const coverImageUploadUrl = await putObjectUrl("freelance-blogs");
			// now we get the put object url for uploading the image
             await axios({
				url : coverImageUploadUrl.url,
				method : "put",
				data : coverImage.buffer,
				headers: {
					"Content-Type": coverImage.mimetype, // Explicitly set Content-Type
				  },
			})
		}

		const blog = await Blogs.create({
			slug,
			metaDescription,
			metaTitle,
			title,
			content,
		})
		if(coverImage) {
			blog.coverImage = coverImageUploadUrl.fileName
			blog.url = `https://freelance-blogs.s3.ap-south-1.amazonaws.com/${coverImage.fileName}`
			await blog.save();
		}

		return res.json({success : true , message : "blog is created" , data : blog})
		
	}catch(err){
		console.log("error in createBlogs " , err.message)
	}
}

export const editBlogs = async(req,res)=>{
	try{
		const{  title , slug , metaTitle , metaDescription , content , _id} = req.body;
		const coverImage = req.file

		if(!_id) return res.json({success : false , message : "please enter the id to search the blog"})
		const blog = await Blogs.findById(_id);
		if(!blog) return res.json({success : false , message : "No blog with this slug exists"});

		if(slug){
			const isThisSlugAlreadyexists = await Blogs.findOne({slug}) 
			if(isThisSlugAlreadyexists) return res.json({success : false , message : "This slug already exists"});
		}
		
		blog.slug = slug || blog.slug
		blog.title = title || blog.title
		blog.metaDescription = metaDescription || blog.metaDescription
		blog.title = title || blog.title
		blog.metaTitle = metaTitle || blog.metaTitle
		blog.content = content || blog.content

		await blog.save();
		return res.json({success : false , message : "blogs updated successfully" , data : blog});

	}catch(err){
		console.log("error in editBlgs" , err.message)
	}
}

export const uploadCoverImage = async(req,res)=>{
	try{
		
	}catch(err){
		console.log("error in uploadCoverImage " , err.message)
	}
}