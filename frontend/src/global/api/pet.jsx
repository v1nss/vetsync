import axiosInstance from '../../utils/axiosInstance.js';

export const registerPet = async (petData) => {
    try {
        const res = await axiosInstance.post(`/pets/register`, petData, {
            headers: {
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

export const fetchAllPetsById = async () => {
    try {
        const res = await axiosInstance.get(`/pets`)
        console.log("All pets successfully fetched by User ID", res)
        return res.data
    } catch (err) {
        console.error("Unable to fetch Pets by User ID", err.message)
        throw err;
    }
}