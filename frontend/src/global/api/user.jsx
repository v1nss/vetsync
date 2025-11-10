import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const loginUser = async (email, password) => {
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        return res.data;
    } catch (err) {
        console.error('Login failed:', err.message);
        throw err;
    }
};

export const fetchUserData = async (id, token) => {
    try {
        const res = await axios.get(`${BASE_URL}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        console.error('Failed to fetch user data:', err.message);
        throw err;
    }
};

