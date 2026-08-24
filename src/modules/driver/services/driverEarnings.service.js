import { DriverEarning } from "../models/driverEarnings.model.js";
import { ApiError } from "../../../utils/ApiError.js"
import { ObjectId } from "mongodb";
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

// ====================== DRIVER WEEKLY AND DAY EARNING CALCULATE ==========
const getDriverEarningsService = async (driverId) => {
  const now = new Date();

  // start day

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  // start week

  // first day of the week
  const startOfWeek = new Date(now);

  const day = startOfWeek.getDay();

  const diff = day === 0 ? 6 : day - 1;

  startOfWeek.setDate(
    startOfWeek.getDate() - diff
  );

  startOfWeek.setHours(0, 0, 0, 0);

  // todays earning

  const todayResult = await DriverEarning.findOne({
    driverId,
    date: startOfDay,
  });

  // weekly earning

  const weeklyResult = await DriverEarning.aggregate([
    {
      $match: {
        driverId,
        date: {
          $gte: startOfWeek,
          $lte: now,
        },
      },
    },

    {
      $group: {
        _id: null,

        total: {
          $sum: "$amount",
        },

        totalRides: {
          $sum: "$totalRides",
        },
      },
    },
  ]);

  return {
    todayEarnings: todayResult?.amount || 0,

    todayRides: todayResult?.totalRides || 0,

    weeklyEarnings: weeklyResult[0]?.total || 0,

    weeklyRides: weeklyResult[0]?.totalRides || 0,
  };
};

// =============== DAILY EARNINGS HISTORY ================
const getDriverEarningHistoryService = async (driverId) => {

  // validate driverId
  if(!ObjectId.isValid(driverId)){
    throw new ApiError(400,"driverId is required")
  };

  // find daily history by driverId 
  const history = await DriverEarning.find({
    driverId,
  })
    .sort({ // sort in decending order 
      date: -1,
    })
    .lean(); // lean for covert mdb to js object

    // return 
  return history;
};

// ============== WEEKLY EANINGS SERVICE ===============
const getDriverWeeklyEarningHistoryService = async (
  driverId
) => {

  // validate driverId
    if(!ObjectId.isValid(driverId)){
      throw new ApiError(400,"driverId is required")
    };

  // aggregate
  const weeklyHistory = await DriverEarning.aggregate([
    {
      $match: {
        driverId,
      },
    },

    {
      $group: {
        _id: {
          year: {
            $isoWeekYear: "$date",
          },

          week: {
            $isoWeek: "$date",
          },
        },

        totalEarnings: {
          $sum: "$amount",
        },

        totalRides: {
          $sum: "$totalRides",
        },

        currency: {
          $first: "$currency",
        },
      },
    },

    {
      $sort: {
        "_id.year": -1,
        "_id.week": -1,
      },
    },
  ]);

  // return 
  return weeklyHistory;
};
export {
    updateDriverDailyEarningService,
    getDriverEarningsService,
    getDriverEarningHistoryService,
    getDriverWeeklyEarningHistoryService
}