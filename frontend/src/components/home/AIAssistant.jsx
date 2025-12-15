import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { askAI, generateWeatherSummary } from '../../services/aiService';
import AIFloatingButton from '../ai/AIFloatingButton';
import ChatWindow from '../ai/ChatWindow';

export default function AIAssistant({ weather }) {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && messages.length === 0 && weather) {
            const lang = i18n.language.split('-')[0];
            const summary = generateWeatherSummary(weather, lang);
            setMessages([
                {
                    type: 'bot',
                    text: `${t('aiGreeting') || 'Hello! I am your AI Weather Assistant.'} ${summary}`,
                },
            ]);
        }
    }, [isOpen, weather, i18n.language, messages.length, t]);

    const handleSendMessage = async (userMessage) => {
        setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
        setLoading(true);

        try {
            const lang = i18n.language.split('-')[0];
            const response = await askAI(userMessage, weather, lang, messages);
            setMessages((prev) => [...prev, { type: 'bot', text: response }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    type: 'bot',
                    text:
                        t('aiError') ||
                        'Sorry, I could not process your request.',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (!weather) return null;

    return (
        <>
            <AIFloatingButton
                isOpen={isOpen}
                onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
                <ChatWindow
                    messages={messages}
                    loading={loading}
                    onSendMessage={handleSendMessage}
                />
            )}
        </>
    );
}
