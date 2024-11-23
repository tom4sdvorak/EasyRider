
export const getLatLng = (city) => {
    const cityData = require("../data/cities.json");
    return cityData[city];
}

export const getCities = () => {
    const cityData = require("../data/cities.json");
    const cities = Object.keys(cityData);
    return cities;
}
