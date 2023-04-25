const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');
const getlatlong = require('pincode-lat-long').getlatlong

// GET weather data from open weather https://openweathermap.org/current
router.get(/^\/zipcode\/(\d{6})$/, async (req, res, next) => {
    const openWeatherAPIConfig = config.get("weather.open-weather-map");
    const openWeatherUrl = `${openWeatherAPIConfig["current-weather-url"]}?appid=${openWeatherAPIConfig["current-weather-api-key"]}`;
    const pincode = req.params[0];
    const location = getlatlong(pincode);
    if(!location){
        next(new Error(`The pincode ${pincode} is invalid`));
        return;
    }
    const latitude = location.lat
    const longitude = location.long;
    try {
        const currentWeatherData = await axios.get(`${openWeatherUrl}&lat=${latitude}&lon=${longitude}`);
        res.json(currentWeatherData.data);
    }catch (error) {
        next(error);
    }
});
module.exports = router;