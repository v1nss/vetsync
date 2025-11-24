

export const saveToken = (token) => {
    document.cookie = `authToken=${token}; path=/; SameSite=Strict; max-age=${60 * 15}`; // 15 minutes
};

export const saveRefreshToken = (refreshToken) => {
    document.cookie = `refreshToken=${refreshToken}; path=/; SameSite=Strict; max-age=604800`; // 7 days
};

export const getToken = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("authToken="));
    return tokenCookie ? decodeURIComponent(tokenCookie.split("=")[1]) : null;
};

export const getRefreshToken = () => {
    const cookies = document.cookie.split('; ');
    const refreshTokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("refreshToken="));
    return refreshTokenCookie ? decodeURIComponent(refreshTokenCookie.split("=")[1]) : null;
};



export const removeToken = () => {
    document.cookie = 'authToken=; path=/; max-age=0';
};

export const removeRefreshToken = () => {
    document.cookie = 'refreshToken=; path=/; max-age=0';
};

