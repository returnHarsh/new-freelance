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

export const getAllContactsAtOnce = async(req,res)=>{
	try{
		const contacts = await Contact.find({}).sort({date : -1});
		return res.json({sucess : true , message :"All contacts found " , data : contacts});
	}catch(err){
		console.log("Error in getAllContactsAtOnce " , err.message)
	}
}

export const deleteAppointment  = async(req,res)=>{
	try{
		const {_id} = req.params;
		const appointment = await Contact.deleteOne({_id});
		return res.json({sucess : true , message : "Appointment deleted successfully"});
	}catch(err){
		console.log("Error at deleteAppointment " , err.message)
	}
}

export const registerContact = async(req,res)=>{
	try{
		const {name , email , phone , date , time , message , clinicAddress , service } = req.body;
		if(!name || !phone || !clinicAddress || !date || !time) return res.json({sucess : false , message : "All fields are required"})

		// first we have to check for this date and time and address does any other appointment already exists or not
		const isAppointmentExists = await Contact.find({
			$and: [
				{ date: date },
				{ time: time },
				{ clinicAddress: clinicAddress }
			]
		});
		if(isAppointmentExists.length) return res.json({success : false , message : "Appointemnt already exists for this time and date"})

		const contact = new Contact({
			name , email , phone , clinicAddress , date , time , message , service
		})
		await contact.save();

		return res.json({success : true , message : "Your query registered successfully , We'll contact you shortly" , data : contact})

	}catch(err){
		console.log("error in registerContact " , err.message)
	}
}
