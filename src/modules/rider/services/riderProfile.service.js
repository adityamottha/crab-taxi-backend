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

 const changeFullnameService = async ({userId,newFullname}) =>{

    // console.log("USER-ID:- ",userId);
    
    // console.log("OLD-FULLNAME:- ", oldFullname);
    // console.log("NEW-FULLNAME:- ", newFullname);
    
    // Check all fields are required
    if(!newFullname?.trim()){
        throw new ApiError(404,"New full name is required!");
    };

    // Find user by id 
    const riderProfile = await RiderProfile.findOne({authUserId:userId});
    if(!riderProfile) throw new ApiError(409,"Rider profile is not complete!");

    // Check previus fullname must be same as oldFullname
    if(riderProfile.fullname === newFullname){
        throw new ApiError(409,"New-fullname must be diffrate from old one!");
    };

    // Update new name to db old name
    riderProfile.fullname = newFullname;

    // save user
    await riderProfile.save();

    // return 
    return riderProfile;
 }

 export { 
    riderprofileService,
    changeFullnameService
 }