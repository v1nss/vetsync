import { loginUser, generateRefreshTokenService } from "../services/authService.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token, refreshToken } = await loginUser({ email, password });
    res.status(200).json({
      message: "Login successful",
      token,
      refreshToken,
      user,
    });
  } catch (err) {
    console.error("Unable to Login User", err.message);
    res.status(400).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear auth cookies if they exist
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/'
    });
    
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/'
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Unable to logout User", err.message);
    res.status(400).json({ error: err.message });
  }
};

export const generateRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "No refresh token provided" });
    }

    const token = await generateRefreshTokenService(refreshToken, res);
    
    return res.status(200).json({ message: "Refresh Token Generated", token });
  } catch (err) {
    console.error("Unable to generate refresh token", err.message);
    res.status(400).json({ error: err.message });
  }
}
