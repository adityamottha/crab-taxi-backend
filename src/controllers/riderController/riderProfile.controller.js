import { riderprofileService } from "../../services/riderServices/riderProfile.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";

const riderProfile = AsyncHandler(async (req,res)=>{
    // find avatar on local path
    const avatarLocalPath = await req.files?.userAvatar?.path;

    // get a rider service 
    const {rider} = await riderprofileService({
        fullname:req.body.fullname,
        gender:req.body.gender,
        avatarLocalPath
    });
   
    return res.status(200).json(
        new ApiResponse(200, rider, "Rider profile completed successfully!")
    );
});

export { riderProfile }