const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const ML_API_URL = process.env.REACT_APP_ML_API_URL;
const GEMINI_API = process.env.REACT_APP_GEMINI_API_KEY;

const config = { BACKEND_URL, ML_API_URL, GEMINI_API };

export { BACKEND_URL, ML_API_URL, GEMINI_API };
export default config;
