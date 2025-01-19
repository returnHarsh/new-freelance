import mongoose, { Schema } from "mongoose";

const headingAndParaSchema = new Schema({
	// type: {
    //     type: String,
    //     enum: ["heading-des", "heading-list"],
    //     required: true,
    // },
	heading : {type : String},
	des: {
        type: String,
		// default : function(){
		// 	return this.type == "heading-list" ? undefined : "test"
		// },
        // required: function () {
        //     return this.type === "heading-des";
        // },
		default : undefined
    },
	list: {
        type: [String],
		default : undefined
		// default : function(){
		// 	return this.type == "heading-des" ? undefined : "test"
		// },
        // required: function () {
        //     return this.type === "heading-list";
        // },
    },
	
} , {_id : false})

const blogsSchema = new Schema({
	slug : {
		type : String,
		unique : true
	},
	coverImage : {
		type : String,
		default : undefined
	},
	url : {
		type : String,
		default : undefined
	},
	publishDate : {
		type : Date,
		default : Date.now()
	},
	title : {
		type : String,
	},
	metaTitle : {
		type: String,
	},
	metaDescription : {
		type : String
	},
	content : {
		type : [headingAndParaSchema]
	}
},{timestamps : true})

const Blogs = mongoose.model("blogs" , blogsSchema);
export default Blogs