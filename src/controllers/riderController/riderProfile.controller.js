import { ApiResponse } from "../../utils/ApiResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";

const riderProfile = AsyncHandler(async (req,res)=>{
    return res
    .status(200)
    .json(
        new ApiResponse(200,"Rider profile working well!")
    );
});

export { riderProfile }