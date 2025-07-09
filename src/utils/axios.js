import axios from 'axios';

const apiURL = 'https://demo1.rafalsprengel.com/api/v1';

const api = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

api.defaults.headers.common['Content-Type'] = 'application/json';

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const isNetworkError = error.message === 'Network Error' || !error.response;
    const isBadGateway = status === 502 || status === 503 || status === 504;

    if (isNetworkError || isBadGateway) {
      window.location.href = '/no-connection';
      return;
    }

    if (status === 401) {
      try {
        const refreshResponse = await axios.post(
          '/auth/refresh-token',
          {},
          {
            baseURL: apiURL,
            withCredentials: true,
          }
        );

        if (refreshResponse.status === 200) {
          return api.request(error.config);
        } else {
          api.setIsAuthenticated(false);
        }
      } catch {
        api.setIsAuthenticated(false);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
