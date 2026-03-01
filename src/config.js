// Centralized API configuration
// In production, set REACT_APP_BACKEND_URL and REACT_APP_ML_API_URL environment variables

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const ML_API_URL = process.env.REACT_APP_ML_API_URL || 'http://127.0.0.1:5000';

const config = { BACKEND_URL, ML_API_URL };

export { BACKEND_URL, ML_API_URL };
export default config;
