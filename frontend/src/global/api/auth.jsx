import api from '../utils/api.jsx';

export const loginUser = async (email, password) => {
    try {
        const res = await api.post("/auth/login", { email, password });
        return res.data;
    } catch (err) {
        console.error('Login failed:', err);
        throw err;
    }
};

export const logoutUser = async () => {
    try {
        const res = await api.post("/auth/logout");
        return res.data;
    } catch (err) {
        console.error('Logout failed:', err);
        throw err;
    }
};

export const refreshAuthToken = async () => {
    try {
        const res = await api.post("/auth/refresh-token");
        return res.data;
    } catch (err) {
        console.error('Token refresh failed:', err);
        throw err;
    }
};

export const getCurrentUser = async () => {
    try {
        const res = await api.get("/auth/me");
        return res.data;
    } catch (err) {
        console.error('Get current user failed:', err);
        throw err;
    }
};