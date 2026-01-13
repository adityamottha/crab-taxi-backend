import { DriverProfile } from "../models/DriverProfile.model.js"
import { ApiError } from "../../../utils/ApiError.js"
import { uploadOnCloudinary } from "../../../utils/cloudinary.js"

const driverProfileService =async ({user,fullname,dateOfBirth,driverAvatar,address})=>{
    
// check fields 
if([fullname,address,dateOfBirth].some(fields=>!fields?.trim())){
    throw new ApiError(404,"All fields are required!")
}

// find user by authUserid check it is not available is availble through err
const existedUserProfile = await DriverProfile.findById({authUserId:user._id});
if(existedUserProfile) throw new ApiError(409,"User already existed!");

// check avatar is in local fields through error
if(!driverAvatar) throw new ApiError(404,"Avatar is required!");

// upload avatar in cloudinary
const avatar = await uploadOnCloudinary(driverAvatar);
if(!avatar?.secure_url) throw new ApiError(500,"Avatar faild to upload!")

//create user 
const driver = await DriverProfile.create(
    {
        authUserId:user._id,
        fullname,
        dateOfBirth,
        driverAvatar:avatar.secure_url
    }
)
// write a mark profile compeleted true
if(driver){
    user.isProfileCompleted = true;
    user.save({saveBeforeValidate:false});
}

// send res 
return driver;

}

export { driverProfileService }