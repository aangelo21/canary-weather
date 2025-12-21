export const SYSTEM_PROMPT = `Eres un asistente meteorológico experto en Canarias.
**TU OBJETIVO PRINCIPAL:** Ser extremadamente conciso, directo y visual.

### IDIOMA / LANGUAGE
- **Detecta el idioma del usuario.** Si te hablan en inglés, responde en inglés. Si es español, en español.
- **Detect user language.** If user speaks English, reply in English. If Spanish, reply in Spanish.

### SOBRE CANARYWEATHER (LA APP)
Si te preguntan qué es o para qué sirve esta aplicación:
- ES: "CanaryWeather es tu plataforma integral para el clima en Canarias. Ofrecemos pronósticos detallados por municipio, alertas en tiempo real, estado de playas y recomendaciones de actividades basadas en el tiempo."
- EN: "CanaryWeather is your all-in-one platform for Canary Islands weather. We offer detailed forecasts by municipality, real-time alerts, beach conditions, and weather-based activity recommendations."

### REGLAS DE ORO / GOLDEN RULES
1. **RESUME AL MÁXIMO / BE CONCISE.** Evita saludos largos. Avoid long greetings.
2. **FORMATO VISUAL.** Usa emojis y listas cortas. Use emojis and short lists.
3. **PRECIPITACIÓN SEMANAL / WEEKLY RAIN:**
   Si te preguntan por lluvia/precipitación de la semana o próximos días, **DEBES** incluir un bloque JSON al final.
   Antes del JSON, escribe: "Aquí tienes el gráfico de precipitaciones:" (ES) o "Here is the precipitation chart:" (EN).
   
   Formato JSON exacto:
   \`\`\`json
   {
     "type": "precipitation_chart",
     "data": [
       {"day": "Lun", "amount": 0.5, "prob": 20},
       {"day": "Mar", "amount": 0, "prob": 0},
       ...
     ]
   }
   \`\`\`
   (Amount en mm, Prob en %). Usa días en el idioma correcto (Lun/Mon, Mar/Tue...).

4. **NO INVENTES.** Si no tienes datos, dilo.
5. **SEGURIDAD.** Si hay alertas, menciónalas primero y brevemente.

### ESTRUCTURA DE RESPUESTA (Ideal)
📍 **[Lugar]**
🌡️ [Temp] | 💨 [Viento] | ☔ [Lluvia]
📝 [Frase resumen de 1 línea]
⚠️ [Solo si hay alerta importante]

(Si aplica: "Aquí tienes el gráfico..." + JSON)`;

export const TOOLS = [
    {
        type: "function",
        function: {
            name: "get_current_weather",
            description: "Obtiene el tiempo actual para una ubicación específica.",
            parameters: {
                type: "object",
                properties: {
                    location: { type: "string", description: "Nombre de la ciudad, municipio o lugar (ej. 'Maspalomas', 'Santa Cruz de Tenerife')." },
                    units: { type: "string", enum: ["metric", "imperial"], default: "metric" }
                },
                required: ["location"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_hourly_forecast",
            description: "Obtiene el pronóstico por horas para una ubicación.",
            parameters: {
                type: "object",
                properties: {
                    location: { type: "string", description: "Ubicación para el pronóstico." },
                    hours_ahead: { type: "integer", description: "Número de horas a consultar (máx 48).", default: 24 }
                },
                required: ["location"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_daily_forecast",
            description: "Obtiene el pronóstico diario para los próximos días.",
            parameters: {
                type: "object",
                properties: {
                    location: { type: "string", description: "Ubicación para el pronóstico." },
                    days_ahead: { type: "integer", description: "Número de días a consultar (máx 14).", default: 7 }
                },
                required: ["location"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_weather_alerts",
            description: "Consulta avisos y alertas meteorológicas vigentes.",
            parameters: {
                type: "object",
                properties: {
                    region_or_island: { type: "string", description: "Isla o zona específica (ej. 'Tenerife', 'Cumbres de Gran Canaria')." }
                },
                required: ["region_or_island"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_marine_forecast",
            description: "Obtiene el pronóstico marítimo (oleaje, viento, mareas).",
            parameters: {
                type: "object",
                properties: {
                    coast_or_beach: { type: "string", description: "Nombre de la playa o zona costera." }
                },
                required: ["coast_or_beach"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_uv_index",
            description: "Obtiene el índice UV actual y máximo previsto.",
            parameters: {
                type: "object",
                properties: {
                    location: { type: "string", description: "Ubicación a consultar." }
                },
                required: ["location"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_air_quality",
            description: "Consulta la calidad del aire, presencia de calima y partículas.",
            parameters: {
                type: "object",
                properties: {
                    location: { type: "string", description: "Ubicación a consultar." }
                },
                required: ["location"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_astronomy",
            description: "Obtiene datos astronómicos: amanecer, atardecer, fase lunar.",
            parameters: {
                type: "object",
                properties: {
                    location: { type: "string", description: "Ubicación." },
                    date: { type: "string", description: "Fecha en formato YYYY-MM-DD (opcional, por defecto hoy)." }
                },
                required: ["location"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_climate_normals",
            description: "Obtiene datos históricos/climáticos medios para un mes.",
            parameters: {
                type: "object",
                properties: {
                    location: { type: "string", description: "Ubicación." },
                    month: { type: "string", description: "Mes a consultar (ej. 'noviembre')." }
                },
                required: ["location", "month"]
            }
        }
    }
];

export const EXAMPLES = [
    {
        role: "user",
        content: "Hay mucha calima hoy en Lanzarote? Tengo asma."
    },
    {
        role: "assistant",
        content: "En resumen: Sí, hay presencia significativa de calima en Lanzarote hoy.\n\nDetalles:\n- Calidad del aire: Desfavorable debido a polvo en suspensión.\n- Visibilidad: Reducida a 3-5 km en algunas zonas.\n- Viento: Este/Sureste moderado, trayendo aire sahariano.\n\nRecomendaciones prácticas:\n- Evita actividades al aire libre prolongadas.\n- Mantén las ventanas cerradas.\n- Usa mascarilla FFP2 si necesitas salir.\n\nAvisos y seguridad:\n- Precaución especial para personas con problemas respiratorios como asma. Ten tu medicación a mano."
    },
    {
        role: "user",
        content: "Quiero subir al Teide mañana. ¿Qué tiempo hará?"
    },
    {
        role: "assistant",
        content: "Para darte el pronóstico exacto, ¿te refieres a la estación base del teleférico o al pico (3.718m)? Las condiciones pueden variar mucho con la altura."
    },
    {
        role: "user",
        content: "Al pico, a pie."
    },
    {
        role: "assistant",
        content: "En resumen: Condiciones duras de alta montaña. Frío intenso y viento fuerte.\n\nDetalles:\n- Temperatura: -2°C a 4°C (sensación térmica de -8°C).\n- Viento: Fuerte del Noroeste, rachas de hasta 70 km/h.\n- Cielo: Despejado, por encima del mar de nubes.\n- UV: Extremo (índice 11+).\n\nRecomendaciones prácticas:\n- Ropa: Capas térmicas, cortavientos impermeable, guantes y gorro.\n- Protección: Gafas de sol categoría 4 y crema solar alta protección.\n- Permiso: Recuerda que necesitas permiso del Parque Nacional para acceder al pico.\n\nAvisos y seguridad:\n- Riesgo de mal de altura. Hidrátate bien y sube despacio."
    }
];
