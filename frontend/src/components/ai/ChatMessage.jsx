import PropTypes from 'prop-types';

export default function ChatMessage({ message, type }) {
    return (
        <div
            className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm rounded-bl-none'
                }`}
            >
                {message}
            </div>
        </div>
    );
}

ChatMessage.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['user', 'bot']).isRequired,
};
