import { ApiError } from "../../../utils/ApiError.js";
import { RiderProfile } from "../models/riderProfile.model.js";
import { uploadOnCloudinary } from "../../../utils/cloudinary.js";
import { ONE_DAY } from "../../../constants.js";

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

    // RIDER only change a fullname once in a 24h
    if(riderProfile.fullnameUpdatedAt && Date.now() - riderProfile.fullnameUpdatedAt.getTime() < ONE_DAY){
        throw new ApiError(400,"You only able to change fullname once in a 24h!");
    };

    // Check previus fullname must be same as oldFullname
    if(riderProfile.fullname === newFullname){
        throw new ApiError(409,"New-fullname must be diffrate from old one!");
    };

    // Update new name to db old name + time
    riderProfile.fullname = newFullname;
    riderProfile.fullnameUpdatedAt = new Date()
    // save user
    await riderProfile.save();

    // return 
    return riderProfile;
 }

 // CHANGE-GENDER---------------
const changeGenderService = async ({userId,newGender})=>{

    // check all fields are required
    if(!newGender?.trim()){
        throw new ApiError(400,"New-Gender is required!");
    };

    // find riderProfile by id 
    const riderProfile = await RiderProfile.findOne({authUserId:userId});
    if(!riderProfile){
        throw new ApiError(404,"Rider Profile is not Available!.");
    };

    // check current gender are not same to newGender
    if(riderProfile.gender === newGender){
        throw new ApiError(409,"New gender must be diffrante from old one!");
    };

    // update gender on db
    riderProfile.gender = newGender;

    // save gender
    await riderProfile.save();

    // return 
    return riderProfile;
}
 export { 
    riderprofileService,
    changeFullnameService,
    changeGenderService
 }