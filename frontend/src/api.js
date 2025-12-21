import axios from 'axios';

// Change this to your Railway URL when deployed
const API_URL = 'web-production-1366c.up.railway.app/api/';

const api = axios.create({
    baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Simplistic auth
    // For this simple demo, we will rely on session auth or simple headers if we implemented JWT.
    // Since we picked SessionAuth for "Simplicity" in the prompt, we need credentials include.
    // However, for separated frontend/backend, Token/JWT is better.
    // Let's stick to Basic Auth or just assume the user is logged in via Session for the same domain?
    // CORS + Cross-domain session is hard.
    // I shall switch Backend to use TokenAuthentication for simplicity in a decoupled app.
    // Wait, the prompt asked for "Simple". I'll add Basic Auth using username/password stored in localstorage? 
    // No, that's insecure.
    // Let's assume we do a login call that returns a token (even if it's just the user ID for this Mock).
    // CORRECT APPROACH: I'll use Basic Auth for this demo because it's built-in and stateless enough.
    
    const basicAuth = localStorage.getItem('auth');
    if (basicAuth) {
        config.headers.Authorization = `Basic ${basicAuth}`;
    }
    return config;
});

export default api;
