import api from "../utils/api.jsx";

export const fetchAllClinics = async (status = "*") => {
  try {
    const res = await api.get(`/system-admin/clinics?status=${status}`);
    return res.data.clinics;
  } catch (err) {
    console.error("Unable to fetch clinics", err);
    throw err;
  }
};

export const updateClinicStatus = async (clinicId, status) => {
  try {
    const res = await api.patch(
      `/system-admin/clinics/${clinicId}/status`,
      { status }
    );
    return res.data;
  } catch (err) {
    console.error(`Unable to update clinic status to ${status}`, err);
    throw err;
  }
};