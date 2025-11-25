import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users/userModel.js';
import generateToken from '../../global/utils/generateToken.js';
import generateRefreshToken from '../../global/utils/generateRefreshToken.js';
import dotenv from 'dotenv';

dotenv.config();

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken({ id: user.id, user_type: user.user_type });
  const refreshToken = generateRefreshToken({ id: user.id, user_type: user.user_type });

  // Return user without password
  const userWithoutPassword = {
    id: user.id,
    email: user.email,
    user_type: user.user_type,
    full_name: user.full_name,
    phone_number: user.phone_number,
    profile_image_url: user.profile_image_url,
    createdAt: user.createdAt,
  };

  return { user: userWithoutPassword, token, refreshToken };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error('No refresh token provided');

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) throw new Error('User not found');

    const newAccessToken = generateToken({ id: user.id, user_type: user.user_type });
    
    return newAccessToken;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    }
    throw new Error('Invalid refresh token');
  }
};