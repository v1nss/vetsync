import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEN_URL;

export const registerPet = async (token, petData) => {
    for (let [key, value] of petData.entries()) {
    console.log(key, value);
    }
    try {
        const res = await axios.post(`http://localhost:4000/api/pets/register`, petData, {
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