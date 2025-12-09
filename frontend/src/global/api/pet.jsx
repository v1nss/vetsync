import api from '../utils/api.jsx';

export const registerPet = async (petData) => {
    try {
        const res = await api.post("/pets/register", petData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        return res.data;
    } catch (err) {
        console.error("Unable to register pet: ", err);
        throw err;
    }
};

export const fetchAllPetsById = async () => {
    try {
        const res = await api.get("/pets");
        return res.data;
    } catch (err) {
        console.error("Unable to fetch Pets by User ID", err.message);
        throw err;
    }
};