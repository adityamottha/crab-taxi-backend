import { ApiError } from "./ApiError.js";
import { uploadOnCloudinary } from "./cloudinary.js";

// funtion for upload multiple files 

const uploadMultipleFiles = async(files)=>{
    const urls = [];

    for (const file of files) {
        const uploadedFile = Cloudinary(file.path);
        if(!uploadedFile?.secure_url) throw new ApiError(500,"Failed to upload files");
        urls.push(uploadedFile.secure_url);
    }

    return urls;
}

export { uploadMultipleFiles }