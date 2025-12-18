import OpenAI from 'openai';
import { Location, Alert, Forecast, PointOfInterest } from '../models/index.js';
import { SYSTEM_PROMPT, TOOLS, EXAMPLES } from '../config/aiPrompts.js';
import { Op } from 'sequelize';

const fetchRealTimeWeather = async (latitude, longitude) => {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto`;
        const response = await fetch(url);
        const data = await response.json();
        return data.current;
    } catch (error) {
        console.error(
            `Failed to fetch weather for ${latitude},${longitude}`,
            error,
        );
        return null;
    }
};

const fetchHourlyForecast = async (latitude, longitude, hours = 24) => {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&forecast_days=2&timezone=auto`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Format hourly data for the requested number of hours
        const hourlyData = [];
        const limit = Math.min(hours, data.hourly.time.length);
        
        for (let i = 0; i < limit; i++) {
            // Skip past hours, start from current hour roughly
            const time = new Date(data.hourly.time[i]);
            const now = new Date();
            if (time < now && (now - time) > 3600000) continue; // Skip if older than 1 hour

            hourlyData.push({
                time: data.hourly.time[i],
                temp: data.hourly.temperature_2m[i],
                precip_prob: data.hourly.precipitation_probability[i],
                wind: data.hourly.wind_speed_10m[i],
                code: getWeatherDescription(data.hourly.weather_code[i])
            });
            
            if (hourlyData.length >= hours) break;
        }
        return hourlyData;
    } catch (error) {
        console.error(`Failed to fetch hourly forecast`, error);
        return null;
    }
};

const fetchDailyForecast = async (latitude, longitude, days = 7) => {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
        const response = await fetch(url);
        const data = await response.json();
        
        const dailyData = [];
        const limit = Math.min(days, data.daily.time.length);
        
        for (let i = 0; i < limit; i++) {
            dailyData.push({
                date: data.daily.time[i],
                max_temp: data.daily.temperature_2m_max[i],
                min_temp: data.daily.temperature_2m_min[i],
                precip_prob: data.daily.precipitation_probability_max[i],
                wind_max: data.daily.wind_speed_10m_max[i],
                code: getWeatherDescription(data.daily.weather_code[i])
            });
        }
        return dailyData;
    } catch (error) {
        console.error(`Failed to fetch daily forecast`, error);
        return null;
    }
};

const findLocationCoordinates = async (locationName) => {
    // Try POIs first
    const poi = await PointOfInterest.findOne({
        where: {
            name: { [Op.like]: `%${locationName}%` }
        }
    });
    if (poi) return { lat: poi.latitude, lng: poi.longitude, name: poi.name, type: 'POI' };

    // Try Locations
    const loc = await Location.findOne({
        where: {
            name: { [Op.like]: `%${locationName}%` }
        }
    });
    if (loc) return { lat: loc.latitude, lng: loc.longitude, name: loc.name, type: 'Location' };

    return null;
};

const getWeatherDescription = (code) => {
    const codes = {
        0: 'Clear sky ☀️',
        1: 'Mainly clear 🌤️',
        2: 'Partly cloudy ⛅',
        3: 'Overcast ☁️',
        45: 'Fog 🌫️',
        48: 'Depositing rime fog 🌫️',
        51: 'Light drizzle 🌧️',
        53: 'Moderate drizzle 🌧️',
        55: 'Dense drizzle 🌧️',
        61: 'Slight rain 🌧️',
        63: 'Moderate rain 🌧️',
        65: 'Heavy rain 🌧️',
        71: 'Slight snow 🌨️',
        73: 'Moderate snow 🌨️',
        75: 'Heavy snow 🌨️',
        95: 'Thunderstorm ⚡',
        96: 'Thunderstorm with slight hail ⛈️',
        99: 'Thunderstorm with heavy hail ⛈️',
    };
    return codes[code] || 'Unknown';
};

export const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;
        // Using the provided GitHub PAT for GitHub Models (Azure AI Inference)
        const apiKey = process.env.GITHUB_MODELS_API_KEY;

        console.log("AI Controller - API Key configured:", !!apiKey); // Debug log

        if (!apiKey) {
            return res.status(500).json({ error: 'AI service not configured (missing API key)' });
        }

        const client = new OpenAI({
            baseURL: "https://models.inference.ai.azure.com",
            apiKey: apiKey
        });

        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...EXAMPLES,
        ];

        if (history && Array.isArray(history)) {
            history.forEach((msg) => {
                const role = msg.type === 'bot' ? 'assistant' : 'user';
                messages.push({ role, content: msg.text });
            });
        }

        messages.push({ role: 'user', content: message });

        // First call to the model
        let completion = await client.chat.completions.create({
            messages: messages,
            model: 'gpt-4o',
            tools: TOOLS,
            tool_choice: "auto",
        });

        let responseMessage = completion.choices[0].message;

        // Handle tool calls if any
        if (responseMessage.tool_calls) {
            messages.push(responseMessage); // Add the assistant's tool call request to history

            for (const toolCall of responseMessage.tool_calls) {
                const functionName = toolCall.function.name;
                const args = JSON.parse(toolCall.function.arguments);
                let toolResult = JSON.stringify({ info: "Data not available." });

                try {
                    if (functionName === 'get_current_weather') {
                        const locationName = args.location;
                        const coords = await findLocationCoordinates(locationName);

                        if (coords) {
                            const weather = await fetchRealTimeWeather(coords.lat, coords.lng);
                            if (weather) {
                                weather.description = getWeatherDescription(weather.weather_code);
                                weather.location_name = coords.name;
                                toolResult = JSON.stringify(weather);
                            }
                        } else {
                            toolResult = JSON.stringify({ error: `Location '${locationName}' not found in database. Please specify a known location in Canary Islands.` });
                        }
                    } else if (functionName === 'get_weather_alerts') {
                        const region = args.region_or_island || '';
                        const whereClause = region ? {
                            '$Location.name$': { [Op.like]: `%${region}%` }
                        } : {};

                        const alerts = await Alert.findAll({
                            include: [{ 
                                model: Location, 
                                attributes: ['name'],
                            }],
                            where: whereClause
                        });
                        
                        if (alerts.length > 0) {
                            toolResult = JSON.stringify(alerts);
                        } else {
                            toolResult = JSON.stringify({ info: `No active alerts found${region ? ' for ' + region : ''}.` });
                        }
                    } else if (functionName === 'get_hourly_forecast') {
                        const locationName = args.location;
                        const hours = args.hours_ahead || 24;
                        const coords = await findLocationCoordinates(locationName);

                        if (coords) {
                            const forecast = await fetchHourlyForecast(coords.lat, coords.lng, hours);
                            if (forecast) {
                                toolResult = JSON.stringify({ location: coords.name, forecast });
                            }
                        } else {
                            toolResult = JSON.stringify({ error: `Location '${locationName}' not found.` });
                        }
                    } else if (functionName === 'get_daily_forecast') {
                        const locationName = args.location;
                        const days = args.days_ahead || 7;
                        const coords = await findLocationCoordinates(locationName);

                        if (coords) {
                            const forecast = await fetchDailyForecast(coords.lat, coords.lng, days);
                            if (forecast) {
                                toolResult = JSON.stringify({ location: coords.name, forecast });
                            }
                        } else {
                            toolResult = JSON.stringify({ error: `Location '${locationName}' not found.` });
                        }
                    }
                    // Add more tool handlers here as needed
                } catch (err) {
                    console.error(`Error executing tool ${functionName}:`, err);
                    toolResult = JSON.stringify({ error: "Failed to execute tool." });
                }

                messages.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: toolResult
                });
            }

            // Second call with tool results
            completion = await client.chat.completions.create({
                messages: messages,
                model: 'gpt-4o',
            });
            responseMessage = completion.choices[0].message;
        }

        const text = responseMessage.content || "Lo siento, no pude generar una respuesta.";
        res.json({ text });

    } catch (error) {
        console.error('AI Error Details:', error);
        const errorMessage = error.message || 'Failed to process AI request';
        res.status(500).json({ error: errorMessage });
    }
};
