import bcrypt from "bcryptjs";
import User from "../models/users/userModel.js";
import PetOwner from "../models/users/petOwnerModel.js";
import ClinicAdmin from "../models/users/clinicAdminModel.js";
import VetProfessional from "../models/users/vetProfessionalModel.js";
import Clinic from "../models/clinicModel.js";
import { uploadFiles, deleteFiles } from "../../global/utils/drive.js";

export const registerUser = async (userData) => {
  const { body, file } = userData;
  console.log("Received body: ", file);
  // Parse the user JSON sent in form-data
  const user = JSON.parse(body.user);
  console.log("Parsed user data: ", user);
  const { first_name, last_name, email, password, user_type, address, clinic_name } = user;
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
      first_name,
      last_name,
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
  const { first_name, last_name, email, password, specialization, license_number } = data;
  const admin = await ClinicAdmin.findOne({ where: { user_id: adminUserId } });

  if (!admin)
    throw new Error("Only clinic admins can register vet professionals");

  // Get clinic_id from the clinic admin
  const clinic = await Clinic.findOne({
    where: { owner_id: adminUserId },
    attributes: ["clinic_id"],
  });

  if (!clinic) {
    throw new Error("Clinic admin must have an associated clinic");
  }

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
    first_name, 
    last_name, 
    email,
    password_hash: hashedPassword,
    user_type: "vet_professional",
    profile_image_url: userProfile,
  });

  await VetProfessional.create({
    user_id: user.id,
    clinic_admin_id: adminUserId,
    clinic_id: clinic.clinic_id,
    specialization,
    license_number,
  });

  return user;
};

export const updateUserProfile = async (req, userId) => {
  const { body, file } = req;
  
  // Parse the user JSON sent in form-data
  const profileData = body.user ? JSON.parse(body.user) : body;
  
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  // Handle password change
  let new_hash = null;
  if (profileData.currentPassword && profileData.newPassword) {
    // Verify current password
    const isMatch = await bcrypt.compare(profileData.currentPassword, user.password_hash);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }
    
    // Hash new password
    new_hash = await bcrypt.hash(profileData.newPassword, 10);
  }

  // Handle profile picture update
  let userProfile = user.profile_image_url;
  if (file) {
    // Delete old profile picture from Google Drive if it exists
    if (userProfile && userProfile.id) {
      try {
        await deleteFiles(userProfile.id);
        console.log(`Deleted old profile picture: ${userProfile.id}`);
      } catch (err) {
        console.error("Error deleting old profile picture:", err.message);
        // Continue with upload even if deletion fails
      }
    }

    // Upload new profile picture
    const uploadedFile = await uploadFiles(
      file,
      process.env.GDRIVE_FOLDER_ID
    );

    userProfile = {
      id: uploadedFile.id,
      name: uploadedFile.name,
      link: `https://lh3.googleusercontent.com/d/${uploadedFile.id}`,
      viewLink: uploadedFile.webViewLink,
      downloadLink: uploadedFile.webContentLink,
      thumbnail: `https://drive.google.com/thumbnail?id=${uploadedFile.id}&sz=w400`
    };
  }

  // Prepare update data
  const updateData = {};
  
  // Update basic fields
  if (profileData.first_name) updateData.first_name = profileData.first_name;
  if (profileData.last_name) updateData.last_name = profileData.last_name;
  if (profileData.phone_number) updateData.phone_number = profileData.phone_number;
  if (profileData.address) updateData.address = profileData.address;
  if (profileData.bio !== undefined) updateData.bio = profileData.bio;
  
  // Update password if changed
  if (new_hash) {
    updateData.password_hash = new_hash;
  }
  
  // Update profile image if changed
  if (userProfile) {
    updateData.profile_image_url = userProfile;
  }

  await user.update(updateData);
  
  // Return updated user without password hash, including VetProfessional if exists
  const updatedUser = await User.findByPk(userId, {
    include: [
      {
        model: VetProfessional,
        required: false
      }
    ],
    attributes: { exclude: ['password_hash'] }
  });
  
  return updatedUser;
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

export const updateVetProfessional = async (req, vetUserId, adminUserId) => {
  const { body, file } = req;
  
  // Parse the user JSON sent in form-data
  const data = body.user ? JSON.parse(body.user) : body;
  const { first_name, last_name, email, specialization, license_number } = data;

  // Verify the admin has permission
  const admin = await ClinicAdmin.findOne({ where: { user_id: adminUserId } });
  if (!admin)
    throw new Error("Only clinic admins can update vet professionals");

  // Get the current vet user
  const currentUser = await User.findByPk(vetUserId);
  if (!currentUser)
    throw new Error("Vet professional not found");

  // Verify the vet belongs to this admin
  const vetProfessional = await VetProfessional.findOne({
    where: { 
      user_id: vetUserId,
      clinic_admin_id: adminUserId
    }
  });

  if (!vetProfessional)
    throw new Error("Vet professional not found or you don't have permission");

  // Check if email is being changed and if it's already taken
  if (email && email !== currentUser.email) {
    const existing = await User.findOne({ where: { email } });
    if (existing) throw new Error("Email already registered");
  }

  // Handle profile picture update
  let userProfile = currentUser.profile_image_url;
  if (file) {
    // Delete old profile picture from Google Drive if it exists
    if (userProfile && userProfile.id) {
      try {
        await deleteFiles(userProfile.id);
        console.log(`Deleted old profile picture: ${userProfile.id}`);
      } catch (err) {
        console.error("Error deleting old profile picture:", err.message);
        // Continue with upload even if deletion fails
      }
    }

    // Upload new profile picture
    const uploadedFile = await uploadFiles(
      file,
      process.env.GDRIVE_FOLDER_ID
    );

    userProfile = {
      id: uploadedFile.id,
      name: uploadedFile.name,
      link: `https://lh3.googleusercontent.com/d/${uploadedFile.id}`,
      viewLink: uploadedFile.webViewLink,
      downloadLink: uploadedFile.webContentLink,
      thumbnail: `https://drive.google.com/thumbnail?id=${uploadedFile.id}&sz=w400`
    };
  }

  // Update user record
  const updateData = {};
  if (first_name) updateData.first_name = first_name;
  if (last_name) updateData.last_name = last_name;
  if (email) updateData.email = email;
  if (userProfile) updateData.profile_image_url = userProfile;

  await currentUser.update(updateData);

  // Update vet professional record (we already have it from permission check)
  if (vetProfessional) {
    const vetUpdateData = {};
    if (specialization) vetUpdateData.specialization = specialization;
    if (license_number) vetUpdateData.license_number = license_number;
    
    await vetProfessional.update(vetUpdateData);
  }

  // Return updated user with vet professional data
  const updatedUser = await User.findByPk(vetUserId, {
    include: [{
      model: VetProfessional
    }],
    attributes: { exclude: ['password_hash'] }
  });

  return updatedUser;
};
