import axios from 'axios';

import { saveToken, saveRefreshToken, getRefreshToken } from '../utils/token.jsx';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const loginUser = async (email, password) => {
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        const { token, refreshToken, user } = res.data;

        saveToken(token);
        saveRefreshToken(refreshToken);

        return res.data;
    } catch (err) {
        console.error('Login failed:', err.message);
        throw err;
    }
};

export const refreshAuthToken = async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        console.error("No refresh token available");
        throw new Error("No refresh token available");
    }

    try {
        const res = await axios.post( `${BASE_URL}/auth/refresh-token`,
            { refreshToken }, 
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true 
            }
        );

        const { token } = res.data;
        saveToken(token);
        return token;
    } catch (err) {
        console.error('Token refresh failed:', err.message);
        throw err;
    }
};