import axiosInstance from '../../utils/axiosInstance.js';

export const fetchAllClinics = async (status="*") => {
  try {
    const res = await axiosInstance.get(`/system-admin/clinics?status=${status}`);
    return res.data.clinics;
  } catch (err) {
    console.error("Unable to fetch clinics", err.message);
    throw err;
  }
};

export const updateClinicStatus = async (clinicId, status) => {
  try {
    const res = await axiosInstance.patch(
      `/system-admin/clinics/${clinicId}/status`,
      { status }
    );
    return res.data;
  } catch (err) {
    console.error(`Unable to update clinic status to ${status}`, err.message);
    throw err;
  }
};