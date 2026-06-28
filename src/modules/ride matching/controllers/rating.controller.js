import { addRatingService } from "../services/rating.service.js";
import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js"

export const addRatingController = AsyncHandler(async (req,res)=>{

    // get rideId from params
    const { rideId } = req.params;

    // get rating and review from body
    const { rating, review } = req.body;

    // get passengerId from user
    const passengerId = req.user._id;

    // call service function
    const result = await addRatingService({
        rideId,
        passengerId,
        rating,
        review
    });

    // send response 
    return res.status(201).json(
        new ApiResponse(
            201,
            result,
            "Rating submitted successfully"
        )
    );

});

