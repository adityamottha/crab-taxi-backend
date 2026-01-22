import { ApiError } from "../utils/ApiError.js";

const isDocumentSubmitted =  ()=>{
    return (req,_,next)=>{
        if(!req.user?.isDocumentSubmitted){
            throw new ApiError(404,"First Submit your documents!");
        }
        next()
    }
}

export { isDocumentSubmitted };