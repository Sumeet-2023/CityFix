import axios from "axios";
import { configDotenv } from "dotenv";
import { Request, Response } from "express";

configDotenv({
    path:".env"
})

export const getAllCities = async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities`, {
          headers: {
            'X-RapidAPI-Key': process.env.GEO_DB_API_KEY,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
          },
          params: {types: 'CITY',countryIds: 'Q668' },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch cities' });
    }
}

export const getPreferenceData = async (req: Request, res: Response) => {
    const { city, preference } = req.params;
  
  try {
    let data;

    if (preference === 'weather') {
      // Fetch weather data from OpenWeatherMap
      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
        }
      });
      
      data = {
        city: weatherResponse.data?.name,
        country: weatherResponse.data?.sys.country,
        temperature: weatherResponse.data?.main.temp,
        feels_like: weatherResponse.data?.main.feels_like,
        temp_min: weatherResponse.data?.main.temp_min,
        temp_max: weatherResponse.data?.main.temp_max,
        humidity: weatherResponse.data?.main.humidity,
        pressure: weatherResponse.data?.main.pressure,
        visibility: weatherResponse.data?.visibility,
        wind_speed: weatherResponse.data?.wind.speed,
        wind_deg: weatherResponse.data?.wind.deg,
        sunrise: new Date(weatherResponse.data?.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(weatherResponse.data?.sys.sunset * 1000).toLocaleTimeString(),
        description: weatherResponse.data?.weather[0].description,
        icon: `https://openweathermap.org/img/w/${weatherResponse.data?.weather[0].icon}.png`
      }

    } else if (preference === 'air_quality') {
      // Fetch air quality data from AQICN
      const airQualityResponse = await axios.get(`https://api.waqi.info/feed/${city}/`, {
        params: {
          token: process.env.AQICN_API_KEY
        }
      });
      data = {
        city: airQualityResponse.data.data.city.name,
        aqi: airQualityResponse.data.data.aqi,
        dominantPollutant: airQualityResponse.data.data?.dominentpol
      };

    } else {
        res.status(400).json({ error: 'Invalid preference' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to fetch data for ${preference}` });
  }
}




