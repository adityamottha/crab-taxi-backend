import { ApiError } from "../utils/ApiError.js";

const isProfileCompleted =  ()=>{
    return (req,_,next) =>{
    if(!req.user?.isProfileCompleted){
        throw new ApiError(404, "First complete your profile!");
    }
    next();
}
};

export { isProfileCompleted }