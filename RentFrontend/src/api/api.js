import axios from "axios"
//base axios instance created with base url and headers (default)
const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    headers : {
        'Content-Type': 'application/json',
    }
})

let isRefreshing = false;;
let failedQueue = [];

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

//interceptor will add authorization headers to every request
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    console.log('[Interceptor] Current token:', token); // Debug log
    console.log('[Interceptor] Original headers:', config.headers); // Debug log
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[Interceptor] Modified headers:', config.headers); // Debug log
    }
    return config;
  },
  error => {
    console.error('[Interceptor] Error:', error);
    return Promise.reject(error);
  }
);

  export const get = async (endpoint) => {
    try {
      const response = await apiClient.get(endpoint);
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
export {apiClient}