import { apiFetch } from './api';

/**
 * AI Service for generating natural language weather summaries and handling user queries.
 * Now powered by Groq via the backend.
 */

export const askAI = async (question, weather, lang = 'en', history = []) => {
    try {
        const response = await apiFetch('/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: question,
                history: history,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Backend AI Error:', errorData);
            throw new Error(
                errorData.error ||
                    `AI Service Error: ${response.status} ${response.statusText}`,
            );
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error('AI Service Error:', error);
        return lang === 'es'
            ? 'Lo siento, no puedo conectar con el servicio de IA en este momento. Por favor, inténtalo de nuevo más tarde.'
            : 'Sorry, I cannot connect to the AI service at the moment. Please try again later.';
    }
};

// Deprecated helper functions (kept for reference if needed, but unused)
export const generateWeatherSummary = (weather, lang = 'en') => {
    return '';
};
