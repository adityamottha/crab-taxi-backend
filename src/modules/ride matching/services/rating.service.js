import { ApiError } from "../../../utils/ApiError.js";
import { Ride } from "../models/ride.model.js";
import { DriverProfile } from "../../driver/models/driverProfile.model.js";
import { Rating } from "../models/rating.model.js";

export const addRatingService = async ({
    rideId,
    passengerId,
    rating,
    review
})=>{

    // Check all fields are required
    if(!rideId){
        throw new ApiError(400,"rideId is required")
    }
    if(!passengerId){
        throw new ApiError(400,"passengerId is required")
    }
    if(!rating){
        throw new ApiError(400,"rating is required")
    }
    if(!review.trim()){
        throw new ApiError(400,"review is required")
    }
    
    // find ride  by ride id
    const ride = await Ride.findById(rideId);

    // check if ride not found
    if(!ride){
        throw new ApiError(404,"Ride not found");
    }

    // check ride completed then give rating 
    if(ride.status !== "completed"){
        throw new ApiError(
            400,
            "Ride is not completed"
        );
    }

    // check is already Rated the ride by user
    const alreadyRated = await Rating.findOne({ rideId });

    if(alreadyRated){
        throw new ApiError(
            400,
            "Ride already rated"
        );
    }

    // create rating
    const newRating = await Rating.create({

        rideId,

        passengerId,

        driverId: ride.driverId,

        rating,

        review

    });

    // find and update driverProfile rating
    await DriverProfile.findOneAndUpdate(

        {
            authUserId: ride.driverId
        },

        {
            $inc:{
                ratingAccount:1
            }
        }

    );

    // return 
    return newRating;

}

// =============== GET DRIVER RATING ================= 
 export const getDriverRatingsService = async (driverId) => {

    // check driverIfd is required
    if(driverId){
        throw new ApiError(400,"DriverId is required");
    };

    // find rating by driverId populate and select fullname and avatar sort decending
  const ratings = await Rating.find({driverId}).populate({
    path: "passengerId",
    select: "fullname avatar"
  })
  .sort({createdAt: -1 });

  // return
  return ratings;
};

