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
    const res = await api.patch(`/system-admin/clinics/${clinicId}/status`, {
      status,
    });
    return res.data;
  } catch (err) {
    console.error(`Unable to update clinic status to ${status}`, err);
    throw err;
  }
};

export const createApprovalLog = async (logData) => {
  try {
    console.log("Creating approval log with data:", logData);
    const res = await api.post(`/approval-logs/create`, logData);
    return res.data;
  } catch (err) {
    console.error("Unable to create approval log", err);
    throw err;
  }
};

export const fetchApprovalLogsByClinicId = async (clinicId) => {
  try {
    const res = await api.get(`/approval-logs/clinic/${clinicId}`);
    return res.data.logs;
  } catch (err) {
    console.error("Unable to fetch approval logs", err);
    throw err;
  }
};

export const fetchAllUsers = async () => {
  try {
    const res = await api.get("/system-admin/users");
    return res.data.users;
  } catch (err) {
    console.error("Unable to fetch users", err);
    throw err;
  }
};
