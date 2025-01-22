import { Auth } from "../models/auth.js"
import { Code } from "../models/secureCode.js";

export const registerUser = async(req,res)=>{
	try{

		const {email , name , password , code} = req.body;
		if(!email || !name || !password) return res.json({success : false , message : "All fields are required"});

		const allAdmins = await Auth.find({}).lean();
		if(allAdmins.length == 0){
			// this is the first time anyone is creating an admin
			const newCode = new Code({
				code
			})
			await newCode.save();

			// creating the first Admin user
			const admin = await Auth.create({
				name , email , password
			})
			const adminToSend = {...admin}
			delete adminToSend.password
			return res.json({success : true , message : "First Admin is created" , data : adminToSend})
		}
		const c = await Code.find({}).lean()[0]
		if(!c) return res.json({success : false , message : "Code is not created , please first create the code"});
		if(c.code == code){
			// this user is eligible to create a new admin
			const newAdmin = await Auth.create({
				name , email , password
			})
			const newAdminToSend = {...newAdmin};
			delete newAdminToSend.password
			return res.json({success : true , message : "New Admin is created" , data : newAdminToSend })
		}

	}catch(err){
		console.log("error in registerUser " , err.message)
	}
}


export const loginUser = async(req,res)=>{
	try{
		const {email , password} = req.body;
		// check if this email exists or not
		const admin = await Auth.findOne({email});
		if(!admin || admin.password != password) return res.json({success : false , message : "Email or password is incorrect"});

		return res.json({success : true , message : "Login successfull"})

	}catch(err){
		console.log("error in loginUser " , err.message)
	}
}


export const changeSecretCode = async(req,res)=>{
	try{

		const {code , email , password , newCode} = req.body 
		const orgCode = await Code.find({}).lean[0];
		if(code != orgCode.code) return res.json({success : false , message : "Please provide the original and corrent code"});
		
		const isAdminExists = await Auth.findOne({email}).lean();
		if(!isAdminExists) return res.json({success : false , message : "You have no authority to change the code"})
		const firstAdmin = await Auth.find({}).sort({createdAt : -1}).lean()[0];
		if(firstAdmin.email != email) return res.json({success : false , message : "Only first admin can change the code"});

		// now we have to check if the password is entered is correct or not
		if(isAdminExists.password != password) return res.json({success : false , message : "Password is incorrect"});


		orgCode.code = newCode;
		await orgCode.save();
		return res.json({success : true , message : "Code changed successfully"});

	}catch(err){
		console.log("error in changeSecretCode " , err.message)
	}
}