import { Op } from "sequelize";
import ClinicPatient from "../models/clinicPatientModel.js";
import Pet from "../models/petModel.js";
import User from "../models/users/userModel.js";
import PetOwner from "../models/users/petOwnerModel.js";
import EHR from "../models/ehrModel.js";
import VetProfessional from "../models/users/vetProfessionalModel.js";
import Clinic from "../models/clinicModel.js";
import Appointment from "../models/appointmentModel.js";
import Prescription from "../models/prescriptionModel.js";
import Vaccination from "../models/vaccinationModel.js";
import Deworming from "../models/dewormingModel.js";
import LabResult from "../models/labResultModel.js";

// Get all patients for a clinic
export const getClinicPatients = async (clinicId) => {
  const patients = await ClinicPatient.findAll({
    where: { clinic_id: clinicId },
    include: [
      {
        model: Pet,
        as: "pet",
        attributes: ["pet_id", "name", "species", "breed", "birthdate", "gender", "profileURL", "owner_id", "weight", "color"],
        include: [
          {
            model: User,
            as: "owner",
            attributes: ["id", "first_name", "last_name", "email", "phone_number"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  // Transform to include PetOwner address information
  const transformedPatients = await Promise.all(
    patients.map(async (cp) => {
      const pet = cp.pet;
      if (pet && pet.owner_id && pet.owner) {
        // Get PetOwner address
        const petOwner = await PetOwner.findOne({
          where: { user_id: pet.owner_id },
          attributes: ["address"],
        });

        if (petOwner) {
          pet.owner.petOwner = { address: petOwner.address };
        }
      }
      return cp;
    })
  );

  return transformedPatients;
};

// Get a specific clinic patient by clinic_id and pet_id
export const getClinicPatient = async (clinicId, petId) => {
  const clinicPatient = await ClinicPatient.findOne({
    where: {
      clinic_id: clinicId,
      pet_id: petId,
    },
    include: [
      {
        model: Pet,
        as: "pet",
        attributes: ["pet_id", "name", "species", "breed", "birthdate", "gender", "profileURL", "owner_id", "weight", "color"],
      },
    ],
  });

  if (clinicPatient && clinicPatient.pet && clinicPatient.pet.owner_id) {
    // Get owner user info
    const owner = await User.findByPk(clinicPatient.pet.owner_id, {
      attributes: ["id", "first_name", "last_name", "email", "phone_number"],
    });
    
    // Get PetOwner address
    const petOwner = await PetOwner.findOne({
      where: { user_id: clinicPatient.pet.owner_id },
      attributes: ["address"],
    });

    if (owner) {
      clinicPatient.pet.owner = {
        ...owner.toJSON(),
        petOwner: petOwner ? { address: petOwner.address } : null,
      };
    }
  }

  return clinicPatient;
};

// Get all EHRs for all patients in a clinic (using clinic_patients as reference)
export const getClinicPatientsEHRs = async (clinicId) => {
  // First, get all clinic patients (pet_ids) for this clinic
  const clinicPatients = await ClinicPatient.findAll({
    where: { clinic_id: clinicId },
    attributes: ["pet_id"],
  });

  if (!clinicPatients || clinicPatients.length === 0) {
    return [];
  }

  // Extract pet_ids
  const petIds = clinicPatients.map(cp => cp.pet_id);

  // Get all EHRs for these pets that belong to this clinic
  const ehrs = await EHR.findAll({
    where: {
      pet_id: { [Op.in]: petIds },
      clinic_id: clinicId, // Ensure EHRs belong to this clinic
    },
    include: [
      {
        model: PetOwner,
        as: "petOwner",
        attributes: ["user_id", "address"],
        include: [
          {
            model: User,
            attributes: ["id", "first_name", "last_name", "email", "phone_number"],
          },
        ],
      },
      {
        model: Pet,
        as: "pet",
        attributes: ["pet_id", "name", "species", "breed", "birthdate", "gender", "owner_id", "weight", "color"],
        include: [
          {
            model: User,
            as: "owner",
            attributes: ["id", "first_name", "last_name", "email", "phone_number"],
          },
        ],
      },
      {
        model: VetProfessional,
        as: "vetProfessional",
        attributes: ["user_id"],
        include: [
          {
            model: User,
            attributes: ["first_name", "last_name", "email"],
          },
        ],
      },
      {
        model: Clinic,
        as: "clinic",
        attributes: ["clinic_id", "name"],
      },
      {
        model: Appointment,
        as: "appointment",
        attributes: ["appointment_id", "service", "date", "time"],
      },
      {
        model: Prescription,
        as: "prescriptions",
      },
      {
        model: Vaccination,
        as: "vaccinations",
      },
      {
        model: Deworming,
        as: "dewormings",
      },
      {
        model: LabResult,
        as: "labResults",
      },
    ],
    order: [["visit_date", "DESC"], ["createdAt", "DESC"]],
  });

  return ehrs;
};

// Add a patient to clinic (create EHR and clinic_patient entry)
export const addPatientToClinic = async (clinicId, petId, vetProfessionalId, ehrData = {}) => {
  // Check if clinic_patient already exists
  const existingClinicPatient = await ClinicPatient.findOne({
    where: {
      clinic_id: clinicId,
      pet_id: petId,
    },
  });

  // Get pet and owner information
  const pet = await Pet.findByPk(petId, {
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id"],
      },
    ],
  });

  if (!pet) {
    throw new Error("Pet not found");
  }

  const petOwnerId = pet.owner_id;

  // Create clinic_patient entry if it doesn't exist
  let clinicPatient;
  if (!existingClinicPatient) {
    clinicPatient = await ClinicPatient.create({
      clinic_id: clinicId,
      pet_id: petId,
    });
  } else {
    clinicPatient = existingClinicPatient;
  }

  // Create a basic EHR record if ehrData is provided
  let ehr = null;
  if (ehrData && Object.keys(ehrData).length > 0) {
    const { createEHR } = await import("./ehrService.js");
    ehr = await createEHR(vetProfessionalId, {
      pet_owner_id: petOwnerId,
      pet_id: petId,
      clinic_id: clinicId,
      visit_date: ehrData.visit_date || new Date().toISOString().split('T')[0],
      appointment_id: ehrData.appointment_id || null,
      prescriptions: ehrData.prescriptions || [],
      vaccinations: ehrData.vaccinations || [],
      dewormings: ehrData.dewormings || [],
      labResults: ehrData.labResults || [],
    }, ehrData.files || []);
  } else {
    // Always create a basic EHR entry with today's date
    const { createEHR } = await import("./ehrService.js");
    ehr = await createEHR(vetProfessionalId, {
      pet_owner_id: petOwnerId,
      pet_id: petId,
      clinic_id: clinicId,
      visit_date: new Date().toISOString().split('T')[0],
      appointment_id: null,
      prescriptions: [],
      vaccinations: [],
      dewormings: [],
      labResults: [],
    }, []);
  }

  return {
    clinicPatient,
    ehr,
    pet,
  };
};

