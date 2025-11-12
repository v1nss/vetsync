import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const registerClinic = async (clinicData, token) => {
    try {
        const res = await axios.post(`${BASE_URL}/clinics/register`, clinicData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        console.log("Register Clinic from clinic api response: ", res.message);
        return res.data;
    } catch (err) {
        console.error('Clinic registration failed:', err.message);
        throw err;
    }
};

export const fetchClinicByOwnerId = async(owner_id, token) => {
    try {
        const res = await axios.get(`${BASE_URL}/clinics/get-clinic/${owner_id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        console.log("Clinic Fetched Successfully");
        return res.data
    } catch (err) {
        console.error("Unable to fetch clinic by owner id", err.message)
        throw err
    }
};