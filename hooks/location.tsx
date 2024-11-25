
export const getLatLng = (city:string) => {
    const cityData = require("../data/cities.json");
    return {latitude: cityData[city][0], longitude: cityData[city][1]};
}

export const getCities = () => {
    const cityData = require("../data/cities.json");
    const cities = Object.keys(cityData);
    return cities;
}
