import { DriverProfile } from "../models/driverProfile.model.js";
import { ApiError } from "../../../utils/ApiError.js"
import { uploadOnCloudinary } from "../../../utils/cloudinary.js";
import { AuthUser } from "../../auth/authUsers.models.js";

const driverProfileService =async ({fullname,dateOfBirth,driverAvatar,address,user})=>{
    
// check fields 
if(!fullname?.trim()) throw new ApiError(404,"Fullname field required!");

if(!dateOfBirth) throw new ApiError(404,"Date-of-birth field required!")

 if(!driverAvatar) throw new ApiError(404,"avatar field required!");


// find user by authUserid check it is not available is availble through err
const existedUserProfile = await DriverProfile.findOne({authUserId:user._id});
if(existedUserProfile) throw new ApiError(409,"User already existed!");


// upload avatar in cloudinary
const avatar = await uploadOnCloudinary(driverAvatar);
if(!avatar?.secure_url) throw new ApiError(500,"Avatar faild to upload!")

//create user 
const driver = await DriverProfile.create(
    {
        fullname,
        dateOfBirth,
        avatar:avatar.secure_url,
        address,
        authUserId:user._id
    }
)

if(!driver) throw new ApiError(500,"driver-profile failed to completed!,");

// write a mark profile compeleted true
  await AuthUser.findOneAndUpdate(user,{isProfileCompleted:true},{new:true});
  
// send res 
return driver;

};

// CHANGE DRIVER AVATAR 
const changeAvatarService = async ({userId,newAvatar})=>{
// check newAvatar is available
if(!newAvatar) throw new ApiError(404,"Avatar is required field!");

// find user by id
const driverProfile = await DriverProfile.findOne({authUserId:userId});
if(!driverProfile) throw new ApiError(409,"Driver profile not found!");

// update avatar on cloudinary
const updatedAvatar = await uploadOnCloudinary(newAvatar);
if(!updatedAvatar?.secure_url){
    throw new ApiError(500,"Driver avatar failed to update!");
};

//change new secure_url avatar and Update time
driverProfile.avatar = updatedAvatar.secure_url;
driverProfile.avatarUploadedAt = new Date();

// save user
await driverProfile.save();

//return
return driverProfile;

}

export { 
    driverProfileService,
    changeAvatarService
 }