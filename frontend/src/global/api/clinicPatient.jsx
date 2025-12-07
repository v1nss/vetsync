import api from "../utils/api";

// Get all patients for vet professional's clinic
export const getVetClinicPatients = async () => {
  try {
    const res = await api.get("/clinic-patients/vet/patients");
    return res.data;
  } catch (err) {
    console.error("Error fetching clinic patients:", err);
    throw err;
  }
};

// Get a specific patient by pet_id
export const getVetClinicPatient = async (petId) => {
  try {
    const res = await api.get(`/clinic-patients/vet/patients/${petId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching clinic patient:", err);
    throw err;
  }
};

// Get all EHRs for all patients in the vet's clinic
export const getVetClinicEHRs = async () => {
  try {
    const res = await api.get("/clinic-patients/vet/ehrs");
    return res.data;
  } catch (err) {
    console.error("Error fetching clinic EHRs:", err);
    throw err;
  }
};

// Search pets by owner email
export const searchPetsByOwnerEmail = async (email) => {
  try {
    const res = await api.get(`/clinic-patients/search-pets?email=${encodeURIComponent(email)}`);
    return res.data;
  } catch (err) {
    console.error("Error searching pets by email:", err);
    throw err;
  }
};

// Add patient to clinic (create EHR and clinic_patient entry)
export const addPatientToClinic = async (petId, ehrData = {}) => {
  try {
    const res = await api.post("/clinic-patients/add-patient", {
      pet_id: petId,
      ehrData,
    });
    return res.data;
  } catch (err) {
    console.error("Error adding patient to clinic:", err);
    throw err;
  }
};

