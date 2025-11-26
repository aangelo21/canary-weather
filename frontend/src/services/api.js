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
    credentials: 'include', // Always include cookies for refresh token endpoint
  };

  let response = await fetch(url, config);

  if (response.status === 401) {
    // Try to refresh token
    try {
      const refreshResponse = await fetch(`${API_BASE}/users/refresh-token`, {
        method: 'POST',
        credentials: 'include', // Send session cookie
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setAccessToken(data.token);
        
        // Retry original request with new token
        headers['Authorization'] = `Bearer ${data.token}`;
        const newConfig = {
          ...options,
          headers,
          credentials: 'include',
        };
        response = await fetch(url, newConfig);
      } else {
        // Refresh failed, user needs to login again
        // Optionally redirect to login or clear state
        console.error('Session expired');
      }
    } catch (error) {
      console.error('Error refreshing token', error);
    }
  }

  return response;
};
