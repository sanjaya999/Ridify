import axios from "axios";

// Main API client that includes the auth header
const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
});

// A separate, clean Axios instance for the refresh token call
const refreshApiClient = axios.create({
    baseURL: "https://rentthis-dawn-shape-1905.fly.dev",
});

let isRefreshing = false;
let failedQueue = []; // Correctly initialized

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor to add the access token to every request
apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
// apiClient.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;
//
//         // Check for 401 error and ensure it's not a retry
//         if (error.response && error.response.status === 401 && !originalRequest._retry && originalRequest.headers.Authorization) {
//
//             if (isRefreshing) {
//                 return new Promise(function (resolve, reject) {
//                     failedQueue.push({ resolve, reject });
//                 })
//                 .then((token) => {
//                     originalRequest.headers['Authorization'] = 'Bearer ' + token;
//                     return apiClient(originalRequest);
//                 })
//                 .catch((err) => {
//                     return Promise.reject(err);
//                 });
//             }
//
//             originalRequest._retry = true;
//             isRefreshing = true;
//
//             const refreshToken = localStorage.getItem('refresh');
//
//             try {
//                 // Use the clean refreshApiClient for the refresh call
//                 const response = await refreshApiClient.post('/api/v1/auth/refresh', { refreshToken });
//
//                 const newAccessToken = response.data.accessToken;
//                 const newRefreshToken = response.data.refreshToken;
//
//                 localStorage.setItem('accessToken', newAccessToken);
//                 localStorage.setItem('refresh', newRefreshToken);
//
//                 apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
//
//                 processQueue(null, newAccessToken);
//
//                 originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
//                 return apiClient(originalRequest);
//
//             } catch (_error) {
//                 processQueue(_error, null);
//                 localStorage.removeItem('accessToken');
//                 localStorage.removeItem('refresh');
//                 localStorage.removeItem('user');
//                 localStorage.removeItem('role');
//                 window.location.href = '/login';
//                 return Promise.reject(_error);
//             } finally {
//                 isRefreshing = false;
//             }
//         }
//
//         // For all other errors, just reject them
//         return Promise.reject(error);
//     }
// );


// Your exported API functions (get, post, etc.) remain the same
export const get = async (endpoint, config) => {
    try {
        const response = await apiClient.get(endpoint, config);
        return response.data;
    } catch (error) {
        console.error('GET request error:', error);
        throw error;
    }
};

export const post = async (endpoint, data) => {
    try {
        const response = await apiClient.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error('POST request error:', error);
        throw error;
    }
};

export const del = async (endpoint) => {
    try {
        const response = await apiClient.delete(endpoint);
        return response.data;
    } catch (error) {
        console.error('DELETE request error:', error);
        throw error;
    }
};

export const put = async (endpoint, data) => {
    try {
        const response = await apiClient.put(endpoint, data);
        return response.data;
    } catch (error) {
        console.error('PUT request error:', error);
        throw error;
    }
};

export { apiClient };
