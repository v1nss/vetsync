import bcrypt from 'bcryptjs';
import User from '../models/users/userModel.js';
import ClinicAdmin from '../models/users/clinicAdminModel.js';
import VetProfessional from '../models/users/vetProfessionalModel.js';
import PetOwner from '../models/users/petOwnerModel.js';
import Clinic from '../models/clinicModel.js';

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
export const getAllClinics = async (status) => {
  try {
    // Only filter if status is valid
    const validStatuses = ["pending", "approved", "rejected"];
    const where = validStatuses.includes(status) ? { status } : {};

    const clinics = await Clinic.findAll({
      where,
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "full_name", "email"],
        },
      ],
      order: [["clinic_id", "ASC"]],
    });

    return clinics.map((c) => ({
      clinic_id: c.clinic_id,
      name: c.name,
      address: c.address,
      contact_number: c.contact_number,
      email: c.email,
      status: c.status,
      images: c.images || [],
      owner: c.owner
        ? {
            id: c.owner.id,
            name: c.owner.full_name,
            email: c.owner.email,
          }
        : null,
    }));
  } catch (err) {
    console.error("Failed to fetch clinics:", err.message);
    throw err;
  }
};

export const acceptClinicStatus = async (clinicId) => {
  await Clinic.update(
    { status: "approved" },
    { where: { clinic_id: clinicId } }
  );
}

export const updateClinicStatus = async (clinicId, status) => {
  const validStatuses = ["pending", "approved", "rejected"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status. Must be 'pending', 'approved', or 'rejected'.");
  }
  
  const clinic = await Clinic.findByPk(clinicId);
  if (!clinic) {
    throw new Error("Clinic not found");
  }
  
  await Clinic.update(
    { status },
    { where: { clinic_id: clinicId } }
  );
  
  return clinic;
}