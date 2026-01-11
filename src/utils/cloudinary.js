import env from "dotenv";
env.config();
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

// console.log("API_KEY: ",process.env.CLOUDINARY_API_KEY);
const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        });
        console.log("FILE SUCCESSFULY UPLOADED ON CLOUDINARY! ",response.secure_url);

        if(fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath);
        };

        return response;
        
    } catch (error) {
        console.log("CLOUDINARY FAILED TO UPLOAD FILE! - ERROR:- ",error.message);
        if(fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath);
        }

         throw error;
    }
}

export { uploadOnCloudinary }