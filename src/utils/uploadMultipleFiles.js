import { ApiError } from "./ApiError.js";
import { uploadOnCloudinary } from "./cloudinary.js";

// Upload multiple files
const uploadMultipleFiles = async (files = []) => {
  if (!files.length) {
    throw new ApiError(400, "No files received!");
  }

  const urls = [];

  for (const file of files) {
    try {
      const uploadedFile = await uploadOnCloudinary(file.path);

      if (!uploadedFile?.secure_url) {
        throw new ApiError(500, "Failed to upload file");
      }

      urls.push(uploadedFile.secure_url);
    } catch (error) {
      console.error(
        `Failed to upload file: ${file.path}`,
        error.message
      );

      // Don't continue if one upload fails
      throw error;
    }
  }

  return urls;
};


// Upload multiple files with URL + upload date
const uploadMultipleFilesWithUrl = async (files = []) => {
  if (!files.length) {
    throw new ApiError(400, "No files provided");
  }

  const uploadedImages = [];

  for (const file of files) {
    try {
      const result = await uploadOnCloudinary(file.path);

      if (!result?.secure_url) {
        throw new ApiError(500, "Failed to upload file");
      }

      uploadedImages.push({
        url: result.secure_url,
        uploadedAt: new Date(),
      });

    } catch (error) {
      console.error(
        `Failed to upload file: ${file.path}`,
        error.message
      );

      throw error;
    }
  }

  return uploadedImages;
};


export {
  uploadMultipleFiles,
  uploadMultipleFilesWithUrl,
};