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

