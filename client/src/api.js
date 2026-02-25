// All API calls use this base URL.
// In development: http://localhost:5000
// In production:  set VITE_API_URL in your Vercel environment variables
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_BASE;
