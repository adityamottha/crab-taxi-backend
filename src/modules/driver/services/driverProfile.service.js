import { DriverProfile } from "../models/DriverProfile.model.js"
import { ApiError } from "../../../utils/ApiError.js"
import { uploadOnCloudinary } from "../../../utils/cloudinary.js";

const driverProfileService =async ({fullname,dateOfBirth,driverAvatar,address,user})=>{
    
// check fields 
if([fullname,dateOfBirth].some(fields=>!fields?.trim())){
    throw new ApiError(404,"All fields are required!")
}

// find user by authUserid check it is not available is availble through err
const existedUserProfile = await DriverProfile.findById({authUserId:user});
if(existedUserProfile) throw new ApiError(409,"User already existed!");

// check avatar is in local fields through error
if(!driverAvatar) throw new ApiError(404,"Avatar is required!");

// upload avatar in cloudinary
const avatar = await uploadOnCloudinary(driverAvatar);
if(!avatar?.secure_url) throw new ApiError(500,"Avatar faild to upload!")

//create user 
const driver = await DriverProfile.create(
    {
        fullname,
        dateOfBirth,
        driverAvatar:avatar.secure_url,
        address,
        authUserId:user
    }
)

if(!driver) throw new ApiError(500,"driver-profile failed to completed!,");

// write a mark profile compeleted true
if(driver){
    user.isProfileCompleted = true;
    user.save({saveBeforeValidate:false});
}

// send res 
return driver;

}

export { driverProfileService }