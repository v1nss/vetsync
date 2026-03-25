import HealthRecordModal from "../../components/EHR/HealthRecordModal.jsx.jsx";
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

// Get clinic services (works for both vet professional and clinic admin)
export const fetchMyClinicServices = async () => {
  try {
    const res = await api.get("/clinic-patients/my-clinic/services");
    return res.data;
  } catch (err) {
    console.error("Unable to fetch clinic services", err);
    throw err;
  }
};

export const updateClinic = async (clinicId, clinicData, newImages = { clinicImages: [], documentImages: [] }) => {
  try {
    const formData = new FormData();
    
    // Separate new images from existing images
    const existingClinicImages = (clinicData.clinic_images || []).filter(img => !img.isNew);
    
    // Prepare clinic data without the file objects
    const dataToSend = {
      ...clinicData,
      clinic_images: existingClinicImages,
    };
    
    formData.append('clinic', JSON.stringify(dataToSend));
    
    // Append new clinic image files from newImages parameter
    if (newImages.clinicImages && newImages.clinicImages.length > 0) {
      console.log(`Preparing to upload ${newImages.clinicImages.length} clinic images`);
      newImages.clinicImages.forEach((file, index) => {
        console.log(`Appending clinic image ${index + 1}:`, file.name, file.type, file.size);
        formData.append('clinicImages', file);
      });
    } else {
      console.log('No new clinic images to upload');
    }
    
    // Append new document image files from newImages parameter (in order: secdti, mayor_permit, bir)
    if (newImages.documentImages && newImages.documentImages.length > 0) {
      console.log(`Preparing to upload ${newImages.documentImages.length} document images`);
      newImages.documentImages.forEach((file, index) => {
        console.log(`Appending document image ${index + 1}:`, file.name, file.type, file.size);
        formData.append('documentImages', file);
      });
    } else {
      console.log('No new document images to upload');
    }
    
    console.log('Sending update request with FormData');
    const res = await api.patch(`/clinics/update/${clinicId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Update successful:', res.data.clinic);
    return res.data.clinic;
    
  } catch (err) {
    console.error("Unable to update clinic", err);
    console.error("Error details:", err.response?.data || err.message);
    throw err;
  }
};

export const addVetProfessional = async (vetData, profilePicture) => {
  try {
    const formData = new FormData();
    
    formData.append('user', JSON.stringify(vetData));
    
    // Append profile picture if provided
    if (profilePicture) {
      formData.append('file', profilePicture);
    }
    
    const res = await api.post('/users/vet', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return res.data;
  } catch (err) {
    console.error("Unable to add vet professional", err);
    throw err;
  }
};

export const fetchClinicVets = async () => {
  try {
    const res = await api.get('/users/my-clinic/vets');
    return res.data.vets || [];
  } catch (err) {
    console.error("Unable to fetch clinic vets", err);
    throw err;
  }
};

export const updateVetProfessional = async (vetId, vetData, profilePicture) => {
  try {
    const formData = new FormData();
    
    // Prepare vet data
    const dataToSend = {
      first_name: vetData.first_name,
      last_name: vetData.last_name,
      email: vetData.email,
      specialization: vetData.specialization,
      license_number: vetData.license_number,
    };
    
    formData.append('user', JSON.stringify(dataToSend));
    
    // Append profile picture if provided
    if (profilePicture) {
      formData.append('file', profilePicture);
    }
    
    const res = await api.patch(`/users/vet/${vetId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return res.data;
  } catch (err) {
    console.error("Unable to update vet professional", err);
    throw err;
  }
};

export const downloadPatientReport = async (patientData) => {
  try {
    const res = await api.post('/reports/patient', {
      ...patientData
    }, {
      responseType: 'blob',
    });
    return res.data;
  } catch (err) {
    console.error("Unable to download patient report", err);
    throw err;
  }
}