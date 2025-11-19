import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchMyClinic = async (token) => {
  try {
    const res = await axios.get(`${BASE_URL}/clinics/my-clinic`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.clinic;
  } catch (err) {
    console.error("Unable to fetch clinic", err.message);
    throw err;
  }
};

// export const fetchClinicStats = async (token) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/clinic-admin/my-clinic/stats`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data.stats;
//   } catch (err) {
//     console.error("Unable to fetch clinic stats", err.message);
//     throw err;
//   }
// };

// export const fetchClinicAppointments = async (token, params = {}) => {
//   try {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await axios.get(
//       `${BASE_URL}/clinic-admin/my-clinic/appointments${queryString ? `?${queryString}` : ''}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     return res.data.appointments;
//   } catch (err) {
//     console.error("Unable to fetch clinic appointments", err.message);
//     throw err;
//   }
// };

// export const updateMyClinic = async (token, clinicData) => {
//   try {
//     const res = await axios.put(
//       `${BASE_URL}/clinic-admin/my-clinic`,
//       clinicData,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     return res.data.clinic;
//   } catch (err) {
//     console.error("Unable to update clinic", err.message);
//     throw err;
//   }
// };

// export const fetchClinicPatients = async (token, params = {}) => {
//   try {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await axios.get(
//       `${BASE_URL}/clinic-admin/my-clinic/patients${queryString ? `?${queryString}` : ''}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     return res.data.patients;
//   } catch (err) {
//     console.error("Unable to fetch clinic patients", err.message);
//     throw err;
//   }
// };

// export const fetchClinicVets = async (token) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/clinic-admin/my-clinic/vets`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data.vets;
//   } catch (err) {
//     console.error("Unable to fetch clinic vets", err.message);
//     throw err;
//   }
// };

// export const updateAppointmentStatus = async (token, appointmentId, status) => {
//   try {
//     const res = await axios.patch(
//       `${BASE_URL}/clinic-admin/appointments/${appointmentId}/status`,
//       { status },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     return res.data;
//   } catch (err) {
//     console.error(`Unable to update appointment status to ${status}`, err.message);
//     throw err;
//   }
// };