import Blogs from "../models/blogs.js";
import {getObjectUrl  , putObjectUrl} from "../utils/uploadInS3.js"
import axios from "axios";

export const getAllBlogs = async(req,res)=>{
	try{
		console.log("inside fetching all blogs");
		
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

export const getAllBlogsAtOnce = async(req,res)=>{
	try{
		const blogs = await Blogs.find({});
		if(!blogs.length) return res.json({success : true , message : "No Blogs created" , data : []})
		return res.json({success : true , message : "Blogs fetched successfully" , data : blogs})
	}catch(err){
		console.log("Error in getAllBlogsAtOnce " , err.message)
	}
}

export const getBlogBySlug = async(req,res)=>{
	try{
		const{slug} = req.params
		const getBlogBySlug = await Blogs.findOne({slug}).lean()
		console.log("blog is " , getBlogBySlug)
		if(!getBlogBySlug) return res.json({success : false , message : "No Blog found with this slug"})
		return res.json({success : true , message : "Blog found with this slug" , data : getBlogBySlug})
	}catch(err){
		console.log("error in getBlogBySlug " , err.message)
	}
}

export const createBlogs = async(req,res)=>{
	try{
		let coverImageUploadUrl
		const coverImage = req.file
		const{  title , slug , metaTitle , metaDescription , des , isEdit} = req.body;
		let {content} = req.body;
		content = JSON.parse(content)
		if(!title || !slug || !des) return res.status(400).json({success : false , message : "all fields are required"})
		
		// we need to check if , for this slug if any blog exists previously or not
		const isBlogexists = await Blogs.findOne({slug});

		if(isBlogexists && isEdit){
			await Blogs.findByIdAndDelete(isBlogexists._id)
		}else{
			return res.json({success : false , message : "A blog with this slug already exists."});
		}

		// if(isBlogexists) return res.json({success : false , message : "A blog with this slug already exists."});
		
		if(coverImage){
			console.log("Cover image is uploaded")
			coverImageUploadUrl = await putObjectUrl("freelance-blogs");
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
			slug : slug.trim(),
			metaDescription : metaDescription ? metaDescription : undefined,
			metaTitle : metaTitle ? metaTitle : undefined ,
			title,
			content,
			des
		})
		if(coverImage) {
			blog.coverImage = coverImageUploadUrl.fileName
			blog.url = `https://freelance-blogs.s3.ap-south-1.amazonaws.com/${coverImageUploadUrl.fileName}`
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

export const deleteBlog = async(req,res)=>{
	try{
		const {_id} = req.body;
		await Blogs.deleteOne({_id});
		res.json({success : true , message : "Blog deleted successfully"})
	}catch(err){
		console.log("Error in deleteBlog " , err.message)
	}
}