import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js"

const register = AsyncHandler(async (req,res)=>{
    res.status(200).json(
        new ApiResponse(200,"OK")
    )
});

export { register }
