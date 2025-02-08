import jwt from "jsonwebtoken"

export const generateToken = async(userId)=>{
	try{
		const secretJWttoken = process.env.JWT_SECRET_KEY
		const token = jwt.sign(
			{ userId }, 
			secretJWttoken,  
			{ expiresIn: "1h" }
		  );

		  return token

	} catch(err) {
		console.log("error in generateToken " , err.message)
	}
}