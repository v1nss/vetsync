import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const registerPet = async (token, petData) => {
    try {
        const res = await axios.post(`${BASE_URL}/pets/register`, petData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
        })
        console.log('Pet Registered: ', res.data);
        return res.data;
    } catch (err) {
        console.error("Unable to register pet: ", err);
        throw err;
    }
}

export const fetchAllPetsById = async (token) => {
    try {
        const res = await axios.get(`${BASE_URL}/pets`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        console.log("All pets successfully fetched by User ID", res)
        return res.data
    } catch (err) {
        console.error("Unable to fetch Pets by User ID", err.message)
        throw err;
    }
}