const API_BASE = import.meta.env.VITE_API_BASE;

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

export const apiFetch = async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;

    const headers = {
        ...options.headers,
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const config = {
        ...options,
        headers,
    };

    let response = await fetch(url, config);

    if (response.status === 401) {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                console.error('No refresh token available');
                return response;
            }

            const refreshResponse = await fetch(
                `${API_BASE}/users/refresh-token`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                },
            );

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                setAccessToken(data.token);

                headers['Authorization'] = `Bearer ${data.token}`;
                const newConfig = {
                    ...options,
                    headers,
                };
                response = await fetch(url, newConfig);
            } else {
                console.error('Session expired');
            }
        } catch (error) {
            console.error('Error refreshing token', error);
        }
    }

    return response;
};
