import { ApiError } from "./ApiError.js";
import { uploadOnCloudinary } from "./cloudinary.js";

// funtion for upload multiple files 
// console.log("CLOUDINARY API SECRET-: ",process.env.CLOUDINARY_API_SECRET);

const uploadMultipleFiles = async(files=[])=>{
    if(!files.length) throw new ApiError(400,"No files received!");

    const urls = [];
    for (const file of files) {
        // console.log("FILE RECIEVED:- ", file.path);
        
        const uploadedFile = await uploadOnCloudinary(file.path);
        // console.log("CLOUDINARY RESULT:-", uploadedFile);
            
            
            if(!uploadedFile || !uploadedFile?.secure_url) throw new ApiError(500,"Failed to upload files");
            urls.push(uploadedFile.secure_url);
        }
        return urls;
}


const uploadMultipleFilesWithUrl = async (files) => {
  if (!files || files.length === 0) {
    throw new ApiError(400, "No files provided");
  }

  const uploadedImages = [];

  for (const file of files) {
    const result = await uploadOnCloudinary(file.path);
    uploadedImages.push({
      url: result.secure_url,
      uploadedAt: new Date()
    });
  }

  return uploadedImages;
};

export { 
    uploadMultipleFiles,
    uploadMultipleFilesWithUrl 
};