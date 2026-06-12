class FareCalculator {
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  static calculateFare(pickup, dropoff) {
    const distance = this.calculateDistance(
      pickup.lat, pickup.lng,
      dropoff.lat, dropoff.lng
    );
    
    // Fare calculation: $2 base + $1.5 per km
   const baseFare = 50;
   const perKmRate = 12;
    const totalFare = baseFare + (distance * perKmRate);
    const duration = Math.round(distance * 2); // 2 minutes per km
    
    return {
      amount: Math.round(totalFare * 100) / 100,
      distance: Math.round(distance * 100) / 100,
      duration: duration
    };
  }

  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

export {FareCalculator}