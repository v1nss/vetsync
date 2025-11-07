import User from '../models/users/userModel.js';
import ClinicAdmin from '../models/users/clinicAdminModel.js';
import VetProfessional from '../models/users/vetProfessionalModel.js';
import PetOwner from '../models/users/petOwnerModel.js';
import Clinic from '../models/clinicModel.js';
import bcrypt from 'bcryptjs';


export const registerSystemAdmin = async (adminData) => {

  const { full_name, email, password } = adminData;

    const existing = await User.findOne({ where: { email } });
    if (existing) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      const user = await User.create({  
        full_name,
        email,
        password_hash: hashedPassword, 
        user_type: 'system_admin',
      });
      return user;
    } catch (err) {
        console.error('Error registering system admin', err.message);
        throw err;
    }
};

export const getAllUsers = async () => {
  try {
    const users = await User.findAll({
        attributes: { exclude: ['password_hash'] },
    });
    return users;
  } catch (err) {
    console.error('Error fetching users', err.message);
    throw err;
  }
};

// clinic side
export const getAllClinics = async () => {
    try {
     const clinics = await Clinic.findAll(); 
     return clinics;
    } catch (err) {
        console.error('Error fetching clinics', err.message);
        throw err;
    } 
}
