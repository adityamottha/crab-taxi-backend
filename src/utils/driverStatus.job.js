import { DriverProfile } from "../modules/driver/models/driverProfile.model.js";

 const startDriverStatusJob = () => {

  setInterval(async () => {
    try {
      const cutoff = new Date(Date.now() - 1200000); 

      await DriverProfile.updateMany(
        { 
            driverStatus: "ONLINE",
            lastSeen: { $lt: cutoff }
       },
        { driverStatus: "OFFLINE" }
      );

      // console.log("Checked inactive drivers");

    } catch (err) {
      console.log("Driver status job error:", err.message);
    }
  }, 30000);

};

export { startDriverStatusJob }