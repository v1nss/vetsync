import bcrypt from "bcryptjs";
import User from "../models/users/userModel.js";
import PetOwner from "../models/users/petOwnerModel.js";
import ClinicAdmin from "../models/users/clinicAdminModel.js";
import VetProfessional from "../models/users/vetProfessionalModel.js";
import { uploadFiles } from "../../global/utils/drive.js";

export const registerUser = async (userData) => {
  const { body, file } = userData;
  console.log("Received body: ", file);
  // Parse the user JSON sent in form-data
  const user = JSON.parse(body.user);
  console.log("Parsed user data: ", user);
  const { full_name, email, password, user_type, address, clinic_name } = user;
  // Check if email already exists
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("Email already registered");

  // Upload profile image if provided
  let userProfile = null;
  if (file) {
    const uploadedFile = await uploadFiles(
      file,
      process.env.GDRIVE_FOLDER_ID
    );

    userProfile = {
      id: uploadedFile.id,
      name: uploadedFile.name,
      // Primary link - Googleusercontent (most reliable)
      link: `https://lh3.googleusercontent.com/d/${uploadedFile.id}`,
      // Alternative links for fallback
      viewLink: uploadedFile.webViewLink,
      downloadLink: uploadedFile.webContentLink,
      // Thumbnail for optimization
      thumbnail: `https://drive.google.com/thumbnail?id=${uploadedFile.id}&sz=w400`
    };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  try {
    const newUser = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      user_type,
      profile_image_url: userProfile,
    });

    // Create related table entry based on user type
    if (user_type === "pet_owner") {
      await PetOwner.create({ user_id: newUser.id, address });
    } else if (user_type === "clinic_admin") {
      await ClinicAdmin.create({ user_id: newUser.id, clinic_name });
    }

    return newUser;
  } catch (err) {
    console.error("Error registering user:", err.message);
    throw err;
  }
};

export const registerVetProfessional = async (req, adminUserId) => {
  const { body, file } = req;
  
  // Parse the user JSON sent in form-data
  const data = body.user ? JSON.parse(body.user) : body;
  const { full_name, email, password, specialization, license_number } = data;

  const admin = await ClinicAdmin.findOne({ where: { user_id: adminUserId } });

  if (!admin)
    throw new Error("Only clinic admins can register vet professionals");

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("Email already registered");

  // Upload profile image if provided
  let userProfile = null;
  if (file) {
    const uploadedFile = await uploadFiles(
      file,
      process.env.GDRIVE_FOLDER_ID
    );

    userProfile = {
      id: uploadedFile.id,
      name: uploadedFile.name,
      // Primary link - Googleusercontent (most reliable)
      link: `https://lh3.googleusercontent.com/d/${uploadedFile.id}`,
      // Alternative links for fallback
      viewLink: uploadedFile.webViewLink,
      downloadLink: uploadedFile.webContentLink,
      // Thumbnail for optimization
      thumbnail: `https://drive.google.com/thumbnail?id=${uploadedFile.id}&sz=w400`
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    full_name,
    email,
    password_hash: hashedPassword,
    user_type: "vet_professional",
    profile_image_url: userProfile,
  });

  await VetProfessional.create({
    user_id: user.id,
    clinic_admin_id: adminUserId,
    specialization,
  });

  return user;
};

export const updateUserProfile = async (userId, profileData) => {
  // should handle multiple userTypes
  let new_hash = null;
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const { password } = profileData;

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    new_hash = await bcrypt.hash(password, 10);
  }

  await user.update({
    password_hash: new_hash || user.password_hash,
    ...profileData
  });
  return user;
}

export const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password_hash'] }
  });
  if (!user) throw new Error("User not found");
  return user;
}

export const verifyExistingEmail = async (email) => {
  const existing = await User.findOne({ where: { email } });
  return !!existing;
};

export const getVetsByClinicAdmin = async (clinicAdminId) => {
  const vets = await VetProfessional.findAll({
    where: {
      clinic_admin_id: clinicAdminId
    },
    include: [
      {
        model: User,
        attributes: ["id", "full_name", "email"]
      }
    ]
  });
  return vets;
};
