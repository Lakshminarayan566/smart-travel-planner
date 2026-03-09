import axios from 'axios';

export const getWeatherForecast = async (destination, startDate, endDate) => {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey || apiKey === 'your_weather_api_key_here') {
        console.log('Using mock weather data');
        return getMockWeather(destination);
    }

    try {
        // WeatherAPI endpoint (assuming 7-day forecast max, logic can be adjusted based on API tier)
        const response = await axios.get('http://api.weatherapi.com/v1/forecast.json', {
            params: {
                key: apiKey,
                q: destination,
                days: 7 // fetching 7 days just in case
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching weather:', error);
        return getMockWeather(destination); // fallback to mock on error
    }
};

const getMockWeather = (destination) => {
    return [
        {
            date: 'Day 1',
            condition: 'Sunny',
            avgtemp_c: 24
        },
        {
            date: 'Day 2',
            condition: 'Partly cloudy',
            avgtemp_c: 22
        }
    ];
};
