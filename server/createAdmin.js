// // Checking/Testing location range.
// let lat1 = 41.4080000;
// let lat2 = 41.4200000;

// let long1 = 87.000000;
// let long2 = 18.020000;

// // let lat1 = 6.8948158;
// // let lat2 = 6.8947133;

// console.log("LAt 1 and 2 ", lat1, lat2)

// lat1 = lat1.toFixed(7)
// lat2 = lat2.toFixed(7)

// console.log("LAt 1 and 2 after string ", lat1, lat2)


// // let long1 = 3.7229704;
// // let long2 = 3.7230755;

// console.log("Long 1 and 2 ", long1, long2)

// long1 = long1.toFixed(7);
// long2 = long2.toFixed(7);

// console.log("Long1 and long2 after stiring", long1, long2)


// let latDif = lat1-lat2;
// let longDif = long1-long2;

// latDif = Math.abs(latDif)
// longDif = Math.abs(longDif)

// if(latDif <= 0.01){
//     console.log("Can submit attendance than point")
// }

// if(longDif <= 0.001) {
//     console.log("Can submit attendance")
// }


// if(latDif > 0.001 || longDif > 0.001) {
//     console.log("Failed to sign attendance - Student distance is too far from lecturer location", 403)
// }

// console.log("Diff lat", latDif)
// console.log("Diff longt", longDif)