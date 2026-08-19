import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import 
    {
     approvedDriverProfileStatusController, 
     getAllDriversController,
     notApprovedDriverController,
     driverProfileRejectController,
     driverDocumentsRejectController,
     driverDocumentsApprovedController, 
     driverVehicleApprovedController,
     driverVehicleRejectController,
     getSingleDriverController,
     getAllUsersController,
     allRejectedDriversController,
    } 
    from "./controllers/adminDashboard.controller.js";
import { createRideByAdminController, getRequestedRidesByAdminController } from "./controllers/adminRideBooking.controller.js";
import { getAdminDriverRideHistoryController } from "../ride matching/controllers/ride.controller.js";

const router = Router();

// ALL DRIVERS ROUTE
router.route("/drivers").get(
    verifyJWT,
    authorizeRole("ADMIN"),
    getAllDriversController
);

router.route("/rejected-drivers").get(
    verifyJWT,
    authorizeRole("ADMIN"),
    allRejectedDriversController
)


// SINFLE DRIVER PROFILE 
router.route("/single-driver").get(
    verifyJWT,
    authorizeRole("ADMIN"),
    getSingleDriverController
)

// NOT-APPROVED-DRIVERS ROUTE
router.route("/not-approved-drivers").get(
    verifyJWT,
    authorizeRole("ADMIN"),
    notApprovedDriverController
)

// UPDATE TO APPROVED DRIVER PROFILE STATUS ROUTE. 
router.route("/driver-profile-approved").patch(
    verifyJWT,
    authorizeRole("ADMIN"),
    approvedDriverProfileStatusController
);

// UPDATE TO REJECT DRIVER STATUS ROUTE.
router.route("/driver-profile-reject").patch(
    verifyJWT,
    authorizeRole("ADMIN"),
    driverProfileRejectController
);

// DRIVER_DOCUMENTS APPROVED  ROUTE.
router.route("/driver-documents-approved").patch(
    verifyJWT,
    authorizeRole("ADMIN"),
    driverDocumentsApprovedController
);

// DRIVER-DOCUMENTS REJETCTED ROUTE.
router.route("/driver-documents-rejected").patch(
    verifyJWT,
    authorizeRole("ADMIN"),
    driverDocumentsRejectController
);

// DRIVER-VEHICLE APPROVED ROUTE.
router.route("/driver-vehicle-approved").patch(
    verifyJWT,
    authorizeRole("ADMIN"),
    driverVehicleApprovedController
)

// DRIVER-VEHICLE-REJECTED ROUTE.
router.route("/driver-vehicle-reject").patch(
    verifyJWT,
    authorizeRole("ADMIN"),
    driverVehicleRejectController
);



// ALL USERS ROUTE
router.route("/riders").get(
    verifyJWT,
    authorizeRole("ADMIN"),
    getAllUsersController
);

// create ride 
router.route("/create-ride").post(
  verifyJWT,
  authorizeRole("ADMIN"),
  createRideByAdminController
);

// FETCH REQUESTED RIDES 
router.route("/requested-rides").get(
    verifyJWT,
    authorizeRole("ADMIN"),
    getRequestedRidesByAdminController
)

// GET DRIVER RIDE HISTORY (CONTROLLER WRITTEN INSIDE ride/controller/ride.controller.js )
router.route("/:driverId/rides/history").get(
    verifyJWT,
    authorizeRole("ADMIN"),
    getAdminDriverRideHistoryController
)
export default router;