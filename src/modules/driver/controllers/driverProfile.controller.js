import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { changeAvatarService, driverProfileService, getDriverProfileService, goOfflineService, goOnlineService, updateDriverLocationService } from "../services/driverProfile.service.js";
import { response } from "express";

const driverProfileController = AsyncHandler(async (req,res)=>{

    // check avatar in localPath 
    const driverAvatar = req.files?.avatar?.[0]?.path;

    // convert address = string to object
    const address = req.body.address? JSON.parse(req.body.address) : [];

    // set driver service 
    const driver = await  driverProfileService({
    fullname:req.body.fullname,
    dateOfBirth:req.body.dateOfBirth,
    address,
    driverAvatar,
    user:req.user._id
   });

//    send response 

return res
.status(200)
.json(
    new ApiResponse(200,driver,"Driver profile completed!"

    ));
});


// CHANGE DRIVER AVATAR-----------------------------

const changeAvatarController = AsyncHandler(async (req,res)=>{
    // get userId 
    const userId = req.user?._id;

    // get newAvatar req.body
    const newAvatar = req.files?.newAvatar?.[0]?.path;

    // call serice function and set parameter
    const riderProfile = await changeAvatarService({
        userId,
        newAvatar
    })
    // send response
    return res.status(200).json(
        new ApiResponse(
            200,
            {newAvatar:riderProfile.avatar,updateAvatarAt:riderProfile.avatarUploadedAt},
            "Driver avatar updated succesfully."
        )
    );
});

const getDriverProfileController = AsyncHandler(async (req, res) => {

  const userId = req.user._id;

  const driverProfile = await getDriverProfileService(userId);

  return res.status(200).json(
    new ApiResponse(
      200,
      driverProfile,
      "Driver profile fetched successfully"
    )
  );
});

// GO ONLINE DRIVER CONTROLLER ---------------------------------------------

const goOnlineController = AsyncHandler(async (req,res)=>{
    // find userId from query 
    const userId = req.user._id

    // call service functin and pass the userId
    const online = await goOnlineService(userId);

    // send response 
    return res.status(200).json(
        new ApiResponse(
            200,{online},"Driver is online"
        )
    )
});

// UPDATE DRIVER LOCATION CONTROLLER ---------------------------------------
 const updateDriverLocationController = AsyncHandler(async (req,res)=>{
    // find userId from req.body
    const userId = req.user._id;

    // find lat long from req body
    const { lat, lng } = req.body;

    // call service function and pass params
    const driverCurrentLocation = await updateDriverLocationService(userId,lat,lng);

    // return 
    return res.status(200).json(
        new ApiResponse(200, driverCurrentLocation, "Driver Location Updated.")
    );
    
 });

 // DRIVER GO-OFFLINE CONTROLLER-----------------------------------------
 const goOfflineController = AsyncHandler(async (req,res) =>{

    // find userId from req.user 
    const userId = req.user._id

    // call the service function 
    const offline = await goOfflineService(userId);

    // return response 
    return res.status(200).json(
        new ApiResponse(200,offline,"Driver is Offline")
    );
 });

export { 
    driverProfileController,
    changeAvatarController,
    getDriverProfileController,
    goOnlineController,
    updateDriverLocationController,
    goOfflineController
}