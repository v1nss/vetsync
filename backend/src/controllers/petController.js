import {
  createPetService,
  getMyPetsService,
  getPetByIdService,
  deletePetService,
  updatePetService,
} from "../services/petService.js";
import Pet from "../models/petModel.js";

export const createPet = async (req, res) => {
  try {
    const owner_id = req.user.id; // from JWT

    const newPet = await createPetService(owner_id, req);
    res.status(201).json({ message: "Pet created successfully", pet: newPet });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating pet", error: error.message });
  }
};

export const getMyPets = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const pets = await getMyPetsService(owner_id);
    res.status(200).json(pets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pets", error: error.message });
  }
};

export const getPetById = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const { pet_id } = req.params;

    const pet = await getPetByIdService(pet_id, owner_id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    res.status(200).json(pet);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pet", error: error.message });
  }
};

export const deletePet = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const { pet_id } = req.params;

    const deleted = await deletePetService(pet_id, owner_id);
    if (!deleted) return res.status(404).json({ message: "Pet not found" });

    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting pet", error: error.message });
  }
};

export const updatePet = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const { pet_id } = req.params;
    
    // Parse FormData - pet data is sent as JSON string in FormData
    let newPetData = {};
    if (req.body && req.body.pet) {
      // If pet is a string (JSON), parse it
      try {
        newPetData = typeof req.body.pet === 'string' ? JSON.parse(req.body.pet) : req.body.pet;
      } catch (parseError) {
        // If parsing fails, try using req.body directly
        newPetData = req.body;
      }
    } else {
      // Fallback: use req.body directly if not FormData
      newPetData = req.body || {};
    }

    // Handle file upload if present (for profile picture updates)
    const updatedPet = await updatePetService(pet_id, owner_id, newPetData, req.file);
    
    // Reload the pet to get all updated data including associations
    const finalPet = await Pet.findOne({ where: { pet_id, owner_id } });
    
    return res
      .status(200)
      .json({ message: "Pet updated successfully", pet: finalPet });
  } catch (error) {
    console.error("Update pet error:", error);
    res
      .status(500)
      .json({ message: "Error updating pet", error: error.message });
  }
};
