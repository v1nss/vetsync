import api from '../utils/api.jsx';

export const registerPet = async (petData) => {
    try {
        const res = await api.post("/pets/register", petData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        console.log('Pet Registered: ', res.data);
        return res.data;
    } catch (err) {
        console.error("Unable to register pet: ", err);
        throw err;
    }
};

export const fetchAllPetsById = async () => {
    try {
        const res = await api.get("/pets");
        console.log("All pets successfully fetched by User ID", res);
        return res.data;
    } catch (err) {
        console.error("Unable to fetch Pets by User ID", err.message);
        throw err;
    }
};

export const updatePet = async (petId, petData) => {
    try {
        const res = await api.patch(`/pets/${petId}`, petData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        console.log('Pet Updated: ', res.data);
        return res.data;
    } catch (err) {
        console.error("Unable to update pet: ", err);
        throw err;
    }
};