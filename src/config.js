const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const ML_API_URL = process.env.REACT_APP_ML_API_URL || 'https://malivorematters-agrotech-ml-api.hf.space';

const config = { BACKEND_URL, ML_API_URL };

export { BACKEND_URL, ML_API_URL };
export default config;
