import { ApiError } from "./ApiError.js";
import { uploadOnCloudinary } from "./cloudinary.js";

// funtion for upload multiple files 

const uploadMultipleFiles = async(files)=>{
    const urls = [];

    for (const file of files) {
        const uploadedFile = await uploadOnCloudinary(file.path);
        console.log("CLOUDINARY RESULT:-", uploadedFile);
        
        console.log("FILE RECIEVED:- ", files);
        
        console.log("FILES_URL: -", uploadMultipleFiles.secure_url);
        
        if(!uploadedFile?.secure_url) throw new ApiError(500,"Failed to upload files");
        urls.push(uploadedFile.secure_url);
    }

    return urls;
}

export { uploadMultipleFiles }