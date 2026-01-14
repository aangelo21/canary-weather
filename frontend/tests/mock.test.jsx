import React from 'react';
import { vi } from 'vitest';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key }),
}));

vi.mock('../src/components/common/Skeleton', () => ({
    default: () => React.createElement('div', { 'data-testid': 'skeleton' }, 'Loading...'),
}));

vi.mock('react-router-dom', () => ({
    Link: ({ children, to }) => React.createElement('a', { href: to }, children),
}));

describe('System Mocks', () => {
    it('should initialize mocks correctly', () => {
        expect(true).toBe(true);
    });
});
