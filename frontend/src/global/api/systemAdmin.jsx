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

export const fetchUserActivityReport = async () => {
  try {
    const res = await api.get("/reports/user-activity");
    return res.data;
  } catch (err) {
    console.error("Unable to fetch user activity report", err);
    throw err;
  }
};

export const fetchAuditTrail = async (params = {}) => {
  try {
    const res = await api.get("/reports/audit-trail", { params });
    return res.data;
  } catch (err) {
    console.error("Unable to fetch audit trail", err);
    throw err;
  }
};

export const fetchClinicPerformanceReport = async () => {
  try {
    const res = await api.get("/reports/clinic-performance");
    return res.data;
  } catch (err) {
    console.error("Unable to fetch clinic performance report", err);
    throw err;
  }
};

export const downloadAuditTrail = async (params = {}) => {
   try {
    const res = await api.get("/reports/audit-trail/download", {
      params,
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audit-trail-${params.startDate}-to-${params.endDate}.csv`);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("Unable to download audit trail", err);
    throw err;
  }
};
