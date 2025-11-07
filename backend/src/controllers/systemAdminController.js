import { getAllUsers, registerSystemAdmin, getAllClinics} from '../services/systemAdminService.js';

export const registerAdmin = async (req, res) => {
  try {
    const adminData = req.body;
    const admin = await registerSystemAdmin(adminData);
    res.status(201).json({ message: 'System Admin registered successfully', admin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchAllClinics = async (req, res) => {
    try {
        const clinics = await getAllClinics();
        res.status(200).json({ clinics });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};