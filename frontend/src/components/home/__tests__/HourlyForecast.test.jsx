import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import HourlyForecast from '../HourlyForecast';


vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));

vi.mock('../../common/Skeleton', () => ({
    default: () => <div data-testid="skeleton">Loading...</div>,
}));

describe('HourlyForecast', () => {
    const mockCoords = { lat: 28.0, lon: -15.0 };

    const mockForecastData = {
        list: Array(10)
            .fill(null)
            .map((_, index) => ({
                dt: 1700000000 + index * 3600 * 3, 
                main: { temp: 20 + index },
                weather: [{ icon: '01d', main: 'Clear' }],
                sys: { pod: 'd' },
                pop: 0.1,
                wind: { speed: 5 + index }, 
            })),
    };

    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
        vi.stubGlobal('import.meta', {
            env: {
                VITE_OPENWEATHER_API_KEY: 'test-api-key',
            },
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should render forecast data successfully', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => mockForecastData,
        });

        render(<HourlyForecast coords={mockCoords} />);

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        
        expect(screen.getByText('20°')).toBeInTheDocument();

        
        expect(screen.getByText('5 km/h')).toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        global.fetch.mockRejectedValue(new Error('Network error'));

        render(<HourlyForecast coords={mockCoords} />);

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        expect(
            screen.getByText('Could not load forecast.'),
        ).toBeInTheDocument();
        consoleSpy.mockRestore();
    });
});
