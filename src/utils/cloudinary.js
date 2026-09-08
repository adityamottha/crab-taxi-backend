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
const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    console.log("Uploading file:", localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(
      "FILE SUCCESSFULLY UPLOADED:",
      response.secure_url
    );

    // Delete local file after successful upload
    try {
      await fs.unlink(localFilePath);
      console.log("Local file deleted successfully");
    } catch (deleteError) {
      console.error(
        "Failed to delete local file:",
        deleteError.message
      );
    }

    return response;

  } catch (error) {
    console.error(
      "CLOUDINARY UPLOAD FAILED:",
      error.message
    );

    // Delete local file even if Cloudinary upload fails
    try {
      if (fsSync.existsSync(localFilePath)) {
        await fs.unlink(localFilePath);
        console.log(
          "Local file deleted after Cloudinary failure"
        );
      } else {
        console.log(
          "Local file does not exist:",
          localFilePath
        );
      }
    } catch (deleteError) {
      console.error(
        "FAILED TO DELETE LOCAL FILE:",
        deleteError.message
      );
    }

    throw error;
  }
};

export { uploadOnCloudinary };