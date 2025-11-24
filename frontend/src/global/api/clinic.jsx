import axiosInstance from '../../utils/axiosInstance.js';

export const registerClinic = async (clinicData) => {
    try {
        const res = await axiosInstance.post(`/clinics/register`, clinicData);
        console.log("Register Clinic from clinic api response: ", res.message);
        return res.data;
    } catch (err) {
        console.error('Clinic registration failed:', err.message);
        throw err;
    }
};

export const fetchClinicByOwnerId = async(owner_id) => {
    try {
        const res = await axiosInstance.get(`/clinics/get-clinic/${owner_id}`);
        console.log("Clinic Fetched Successfully");
        return res.data
    } catch (err) {
        console.error("Unable to fetch clinic by owner id", err.message)
        throw err
    }
};