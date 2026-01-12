import { ApiError } from "../../../utils/ApiError.js";
import { RiderProfile } from "../models/riderProfile.model.js";
import { uploadOnCloudinary } from "../../../utils/cloudinary.js";

 const riderprofileService = async ({fullname,gender,avatarLocalPath,user})=>{

    //check fields are not empty
    if([fullname,gender].some(fields=>!fields?.trim())){
        throw new ApiError(404,"All fields Are Required!");
    }

    //check Rider profile does not existed
    const existedProfile = await RiderProfile.findOne(
        {
            authUserId:user._id
        }
    );

    if(existedProfile || user.isProfileCompleted === true){
        throw new ApiError(403,"Profile Already completed!");
    }

    // check avatar in local file 
    if(!avatarLocalPath) throw new ApiError(404,"User-Avatar is required!");

    // send avatar to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar.secure_url) throw new ApiError(500,"User-Avatar failed to upload on cloudinary");

    // insert user data on db 
    const rider = await RiderProfile.create({
        authUserId:user._id,
        fullname,
        gender:gender.toUpperCase(),
        userAvatar:avatar.secure_url
    });
    if(!rider) throw new ApiError(500, "Rider failed to complete the profile!");

    // mark profile is completed in AuthUser 
    if(rider){
        user.isProfileCompleted = true
        user.save({validateBeforeSave:false})
    }

    // return 
    return rider;
 };

 export { riderprofileService }