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