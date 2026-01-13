import { ApiResponse } from "../../../utils/ApiResponse.js";
import { AsyncHandler } from "../../../utils/AsyncHandler.js";

const driverDocumentController = AsyncHandler(async (req,res)=>{
    return res.status(200)
    .json( 
        new ApiResponse(200,{},"Driver-Documents working well!")
    )
});

export { driverDocumentController }