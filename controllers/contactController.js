import { Contact } from "../models/contact.js"


export const getAllContacts = async(req,res)=>{
	try{
		const page = req.params;
		const pageNumber = parseInt(page, 10) || 1;
		const numberOfContactsPerPage = 10;
		const skip = (pageNumber - 1) * numberOfContactsPerPage

		const contacts = await Contact.find({}).skip(skip).limit(numberOfContactsPerPage).lean();
		if(!contacts.length) return res.json({success : false , message : "No one contacted yet"});

		return res.json({success : true , message : "Contacts found" , data : contacts})
	}catch(err){
		console.log("error in getAllContacts " , err.message)
	}
}

export const registerContact = async(req,res)=>{
	try{
		const {name , email , phone , address  } = req.body;
		if(!name || !email || !phone) return res.json({sucess : false , message : "All fields are required"})

		const contact = new Contact({
			name , email , phone , address
		})
		await contact.save();

		return res.json({success : true , message : "Your query registered successfully , We'll contact you shortly" , data : contact})

	}catch(err){
		console.log("error in registerContact " , err.message)
	}
}
