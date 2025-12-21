import PropTypes from 'prop-types';

const PrecipitationChart = ({ data }) => {
    const maxAmount = Math.max(...data.map((d) => d.amount), 1); // Avoid division by zero

    return (
        <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-100 dark:border-gray-700 shadow-sm">
            <h4 className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                Precipitación Semanal
            </h4>
            <div className="flex justify-between items-end h-40 gap-2 sm:gap-3">
                {data.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 group relative h-full justify-end">
                        {/* Tooltip */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-20 shadow-lg">
                            <span className="font-bold">{item.amount}mm</span>
                            <span className="block text-gray-300 text-[9px]">Prob: {item.prob}%</span>
                        </div>
                        
                        {/* Bar Container */}
                        <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-t-md relative overflow-hidden h-full flex items-end transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
                            {/* Rain Amount Bar */}
                            <div 
                                className="w-full bg-blue-400 dark:bg-blue-500 transition-all duration-700 ease-out relative group-hover:bg-blue-500 dark:group-hover:bg-blue-400"
                                style={{ height: `${(item.amount / maxAmount) * 100}%`, minHeight: item.amount > 0 ? '4px' : '0' }}
                            >
                                {/* Probability Overlay (Darker blue at bottom) */}
                                <div 
                                    className="absolute bottom-0 left-0 right-0 bg-blue-600 dark:bg-blue-300 transition-all duration-500 opacity-30"
                                    style={{ height: `${item.prob}%` }}
                                />
                            </div>
                        </div>
                        
                        {/* Label */}
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 font-medium uppercase">
                            {item.day}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function ChatMessage({ message, type }) {
    // Simple regex to extract JSON block ```json ... ```
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = message.match(jsonRegex);
    
    let textContent = message;
    let chartData = null;

    if (match) {
        try {
            const jsonContent = JSON.parse(match[1]);
            if (jsonContent.type === 'precipitation_chart') {
                chartData = jsonContent.data;
                textContent = message.replace(match[0], '').trim();
            }
        } catch (e) {
            console.error("Failed to parse chart JSON", e);
        }
    }

    return (
        <div
            className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm rounded-bl-none border border-gray-100 dark:border-gray-600'
                }`}
            >
                <div className="whitespace-pre-wrap">{textContent}</div>
                {chartData && <PrecipitationChart data={chartData} />}
            </div>
        </div>
    );
}

ChatMessage.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['user', 'bot']).isRequired,
};
