import { ApiError } from "../../utils/ApiError.js";

const authorizeRole = (role)=>{

    return (req,_,next)=>{
        if(!req.userRole) throw new ApiError(401,"Unauthorized request!");
     
        if(req.userRole !== role){
            throw new ApiError(403,`${req.userRole} is not allow access this API!`);
        }

        next()
    }
}

export { authorizeRole }
