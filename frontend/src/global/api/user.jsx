import axiosInstance from '../../utils/axiosInstance.js';

export const fetchUserData = async (id, token = null) => {
    try {
        const config = {};
        // If token is explicitly provided, use it (for initial login)
        if (token) {
            config.headers = { Authorization: `Bearer ${token}` };
        }
        const res = await axiosInstance.get(`/users/${id}`, config);
        return res.data;
    } catch (err) {
        console.error('Failed to fetch user data:', err.message);
        throw err;
    }
};

export const registerUser = async (userData) => {
    try {
        const res = await axiosInstance.post(`/users/register`, userData, {
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
        const res = await axiosInstance.put(`/users/email-check`, { email });
        return res.data.exists;
    } catch (err) {
        console.error('Email check failed:', err.message);
        throw err;
    }
};

