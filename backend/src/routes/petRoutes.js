import express from "express";
import upload from '../../global/config/multer.js'
import {
  createPet,
  getMyPets,
  getPetById,
  deletePet,
  updatePet
} from "../controllers/petController.js";
import { authenticate, verifyOwner } from "../../global/middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", upload.single('file'), authenticate, verifyOwner, createPet);

router.get("/", authenticate, verifyOwner, getMyPets);

router.get("/:pet_id", authenticate, verifyOwner, getPetById);

router.patch("/:pet_id", authenticate, verifyOwner, updatePet);

router.delete("/:pet_id", authenticate, verifyOwner, deletePet);


export default router;
