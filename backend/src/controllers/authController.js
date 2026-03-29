import { loginUser, refreshAccessToken } from "../services/authService.js";
import User from "../models/users/userModel.js";
import VetProfessional from "../models/users/vetProfessionalModel.js";
import PetOwner from "../models/users/petOwnerModel.js";
import ClinicAdmin from "../models/users/clinicAdminModel.js";
import { lstat } from "fs";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token, refreshToken } = await loginUser({ email, password });

    // Set httpOnly cookies for security
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    
    // Send appropriate error messages
    if (err.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (err.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    return res.status(400).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear auth cookies
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
       secure: true,
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err.message);
    return res.status(500).json({ error: "Logout failed" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    const newAccessToken = await refreshAccessToken(refreshToken);

    // Set new access token cookie
    res.cookie("authToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({ 
      message: "Token refreshed successfully"
    });
  } catch (err) {
    console.error("Token refresh error:", err.message);
    
    // Clear invalid cookies
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");
    
    return res.status(401).json({ error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch user with associations
    const user = await User.findByPk(userId, {
      include: [
        {
          model: VetProfessional,
          required: false
        },
        {
          model: PetOwner,
          required: false
        },
        {
          model: ClinicAdmin,
          required: false
        }
      ],
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ message: "Error fetching user" });
  }
};