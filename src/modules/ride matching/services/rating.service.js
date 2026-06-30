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

    // check user rating must be between 1 to 5 
    if(rating < 1 || rating > 5){
        throw new ApiError(
            400,
        "Rating must be between 1 and 5"
        )
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

    // check user who rating who the same user who completed ride?
    if (ride.passengerId.toString() !== passengerId.toString()) {
        throw new ApiError(
        403,
        "You are not allowed to rate this ride"
    );
};

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
    const driver = await DriverProfile.findOneAndUpdate(

        { authUserId: ride.driverId },
        { 
            $inc:{
                ratingAccount:1,
                ratingSum: rating
            }
        },
        {
            returnDocument:"after"
        }
    );

    // check driver is exist
    if(!driver){
        throw new ApiError(
            404,
            "Driver profile not found",
        );
    };

    // calculate driver average rating
    driver.rating =  Number((driver.ratingSum / driver.ratingAccount).toFixed(1)); 

    // save data
    await driver.save();

    // return 
    return {
    rating: newRating,
    averageRating: driver.rating,
    totalRatings: driver.ratingAccount
};

}

// =============== GET DRIVER RATING ================= 
 export const getDriverRatingsService = async (driverId) => {

    // check driverIfd is required
    if(!driverId){
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

