"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreferenceData = exports.getAllCities = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)({
    path: ".env"
});
const getAllCities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities`, {
            headers: {
                'X-RapidAPI-Key': process.env.GEO_DB_API_KEY,
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            },
            params: { types: 'CITY', countryIds: 'Q668' },
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch cities' });
    }
});
exports.getAllCities = getAllCities;
const getPreferenceData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const { city, preference } = req.params;
    try {
        let data;
        if (preference === 'weather') {
            // Fetch weather data from OpenWeatherMap
            const weatherResponse = yield axios_1.default.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    q: city,
                    appid: process.env.OPENWEATHER_API_KEY,
                }
            });
            data = {
                city: (_a = weatherResponse.data) === null || _a === void 0 ? void 0 : _a.name,
                country: (_b = weatherResponse.data) === null || _b === void 0 ? void 0 : _b.sys.country,
                temperature: (_c = weatherResponse.data) === null || _c === void 0 ? void 0 : _c.main.temp,
                feels_like: (_d = weatherResponse.data) === null || _d === void 0 ? void 0 : _d.main.feels_like,
                temp_min: (_e = weatherResponse.data) === null || _e === void 0 ? void 0 : _e.main.temp_min,
                temp_max: (_f = weatherResponse.data) === null || _f === void 0 ? void 0 : _f.main.temp_max,
                humidity: (_g = weatherResponse.data) === null || _g === void 0 ? void 0 : _g.main.humidity,
                pressure: (_h = weatherResponse.data) === null || _h === void 0 ? void 0 : _h.main.pressure,
                visibility: (_j = weatherResponse.data) === null || _j === void 0 ? void 0 : _j.visibility,
                wind_speed: (_k = weatherResponse.data) === null || _k === void 0 ? void 0 : _k.wind.speed,
                wind_deg: (_l = weatherResponse.data) === null || _l === void 0 ? void 0 : _l.wind.deg,
                sunrise: new Date(((_m = weatherResponse.data) === null || _m === void 0 ? void 0 : _m.sys.sunrise) * 1000).toLocaleTimeString(),
                sunset: new Date(((_o = weatherResponse.data) === null || _o === void 0 ? void 0 : _o.sys.sunset) * 1000).toLocaleTimeString(),
                description: (_p = weatherResponse.data) === null || _p === void 0 ? void 0 : _p.weather[0].description,
                icon: `https://openweathermap.org/img/w/${(_q = weatherResponse.data) === null || _q === void 0 ? void 0 : _q.weather[0].icon}.png`
            };
        }
        else if (preference === 'air_quality') {
            // Fetch air quality data from AQICN
            const airQualityResponse = yield axios_1.default.get(`https://api.waqi.info/feed/${city}/`, {
                params: {
                    token: process.env.AQICN_API_KEY
                }
            });
            data = {
                city: airQualityResponse.data.data.city.name,
                aqi: airQualityResponse.data.data.aqi,
                dominantPollutant: (_r = airQualityResponse.data.data) === null || _r === void 0 ? void 0 : _r.dominentpol
            };
        }
        else {
            res.status(400).json({ error: 'Invalid preference' });
        }
        res.status(200).json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: `Failed to fetch data for ${preference}` });
    }
});
exports.getPreferenceData = getPreferenceData;
