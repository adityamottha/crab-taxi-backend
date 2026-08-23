import { DriverEarning } from "../models/driverEarnings.model.js";

const updateDriverDailyEarningService = async ({
  driverId,
  amount,
  currency,
  completedAt,
}) => {
  const date = new Date(completedAt);

  date.setHours(0, 0, 0, 0);

  const earning = await DriverEarning.findOneAndUpdate(
    {
      driverId,
      date,
    },
    {
      $inc: {
        amount: amount,
        totalRides: 1,
      },
      $setOnInsert: {
        currency: currency,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return earning;
};

export {
    updateDriverDailyEarningService
}