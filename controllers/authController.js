import { Admin } from "../models/auth.js"
import { Code } from "../models/secureCode.js";
import { generateToken } from "../utils/getJwtToken.js";
import mongoose from "mongoose";


export const registerUser = async (req, res) => {
	const session = await mongoose.startSession(); // Start a session
	session.startTransaction(); // Begin a transaction
  
	try {
	  const { email, name, password, code } = req.body;
	  if (!email || !name || !password || !code)
		return res.json({ success: false, message: "All fields are required" });
  
	  const allAdmins = await Admin.find({}).session(session);
  
	  if (allAdmins.length === 0) {
		// No admin exists, create a code and first admin
		await Code.create([{ code }], { session });
  
		const admin = new Admin({ email, name, password });
		await admin.save({ session });
  
		const adminObject = admin.toObject();
		delete adminObject.password;
  
		const token = await generateToken(admin._id);
		console.log("Token is ", token);
  
		// Commit transaction
		await session.commitTransaction();
		session.endSession();
  
		return res.json({ success: true, message: "First Admin is created", data: adminObject });
	  } else {
		const c = await Code.findOne({}).lean();
		if (!c) throw new Error("Code is not created");
		if (c.code !== code) throw new Error("Code is incorrect");
  
		// Check if the email already exists
		const isEmailExists = await Admin.findOne({ email }).session(session);
		if (isEmailExists) throw new Error("An admin already exists with this email");
  
		// Register new admin
		const admin = new Admin({ email, password, name });
		await admin.save({ session });
  
		const adminObject = admin.toObject();
		delete adminObject.password;
  
		const token = await generateToken(admin._id);
		console.log("Token is ", token);
  
		// Commit transaction
		await session.commitTransaction();
		session.endSession();
  
		return res.json({ success: true, message: "New Admin is created", data: adminObject });
	  }
	} catch (err) {
	  console.log("Error in registerUser:", err.message);
  
	  // Rollback transaction
	  await session.abortTransaction();
	  session.endSession();
  
	  return res.status(500).json({ success: false, message: err.message });
	}
  };

// export const registerUser = async(req,res)=>{

// 	let admin
// 	let flag = true

// 	try{
// 		const {email , name , password , code} = req.body;
// 		if(!email || !name || !password || !code) return res.json({success : false , message : "All fields are required"})

// 		const allAdmins = await Admin.find({});

// 		if(allAdmins.length == 0){
// 			// it means that there is not admin as of now
// 			await Code.create({
// 				code
// 			})
// 			admin = new Admin({
// 				email , name , password
// 			})
// 			admin = admin.toObject();
// 			delete admin.password
// 			const token = await generateToken(admin._id)
// 			console.log("Token is " , token)
// 			return res.json({success : true , message : "First Admin is created" , data : admin})
			
// 		}else{
// 			// console.log("all admins are " , allAdmins , " allAdmins after applying the lean function " , allAdmins.lean())
// 			// this means that there is already an admin present
// 			const c = await Code.findOne({}).lean()
// 			if(!c) return res.json({success : false , message : "Code is not created"});
// 			if(c.code != code) return res.json({success : false , message : "Code is incorrect Please enter the correct one"})
// 			// now the admin is elligible to be registered but first we have to check if this email is already registered or not
// 			const isEmailExists = await Admin.findOne({email});
// 			if(isEmailExists) return res.json({success : false , message : "An admin already exists with this email"});
// 			admin = new Admin({
// 				email , password , name
// 			})
// 			admin = admin.toObject()
// 			delete admin.password;
// 			const token = await generateToken(admin._id)
// 			console.log("token is " , token)
// 			return res.json({success : true , message : "New Admin is created" , data : admin })

// 		}
// 	}catch(err){
// 		console.log("error in registerUser " , err.message)
// 		flag = false
// 		return res.json({success : false , message : err.message})
// 	}finally{
// 		if(!flag) await admin.save()
// 	}
	
// }


// export const registerUser = async(req,res)=>{
// 	try{

// 		const {email , name , password , code} = req.body;
// 		console.log("req body is " , req.body)
// 		if(!email || !name || !password) return res.json({success : false , message : "All fields are required"});

// 		const allAdmins = await Auth.find({}).lean();
// 		if(allAdmins.length == 0){
// 			if(!code) return res.json({success : false , message : "Please select the security code"})
// 			// this is the first time anyone is creating an admin
// 			const newCode = new Code({
// 				code
// 			})
// 			await newCode.save();

// 			// creating the first Admin user
// 			const admin = await Auth.create({
// 				name , email , password
// 			})
// 			const adminToSend = admin.toObject();
// 			delete adminToSend.password
// 			// here admin is created now we have to generate the jwt token for this admin
// 			const token = await generateToken(admin._id)
// 			console.log("Token is " , token)
// 			return res.json({success : true , message : "First Admin is created" , data : adminToSend})
// 		}
// 		const c = await Code.findOne({}).lean();
// 		if(!c) return res.json({success : false , message : "Code is not created , please first create the code"});
// 		if(c.code == code){
// 			// this user is eligible to create a new admin

// 			// now we have to check for this email if any user is already created or not
// 			const isEmailExists = await Auth.findOne({email});
// 			if(isEmailExists) return res.json({success : false , message : "An admin already exists for this email"})

// 			const newAdmin = await Auth.create({
// 				name , email , password
// 			})
// 			const newAdminToSend = newAdmin.toObject();
// 			delete newAdminToSend.password
// 			// here admin is created now we have to generate the jwt token for this admin
// 			const token = await generateToken(newAdmin._id)
// 			console.log("token is " , token)
// 			return res.json({success : true , message : "New Admin is created" , data : newAdminToSend })
// 		}

// 	}catch(err){
// 		console.log("error in registerUser " , err.message)
// 	}
// }


export const loginUser = async(req,res)=>{
	try{
		const {email , password} = req.body;

		if(!email || !password) throw new Error("All fields are required")

		// check if this email exists or not
		const admin = await Admin.findOne({email});
		if(!admin || admin.password != password) return res.json({success : false , message : "Email or password is incorrect"});

		// now we have to generate the token and set that into cookie
		const token = generateToken(admin._id);
		res.cookie("access-token", token , {
			maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
			httpOnly: true, // ✅ Prevents JavaScript access
        	secure: false,  
        	sameSite: "lax" // ✅ Allows cookies from the same origin
		});
		const loggedInUser = admin.toObject();
		delete loggedInUser.password
		return res.json({success : true , message : "Login successfull" , data : loggedInUser})

	}catch(err){
		console.log("error in loginUser " , err.message)
	}
}

export const logout = async(req,res)=>{
	try{
		// here we have to delete the cookie
		res.clearCookie("access-token", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});
		return res.json({success : false , message : "User log out successfully"})
	}catch(err){
		console.log("Error in logout " , err.message);
		return res.json({success : false , message : err.message})
	}
}


export const changeSecretCode = async(req,res)=>{
	try{

		const {code , email , password , newCode} = req.body 
		const orgCode = await Code.find({}).lean[0];
		if(code != orgCode.code) return res.json({success : false , message : "Please provide the original and corrent code"});
		
		const isAdminExists = await Auth.findOne({email}).lean();
		if(!isAdminExists) return res.json({success : false , message : "You have no authority to change the code"})
		const firstAdmin = await Auth.findOne({}).sort({createdAt : -1}).lean();
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