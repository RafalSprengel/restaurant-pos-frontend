import axios from 'axios';

//const apiURL= process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : 'https://api.justcode.uk/api';

const apiURL = 'https://api.justcode.uk/v1';
const api = axios.create({
    baseURL: apiURL,
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
                        baseURL: apiURL,
                        withCredentials: true,
                    }
                );

                if (refreshResponse.status === 200) {
                    return api.request(error.config);
                } else {
                    api.setIsAuthenticated(false);
                }
            } catch (refreshError) {
                api.setIsAuthenticated(false);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
