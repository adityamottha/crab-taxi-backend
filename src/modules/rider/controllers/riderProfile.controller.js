import { changeFullnameService, changeGenderService, riderprofileService } from "../services/riderProfile.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js";

const riderProfileController = AsyncHandler(async (req,res)=>{
    // find avatar on local path
    const avatarLocalPath = await req.files?.userAvatar?.[0]?.path;

    // get a rider service 
    const {rider} = await riderprofileService({
        fullname:req.body.fullname,
        gender:req.body.gender,
        avatarLocalPath,
        user:req.user
    });
   
    return res.status(200).json(
        new ApiResponse(200, rider, "Rider profile completed successfully!")
    );
});

// CHANGE  FULL-NAME 

const changeFullnameController = AsyncHandler(async (req,res)=>{
    // get user ID
    const userId = req.user?._id;
    // console.log("USER-ID:- ",userId);
    // console.log("BODY:- ",req.body);
    

    // get data from rq.body
    const {newFullname} = req.body;

    //call service function 
    const riderProfile = await changeFullnameService({
        userId,
        newFullname
    });

    // send response 
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                fullname:riderProfile.fullname,
                fullnameUpdatedAt:riderProfile.fullnameUpdatedAt
            },
            "Full name updated successfully"
        )
    );
});

// CHANGE GENDER ------------------

const changeGenderController = AsyncHandler(async (req,res)=>{
    
    // get user id from req body
    const userId = req.user?._id;

    // get data from req.body
    const {newGender} = req.body;

    // call function assign parameter
    const riderProfile = await changeGenderService({
        userId,
        newGender
    });

    // send response
    return res.status(200).json(
        new ApiResponse(200,{gender:riderProfile.gender},"Gender updated successfully!")
    );
})

export { 
    riderProfileController,
    changeFullnameController,
    changeGenderController
}