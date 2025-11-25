/**
 * @deprecated This file is deprecated as the application now uses httpOnly cookies
 * managed by the backend. Tokens are automatically sent with requests via the api
 * instance configured in utils/api.jsx with withCredentials: true.
 * 
 * Client-side token management is no longer needed for security reasons.
 * All authentication is handled via httpOnly cookies set by the backend.
 */

// These functions are kept for backward compatibility but should not be used
export const saveToken = (token) => {
    console.warn('saveToken is deprecated - using httpOnly cookies');
    document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
};

export const saveRefreshToken = (refreshToken) => {
    console.warn('saveRefreshToken is deprecated - using httpOnly cookies');
    document.cookie = `refreshToken=${refreshToken}; path=/; secure; SameSite=Strict; max-age=604800`;
};

export const getToken = () => {
    console.warn('getToken is deprecated - using httpOnly cookies');
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("authToken="));
    return tokenCookie ? decodeURIComponent(tokenCookie.split("=")[1]) : null;
};

export const getRefreshToken = () => {
    console.warn('getRefreshToken is deprecated - using httpOnly cookies');
    const cookies = document.cookie.split('; ');
    const refreshTokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("refreshToken="));
    
    if (!refreshTokenCookie) return null;
    return decodeURIComponent(refreshTokenCookie.split("=")[1]);
};

export const removeToken = () => {
    console.warn('removeToken is deprecated - using httpOnly cookies');
    document.cookie = 'authToken=; path=/; max-age=0';
};

export const removeRefreshToken = () => {
    console.warn('removeRefreshToken is deprecated - using httpOnly cookies');
    document.cookie = 'refreshToken=; path=/; max-age=0';
};
