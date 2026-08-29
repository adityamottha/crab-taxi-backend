class FareCalculator {

  // VEHICLE CATEGORY PRICING 

  static fareRates = {

    SEDAN: {
      baseFare: 50,
      perKmRate: 12,
    },

    TWO_WHEELER: {
      baseFare: 30,
      perKmRate: 8,
    },

    SUV: {
      baseFare: 80,
      perKmRate: 16,
    },

    PREMIUM_SUV: {
      baseFare: 120,
      perKmRate: 20,
    },

  };


  // CALCULATE DISTANCE
  static calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
  ) {

    const earth_radius = 6371;

    const dLat = this.deg2rad(
      lat2 - lat1
    );

    const dLon = this.deg2rad(
      lon2 - lon1
    );

    const a =
      Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +

      Math.cos(
        this.deg2rad(lat1)
      ) *

      Math.cos(
        this.deg2rad(lat2)
      ) *

      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earth_radius * c;
  }


  // DEGREE → RADIAN
  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // CALCULATE FARE

  static calculateFare(
    pickup,
    dropoff,
    vehicleCategory
  ) {

    const rate =
      this.fareRates[vehicleCategory];

    if (!rate) {
      throw new Error(
        `Invalid vehicle category: ${vehicleCategory}`
      );
    }

    const distance =
      this.calculateDistance(
        pickup.lat,
        pickup.lng,
        dropoff.lat,
        dropoff.lng
      );

    // Base fare + distance fare
    const totalFare =
      rate.baseFare +
      (distance * rate.perKmRate);

    // Estimated duration
    const duration =
      Math.round(distance * 2);

    return {

      amount:
        Math.round(
          totalFare * 100
        ) / 100,

      currency: "INR",

      distance:
        Math.round(
          distance * 100
        ) / 100,

      duration,

      vehicleCategory,

    };
  }

  // GENERATE OTP
  static generateOTP() {

    return Math.floor(
      100000 +
      Math.random() * 900000
    ).toString();

  }

}

export { FareCalculator };