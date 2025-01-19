import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    withCredentials: true,
});

api.defaults.headers.common['Content-Type'] = 'application/json';


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                const refreshResponse = await axios.post(
                    '/auth/refresh-token',
                    {},
                    {
                        baseURL: 'http://localhost:3001/api',
                        withCredentials: true,
                    }
                );

                if (refreshResponse.status === 200) {
                    return api.request(error.config);
                } else {
                    api.setIsAuthenticated(false);
                }
            } catch (refreshError) {
                console.log('failed to refresh access token');
                api.setIsAuthenticated(false);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
