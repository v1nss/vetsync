import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchAllClinics = async (token, status="*") => {
  try {
    const res = await axios.get(`${BASE_URL}/system-admin/clinics?status=${status}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.clinics;
  } catch (err) {
    console.error("Unable to fetch clinics", err.message);
    throw err;
  }
};

export const updateClinicStatus = async (token, clinicId, status) => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/system-admin/clinics/${clinicId}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error(`Unable to update clinic status to ${status}`, err.message);
    throw err;
  }
};