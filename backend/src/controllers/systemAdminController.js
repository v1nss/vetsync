import { getAllUsers, registerSystemAdmin, getAllClinics, getPendingClinics, acceptClinicStatus} from '../services/systemAdminService.js';

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
        const { status } = req.query; // e.g. ?status=pending
        const clinics = await getAllClinics(status);
        res.status(200).json({ clinics });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const fetchPendingClinics = async (req, res) => {
    try {
        const clinics = await getPendingClinics();
        res.status(200).json({ clinics });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const approveClinic = async (req, res) => {
    try {
        const { clinicId } = req.params;
        await acceptClinicStatus(clinicId);
        res.status(200).json({ message: 'Clinic approved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
