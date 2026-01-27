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

 const changeFullnameService = async ({userId,oldFullname,newFullname}) =>{

    console.log("USER-ID:- ",userId);
    
    console.log("OLD-FULLNAME:- ", oldFullname);
    console.log("NEW-FULLNAME:- ", newFullname);
    
    // Check all fields are required
    if([oldFullname, newFullname].some(fields=>!fields?.trim())){
        throw new ApiError(404,"All fields are required!");
    };

    // Check old name must be diffrante from new name
    if(oldFullname === newFullname){
        throw new ApiError(401,"New-fullname must be diffrante from old one!");
    };

    // Find user by id 
    const user = await RiderProfile.findById(userId);
    if(!user) throw new ApiError(409,"Rider profile is nor complete!");

    // Check previus fullname must be same as oldFullname
    if(user.fullname !== oldFullname){
        throw new ApiError(404,"Wrong old-fullname");
    };

    // Update new name to db old name
    user.fullname = newFullname;

    // save user
    await user.save();

    // return 
    return user;
 }

 export { 
    riderprofileService,
    changeFullnameService
 }