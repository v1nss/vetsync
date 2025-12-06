import api from "../utils/api";

// Create new EHR record
export const createEHR = async (ehrData, files = []) => {
  try {
    const formData = new FormData();
    
    // Add EHR data as JSON
    formData.append("ehr", JSON.stringify(ehrData));
    
    // Add files if provided
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }
    
    const res = await api.post("/ehr/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return res.data;
  } catch (err) {
    console.error("Error creating EHR:", err);
    throw err;
  }
};

// Get EHR by ID
export const getEHRById = async (ehrId) => {
  try {
    const res = await api.get(`/ehr/${ehrId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching EHR:", err);
    throw err;
  }
};

// Get all EHRs for pet owner
export const getEHRsByPetOwner = async () => {
  try {
    const res = await api.get("/ehr/owner/all");
    return res.data;
  } catch (err) {
    console.error("Error fetching pet owner EHRs:", err);
    throw err;
  }
};

// Get all EHRs for a specific pet
export const getEHRsByPet = async (petId) => {
  try {
    const res = await api.get(`/ehr/pet/${petId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching pet EHRs:", err);
    throw err;
  }
};

// Get all EHRs for vet professional
export const getEHRsByVetProfessional = async () => {
  try {
    const res = await api.get("/ehr/vet/all");
    return res.data;
  } catch (err) {
    console.error("Error fetching vet professional EHRs:", err);
    throw err;
  }
};

// Get all EHRs for clinic
export const getEHRsByClinic = async (clinicId) => {
  try {
    const res = await api.get(`/ehr/clinic/${clinicId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching clinic EHRs:", err);
    throw err;
  }
};

// Update EHR record
export const updateEHR = async (ehrId, ehrData, files = []) => {
  try {
    const formData = new FormData();
    
    // Add EHR data as JSON
    formData.append("ehr", JSON.stringify(ehrData));
    
    // Add files if provided
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }
    
    const res = await api.patch(`/ehr/${ehrId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return res.data;
  } catch (err) {
    console.error("Error updating EHR:", err);
    throw err;
  }
};

// Delete EHR record
export const deleteEHR = async (ehrId) => {
  try {
    const res = await api.delete(`/ehr/${ehrId}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting EHR:", err);
    throw err;
  }
};

// Delete file from EHR
export const deleteEHRFile = async (ehrId, fileId) => {
  try {
    const res = await api.delete(`/ehr/${ehrId}/file/${fileId}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting EHR file:", err);
    throw err;
  }
};

