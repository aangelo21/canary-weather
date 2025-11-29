const API_BASE = import.meta.env.VITE_API_BASE;

let accessToken = null;

/**
 * Sets the global access token for API requests.
 * 
 * @param {string} token - The JWT access token.
 */
export const setAccessToken = (token) => {
  accessToken = token;
};

/**
 * Retrieves the current access token.
 * 
 * @returns {string|null} The current JWT access token or null if not set.
 */
export const getAccessToken = () => accessToken;

/**
 * Performs an API request with automatic token handling.
 * 
 * Wraps the standard `fetch` API to:
 * 1. Prepend the base API URL.
 * 2. Inject the Authorization header with the current access token.
 * 3. Handle 401 Unauthorized responses by attempting to refresh the token via the session cookie.
 * 4. Retry the original request if the token refresh is successful.
 * 
 * @param {string} endpoint - The API endpoint (e.g., '/users').
 * @param {Object} [options={}] - Fetch options (method, headers, body, etc.).
 * @returns {Promise<Response>} The fetch Response object.
 */
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
