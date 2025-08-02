import axios from 'axios';

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout
});

// Add request interceptor for authentication if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server returned an error response
      console.error('API Error:', error.response.data);
      
      // Add a more descriptive message based on status code
      switch (error.response.status) {
        case 404:
          error.message = 'API endpoint not found. Please check server configuration.';
          break;
        case 500:
          error.message = 'Internal server error. Please check server logs.';
          break;
        case 401:
          error.message = 'Unauthorized. Please check your credentials.';
          break;
        case 403:
          error.message = 'Forbidden. You do not have permission to access this resource.';
          break;
        default:
          error.message = error.response.data.message || `Server error: ${error.response.status}`;
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
      error.message = 'Network error. Please check if the backend server is running.';
      error.code = 'ERR_NETWORK'; // Ensure consistent error code
    } else {
      // Error during request setup
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Check server health
const checkServerHealth = async () => {
  try {
    const response = await api.get('/health', { timeout: 5000 });
    return { 
      isHealthy: true, 
      data: response.data,
      message: response.data.message || 'Server is running'
    };
  } catch (error) {
    console.error('Server health check failed:', error);
    
    // Differentiate between different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        isHealthy: false,
        status: error.response.status,
        data: error.response.data,
        message: 'Server is running but returned an error response'
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        isHealthy: false,
        message: 'Network error. Backend server might not be running.'
      };
    } else {
      // Something happened in setting up the request
      return {
        isHealthy: false,
        message: `Request error: ${error.message}`
      };
    }
  }
};

// Retry mechanism for failed requests
const withRetry = async (apiCall, maxRetries = 2, delay = 1000) => {
  let lastError;
  
  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
    try {
      if (retryCount > 0) {
        console.log(`Retry attempt ${retryCount}/${maxRetries}...`);
      }
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain status codes
      if (error.response && [400, 401, 403, 404].includes(error.response.status)) {
        break;
      }
      
      // Only retry on server errors or network issues
      if (!error.response || error.response.status >= 500) {
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      break;
    }
  }
  
  throw lastError;
};

// API endpoint functions
const endpoints = {
  // Server health check
  checkHealth: checkServerHealth,
  
  // Campaign endpoints
  getCampaigns: () => withRetry(() => api.get('/campaigns')),
  getCampaignById: (id) => withRetry(() => api.get(`/campaigns/${id}`)),
  createCampaign: (data) => api.post('/campaigns', data),
  updateCampaign: (id, data) => api.put(`/campaigns/${id}`, data),
  deleteCampaign: (id) => api.delete(`/campaigns/${id}`),
  
  // Marketing data endpoints
  getMarketingData: () => withRetry(() => api.get('/marketing-data')),
  getMarketingDataById: (id) => withRetry(() => api.get(`/marketing-data/${id}`)),
  
  // Dashboard analytics endpoints
  getDashboardAnalytics: () => withRetry(() => api.get('/dashboard-analytics')),
};

export default endpoints;
