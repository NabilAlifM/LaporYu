import Axios from 'axios';

const axios = Axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
    },
    withCredentials: true,
    withXSRFToken: true
});

// Interceptor to handle global errors (like 401 Unauthorized)
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Optional: Handle unauthorized by clearing local state
            // But usually Zustand store will handle it via derived state or we can call store method directly
        }
        return Promise.reject(error);
    }
);

export default axios;
