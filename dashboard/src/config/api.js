// API configuration - uses environment variables
// For local development: http://localhost:3001
// For production: Set REACT_APP_API_URL environment variable

const getApiUrl = () => {
  // Check for environment variable first
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Default to localhost for development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }

  // For production without explicit URL, use relative path
  // (works if API and frontend are on same domain)
  return '';
};

export const API_BASE_URL = getApiUrl();

export default API_BASE_URL;
