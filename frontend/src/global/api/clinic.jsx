import api from '../utils/api.jsx';

export const registerClinic = async (clinicData) => {
    try {
        const res = await api.post("/clinics/register", clinicData);
        console.log("Register Clinic from clinic api response: ", res.message);
        return res.data;
    } catch (err) {
        console.error('Clinic registration failed:', err);
        throw err;
    }
};

export const fetchClinicByOwnerId = async (owner_id) => {
    try {
        const res = await api.get(`/clinics/get-clinic/${owner_id}`);
        console.log("Clinic Fetched Successfully");
        return res.data;
    } catch (err) {
        console.error("Unable to fetch clinic by owner id", err);
        throw err;
    }
};

// Fetch all approved clinics for public display
export const fetchApprovedClinics = async () => {
  try {
    const response = await api.get('/clinics/approved');
    return response.data.clinics || [];
  } catch (error) {
    console.error('Error fetching approved clinics:', error);
    throw error;
  }
};

// Search clinics by keyword
export const searchClinics = async (searchTerm) => {
  try {
    const response = await api.get('/clinics/search', {
      params: { search: searchTerm }
    });
    return response.data.clinics || [];
  } catch (error) {
    console.error('Error searching clinics:', error);
    throw error;
  }
};

// Fetch single clinic details by ID
export const fetchClinicById = async (clinicId) => {
  try {
    const response = await api.get(`/clinics/public/${clinicId}`);
    return response.data.clinic;
  } catch (error) {
    console.error('Error fetching clinic details:', error);
    throw error;
  }
};