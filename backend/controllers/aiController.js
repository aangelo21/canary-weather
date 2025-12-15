import Groq from 'groq-sdk';
import { Location, Alert, Forecast, PointOfInterest } from '../models/index.js';

/**
 * AI Controller
 *
 * Handles interactions with the Groq AI API to provide natural language responses
 * about weather and alerts in the Canary Islands.
 */

// Helper to fetch real-time weather from Open-Meteo (Free API, no key required)
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

// WMO Weather Code mapping
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
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res
                .status(500)
                .json({ error: 'AI service not configured (missing API key)' });
        }

        // --- 1. GATHER CONTEXT ---

        // Fetch active alerts
        const alerts = await Alert.findAll({
            include: [{ model: Location, attributes: ['name'] }],
        });

        // Fetch POIs to get coordinates
        const pois = await PointOfInterest.findAll({
            attributes: ['name', 'latitude', 'longitude'],
            limit: 15, // Limit to main locations to keep it fast
        });

        // Fetch Real-Time Weather for each POI in parallel
        const weatherPromises = pois.map(async (poi) => {
            if (!poi.latitude || !poi.longitude) return null;
            const weather = await fetchRealTimeWeather(
                poi.latitude,
                poi.longitude,
            );
            if (!weather) return null;

            return {
                name: poi.name,
                temp: weather.temperature_2m,
                condition: getWeatherDescription(weather.weather_code),
                wind: weather.wind_speed_10m,
                humidity: weather.relative_humidity_2m,
            };
        });

        const realTimeWeatherResults = (
            await Promise.all(weatherPromises)
        ).filter((w) => w !== null);

        // Format Alerts Context
        const alertContext =
            alerts.length > 0
                ? alerts
                      .map(
                          (a) =>
                              `- ⚠️ ${a.level || 'Alert'} (${a.phenomenon || 'General'}) in ${a.Location ? a.Location.name : 'Unknown'}.`,
                      )
                      .join('\n')
                : 'No active alerts.';

        // Format Weather Context
        const weatherContext = realTimeWeatherResults
            .map(
                (w) =>
                    `- **${w.name}**: ${w.temp}°C, ${w.condition}, Wind: ${w.wind}km/h, Humidity: ${w.humidity}%`,
            )
            .join('\n');

        // --- 2. CONSTRUCT SYSTEM PROMPT ---

        const systemInstruction = `
        You are Canary Weather AI.

        REAL-TIME DATA:
        [ALERTS]
        ${alertContext}

        [WEATHER]
        ${weatherContext}

        GUIDELINES:
        1. **ACCURACY:** Use the provided REAL-TIME DATA. Do not invent numbers.
        2. **STYLE:** Be **concise**, **direct**, and **minimalist**. Avoid "fluff" or excessive emojis.
        3. **FORMAT:**
           - **Location:** Temp, Condition. Wind.
           - (Optional) One short, useful sentence.
        4. **ALERTS:** If asked about alerts without location, ask "Which island?".
        5. **REFUSAL:** Only answer about Canary Islands weather.

        BAD RESPONSE:
        "### 🌤️ Weather in Tenerife
        It is currently 22 degrees! It's a beautiful day to go outside. Don't forget your sunscreen! ☀️🌊"

        GOOD RESPONSE:
        "**Tenerife:** 22°C, Partly Cloudy ⛅. Wind: 15 km/h.
        UV index is moderate."
        `;

        // --- 3. CALL GROQ API ---

        const groq = new Groq({ apiKey });

        const messages = [{ role: 'system', content: systemInstruction }];

        if (history && Array.isArray(history)) {
            history.forEach((msg) => {
                const role = msg.type === 'bot' ? 'assistant' : 'user';
                messages.push({ role, content: msg.text });
            });
        }

        messages.push({ role: 'user', content: message });

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3, // Lower temperature for more factual/concise responses
            max_tokens: 512,
        });

        const text =
            completion.choices[0]?.message?.content ||
            "Sorry, I couldn't generate a response.";

        res.json({ text });
    } catch (error) {
        console.error('AI Error Details:', error);
        const errorMessage = error.message || 'Failed to process AI request';
        res.status(500).json({ error: errorMessage });
    }
};
