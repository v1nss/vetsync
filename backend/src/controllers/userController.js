import VetProfessional from "../models/users/vetProfessionalModel.js";
import User from "../models/users/userModel.js";
import {
  registerUser,
  registerVetProfessional,
  updateUserProfile,
  getUserById,
  verifyExistingEmail,
  updateVetProfessional,
} from "../services/userService.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const createVetProfessional = async (req, res) => {
  try {
    const adminUserId = req.user.id; // from JWT or session
    const user = await registerVetProfessional(req, adminUserId);
    res
      .status(201)
      .json({ message: "Vet Professional created successfully", user });
  } catch (err) {
    console.error("Unable to create Vet Professional", err.message);
    res.status(400).json({ error: err.message });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT or session
    const updatedUser = await updateUserProfile(req, userId);
    res
      .status(200)
      .json({
        message: "User profile updated successfully",
        user: updatedUser,
      });
  } catch (err) {
    console.error("Error updating user profile", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const fetchUserDataById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user data", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await verifyExistingEmail(email);
    
    return res.status(200).json({ exists });
  } catch (err) {
    console.error("Error checking email existence", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const fetchVetProfessionalsByClinic = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const vets = await VetProfessional.findAll({
      where: {
        clinic_admin_id: owner_id
      },
      include: [
        {
          model: User,
          attributes: ["id", "first_name", "last_name", "email", "phone_number", "profile_image_url"]
        }
      ]
    });
    return res.status(200).json({ vets });
  } catch (err) {
    console.error("Error fetching vet professionals by clinic", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateVetProfessionalController = async (req, res) => {
  try {
    const adminUserId = req.user.id; // from JWT
    const vetUserId = req.params.vetId;
    const updatedUser = await updateVetProfessional(req, vetUserId, adminUserId);
    res
      .status(200)
      .json({ message: "Vet Professional updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Unable to update Vet Professional", err.message);
    res.status(400).json({ error: err.message });
  }
};
