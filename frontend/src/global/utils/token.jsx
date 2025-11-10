

export const saveToken = (token) => {
    document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
};

export const saveRefreshToken = (refreshToken) => {
    document.cookie = `refreshToken=${refreshToken}; path=/; secure; SameSite=Strict; max-age=604800`; // 7 days
};

export const getToken = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(cookie => cookie.startsWith('authToken='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
};

export const getRefreshToken = () => {
    const cookies = document.cookie.split('; ');
    const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));

    console.log("Retrieved Refresh Token:", refreshTokenCookie);
    return refreshTokenCookie ? refreshTokenCookie.split('=')[1] : null;
};


export const removeToken = () => {
    document.cookie = 'authToken=; path=/; max-age=0';
};

export const removeRefreshToken = () => {
    document.cookie = 'refreshToken=; path=/; max-age=0';
};

