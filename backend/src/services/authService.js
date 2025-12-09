import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users/userModel.js';
import VetProfessional from '../models/users/vetProfessionalModel.js';
import PetOwner from '../models/users/petOwnerModel.js';
import ClinicAdmin from '../models/users/clinicAdminModel.js';
import generateToken from '../../global/utils/generateToken.js';
import generateRefreshToken from '../../global/utils/generateRefreshToken.js';
import dotenv from 'dotenv';

dotenv.config();

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ 
    where: { email },
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
    ]
  });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken({ id: user.id, user_type: user.user_type });
  const refreshToken = generateRefreshToken({ id: user.id, user_type: user.user_type });

  // Return user without password hash
  const userWithoutPassword = user.toJSON();
  delete userWithoutPassword.password_hash;

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