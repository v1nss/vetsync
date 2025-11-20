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

  return { user, token, refreshToken };
};


export const generateRefreshTokenService = async (refreshToken) => {
  // Implementation for refreshing token can be added here

  if (!refreshToken) throw new Error('No refresh token provided');
  
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) throw new Error("User not found");

   const token = generateToken({ id: user.id, user_type: user.user_type });

  res.cookie('authToken', token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 36000000, 
  });

   return token; 
}