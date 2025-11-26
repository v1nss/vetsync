import api from "../utils/api.jsx";

export const fetchMyClinic = async () => {
  try {
    const res = await api.get("/clinics/my-clinic");
    return res.data.clinic;
  } catch (err) {
    console.error("Unable to fetch clinic", err);
    throw err;
  }
};

export const updateClinic = async (clinicId, clinicData, newImages = { clinicImages: [], documentImages: [] }) => {
  try {
    const formData = new FormData();
    
    // Separate new images from existing images
    const existingClinicImages = (clinicData.clinic_images || []).filter(img => !img.isNew);
    const existingDocImages = (clinicData.document_images || []).filter(img => !img.isNew);
    
    // Prepare clinic data without the file objects
    const dataToSend = {
      ...clinicData,
      clinic_images: existingClinicImages,
      document_images: existingDocImages
    };
    
    formData.append('clinic', JSON.stringify(dataToSend));
    
    // Append new clinic image files
    const newClinicImgs = (clinicData.clinic_images || []).filter(img => img.isNew && img.file);
    newClinicImgs.forEach(img => {
      formData.append('clinicImages', img.file);
    });
    
    // Append new document image files
    const newDocImgs = (clinicData.document_images || []).filter(img => img.isNew && img.file);
    newDocImgs.forEach(img => {
      formData.append('documentImages', img.file);
    });
    
    const res = await api.patch(`/clinics/update/${clinicId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return res.data.clinic;
  } catch (err) {
    console.error("Unable to update clinic", err);
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