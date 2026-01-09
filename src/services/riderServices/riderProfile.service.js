import { ApiError } from "../../utils/ApiError.js";
import { RiderProfile } from "../../models/riderModel/RiderProfile.model.js";
import { AuthUser } from "../../models/authModel/AuthUsers.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

 const riderprofileService = async ({fullname,gender,avatarLocalPath})=>{

    //check fields are not empty
    if([fullname,gender].some(fields=>!fields?.trim())){
        throw new ApiError(404,"All fields Are Required!");
    }

    //check Rider profile does not existed
    const existedProfile = await RiderProfile.findOne({authUserId:AuthUser._id});
    if(existedProfile || AuthUser.isProfileCompleted === true){
        throw new ApiError(403,"Profile Already completed!");
    }

    // check avatar in local file 
    if(!avatarLocalPath) throw new ApiError(404,"User-Avatar is required!");

    // send avatar to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar.url) throw new ApiError(500,"User-Avatar failed to upload on cloudinary");

    // insert user data on db 
    const rider = RiderProfile.create({
        fullname,
        gender:gender.toLowerCase(),
        avatarLocalPath:avatarLocalPath.url
    });
    if(!rider) throw new ApiError(500, "Rider failed to complete the profile!");

    // mark profile is completed in AuthUser 
    if(rider){
        RiderProfile.isProfileCompleted = true
    }

    // return 
    return rider;
 };

 export { riderprofileService }