import { uploadFiles } from "../../global/utils/drive.js";
import Pet from "../models/petModel.js";

export const createPetService = async (owner_id, petData) => {

  const { body, file } = petData;
  const petInfo = JSON.parse(body.pet);
  
  let petProfile = null;
  if (file) {
    const { id: fileId, name: fileName } = await uploadFiles(
      file,
      process.env.GDRIVE_FOLDER_ID
    );

    petProfile = {
      id: fileId,
      name: fileName,
      link: `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
    }
  }

  return await Pet.create({
    owner_id,
    ...petInfo,
    profileURL: petProfile,
  });
};

export const getMyPetsService = async (owner_id) => {
  return await Pet.findAll({
    where: { owner_id },
    // order: [["id", "DESC"]],
  });
};

export const getPetByIdService = async (pet_id, owner_id) => {
  return await Pet.findOne({
    where: { pet_id, owner_id },
  });
};

export const deletePetService = async (pet_id, owner_id) => {
  return await Pet.destroy({
    where: { pet_id, owner_id },
  });
};

export const updatePetService = async (pet_id, owner_id, updateData) => {
  const pet = await Pet.findOne({ where: { pet_id, owner_id } });

  if (!pet) {
    throw new Error("Pet not found or access denied");
  }

  await pet.update(updateData);
  return pet; // return the updated pet object
};
