const calculateDominantDistrict = (restaurantsData) => {
    const districtCount = {};
  
    // Count occurrences of each district
    restaurantsData.forEach((restaurant) => {
      const district = restaurant.district; 
      if (district) {
      districtCount[district] = (districtCount[district] || 0) + 1;
      }
    });
  
    // Find the district with the maximum count
    const dominantDistrict = Object.keys(districtCount).reduce(
      (a, b) => (districtCount[a] > districtCount[b] ? a : b),
      ''
    );
  
    console.log("Dominant District:", dominantDistrict);
    return dominantDistrict;
  };
  
  module.exports = {calculateDominantDistrict};
  