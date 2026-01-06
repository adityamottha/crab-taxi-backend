import { AuthUser } from "../../models/authModel/AuthUsers.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import  validator  from "validator";

const registerService = async ({phoneNumber,email,password,role }) =>{

    // check all fields are required
    if([phoneNumber,email,password,role].some(fields=>!fields?.trim())){
        throw new ApiError(404,"All fields are required!");
    };

    // check is user already existed 
    const existedUser = await AuthUser.findOne({
        $or:[{phoneNumber},{email}]
    });

    if(existedUser) throw new ApiError(402,"User already existed!");

    // check email is valid 
    const checkValidEmail = (e)=>{
        return validator.isEmail(e)
    }
    if(!checkValidEmail(email)){
        throw new ApiError(400,"Invalid Email!")
    }


    // check number is valid 
     const checkValidNumber = (phone) => {
     const phoneNumber = parsePhoneNumberFromString(phone);
     return phoneNumber && phoneNumber.isValid();
     };

     if (!checkValidNumber(phoneNumber)) throw new ApiError(400, "Invalid phone number");


    // created user 

    const insertUser = await AuthUser.create({
        phoneNumber,
        email,
        role,
        password,
        authProvider: "EMAIL",
        accountStatus: "ACTIVE",
        driverApprovalStatus: role === "DRIVER" ? "PENDING" : "NOT_APPLICABLE",
        kycRequired: role === "DRIVER"
    });

    if(!insertUser) throw new ApiError(500,"user failed to register!");

    // return for response 
    return createUser;
}

export { registerService }