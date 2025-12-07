import { uploadFiles } from "../../global/utils/drive.js";
import Pet from "../models/petModel.js";
import User from "../models/users/userModel.js";

export const createPetService = async (owner_id, petData) => {

  const { body, file } = petData;
  const petInfo = JSON.parse(body.pet);
  
  // Get owner's email from User model
  const owner = await User.findByPk(owner_id, {
    attributes: ["email"],
  });

  if (!owner) {
    throw new Error("Owner not found");
  }

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

  // Remove owner_email from petInfo if present (we'll use the actual owner's email)
  const { owner_email, ...petDataWithoutEmail } = petInfo;

  return await Pet.create({
    owner_id,
    owner_email: owner.email, // Automatically set owner email from database
    ...petDataWithoutEmail,
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

// Search pets by owner email
export const searchPetsByOwnerEmail = async (ownerEmail) => {
  return await Pet.findAll({
    where: { owner_email: ownerEmail },
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "first_name", "last_name", "email", "phone_number"],
      },
    ],
    order: [["pet_id", "DESC"]],
  });
};
