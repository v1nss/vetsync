import axios from 'axios';
import api from '../utils/api.jsx';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// export const loginUser = async (email, password) => {
//     try {
//         const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
//         return res.data;
//     } catch (err) {
//         console.error('Login failed:', err.message);
//         throw err;
//     }
// };

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

export const registerUser = async (userData) => {
    try {
        const res = await api.post(`/users/register`, userData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log('Registration response data:', res.data);
        return res.data;
    } catch (err) {
        console.error('Registration failed:', err.message);
        throw err;
    }
};

export const checkEmailExists = async (email) => {
    try {
        const res = await api.put(`/users/email-check`, {email} );
        console.log('Email check response data:', res.data);
        return res.data.exists;
    } catch (err) {
        console.error('Email check failed:', err.message);
        throw err;
    }
};

