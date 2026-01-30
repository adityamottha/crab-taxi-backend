import { ApiResponse } from "../../../utils/ApiResponse.js";
import { AsyncHandler } from "../../../utils/AsyncHandler.js"

const allowDriverController = AsyncHandler(async (req,res)=>{
    return res
    .status(200)
    .json( 
        new ApiResponse(200,"Admin API working well!")
    );
});

export { allowDriverController }