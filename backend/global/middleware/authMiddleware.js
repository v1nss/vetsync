import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../../src/models/users/userModel.js';

dotenv.config();

// Main authentication middleware - verifies token from httpOnly cookie
export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user object from database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Verify if user is a PetOwner
export const verifyOwner = (req, res, next) => {
  if (req.user.user_type !== 'pet_owner') {
    return res.status(403).json({ message: 'Access denied - PetOwner only' });
  }
  next();
};

// Verify if user is a ClinicAdmin
export const verifyClinicAdmin = (req, res, next) => {
  if (req.user.user_type !== 'clinic_admin') {
    return res.status(403).json({ message: 'Access denied - ClinicAdmin only' });
  }
  next();
};

// Verify if user is a VetProfessional
export const verifyVetProfessional = (req, res, next) => {
  if (req.user.user_type !== 'vet_professional') {
    return res.status(403).json({ message: 'Access denied - VetProfessional only' });
  }
  next();
};

// Verify if user is a System Admin
export const verifySystemAdmin = (req, res, next) => {
  if (req.user.user_type !== 'system_admin') {
    return res.status(403).json({ message: 'Access denied - System Admin only' });
  }
  next();
};
