// import axios from "axios";

// export const calculateDistance = async (pickup, drop) => {
//   const apiKey = process.env.GOOGLE_MAPS_KEY;

//   const response = await axios.get(
//     "https://maps.googleapis.com/maps/api/distancematrix/json",
//     {
//       params: {
//         origins: `${pickup.lat},${pickup.lng}`,
//         destinations: `${drop.lat},${drop.lng}`,
//         key: apiKey,
//       },
//     }
//   );

//   const meters = response.data.rows[0].elements[0].distance.value;

//   return meters / 1000; // km
// };
