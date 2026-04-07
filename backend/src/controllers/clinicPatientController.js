import { getClinicPatients, getClinicPatient, getClinicPatientsEHRs, addPatientToClinic } from "../services/clinicPatientService.js";
import { searchPetsByOwnerEmail } from "../services/petService.js";
import Clinic from "../models/clinicModel.js";
import VetProfessional from "../models/users/vetProfessionalModel.js";
import ClinicAdmin from "../models/users/clinicAdminModel.js";
import Appointment from "../models/appointmentModel.js";

// Get all patients for the clinic (works for both vet professional and clinic admin)
export const getVetClinicPatients = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const userType = req.user.user_type;

    let clinicId;

    if (userType === 'clinic_admin') {
      // For clinic admin: Get clinic_id directly from owner_id
      const clinic = await Clinic.findOne({
        where: { owner_id: userId },
        attributes: ["clinic_id"],
      });

      if (!clinic) {
        return res.status(404).json({
          message: "No clinic found for this clinic admin",
        });
      }

      clinicId = clinic.clinic_id;
    } else {
      // For vet professional: Get clinic_id from clinic_admin_id or appointments
      const vetProfessional = await VetProfessional.findOne({
        where: { user_id: userId },
        attributes: ["clinic_admin_id"],
      });

      if (vetProfessional && vetProfessional.clinic_admin_id) {
        // Get clinic_id from clinic admin
        const clinic = await Clinic.findOne({
          where: { owner_id: vetProfessional.clinic_admin_id },
          attributes: ["clinic_id"],
        });

        if (clinic) {
          clinicId = clinic.clinic_id;
        }
      }

      // Fallback: Get clinic_id from appointments
      if (!clinicId) {
        const recentAppointment = await Appointment.findOne({
          where: { vet_professional_id: userId },
          attributes: ["clinic_id"],
          order: [["createdAt", "DESC"]],
        });

        if (!recentAppointment || !recentAppointment.clinic_id) {
          return res.status(404).json({
            message: "No clinic found for this vet professional",
          });
        }

        clinicId = recentAppointment.clinic_id;
      }
    }

    const patients = await getClinicPatients(clinicId);

    res.status(200).json({
      message: "Clinic patients fetched successfully",
      patients,
    });
  } catch (err) {
    console.error("Error fetching clinic patients:", err);
    res.status(500).json({
      message: "Error fetching clinic patients",
      error: err.message,
    });
  }
};

// Get a specific patient by pet_id for the clinic (works for both vet professional and clinic admin)
export const getVetClinicPatient = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.user_type;
    const { petId } = req.params;

    let clinicId;

    if (userType === 'clinic_admin') {
      // For clinic admin: Get clinic_id directly from owner_id
      const clinic = await Clinic.findOne({
        where: { owner_id: userId },
        attributes: ["clinic_id"],
      });

      if (!clinic) {
        return res.status(404).json({
          message: "No clinic found for this clinic admin",
        });
      }

      clinicId = clinic.clinic_id;
    } else {
      // For vet professional: Get clinic_id from clinic_admin_id or appointments
      const vetProfessional = await VetProfessional.findOne({
        where: { user_id: userId },
        attributes: ["clinic_admin_id"],
      });

      if (vetProfessional && vetProfessional.clinic_admin_id) {
        // Get clinic_id from clinic admin
        const clinic = await Clinic.findOne({
          where: { owner_id: vetProfessional.clinic_admin_id },
          attributes: ["clinic_id"],
        });

        if (clinic) {
          clinicId = clinic.clinic_id;
        }
      }

      // Fallback: Get clinic_id from appointments
      if (!clinicId) {
        const recentAppointment = await Appointment.findOne({
          where: { vet_professional_id: userId },
          attributes: ["clinic_id"],
          order: [["createdAt", "DESC"]],
        });

        if (!recentAppointment || !recentAppointment.clinic_id) {
          return res.status(404).json({
            message: "No clinic found for this vet professional",
          });
        }

        clinicId = recentAppointment.clinic_id;
      }
    }

    const clinicPatient = await getClinicPatient(clinicId, petId);

    if (!clinicPatient) {
      return res.status(404).json({
        message: "Patient not found in this clinic",
      });
    }

    res.status(200).json({
      message: "Clinic patient fetched successfully",
      patient: clinicPatient,
    });
  } catch (err) {
    console.error("Error fetching clinic patient:", err);
    res.status(500).json({
      message: "Error fetching clinic patient",
      error: err.message,
    });
  }
};

// Get all EHRs for all patients in the clinic (works for both vet professional and clinic admin)
export const getVetClinicEHRs = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const userType = req.user.user_type;

    let clinicId;

    if (userType === 'clinic_admin') {
      // For clinic admin: Get clinic_id directly from owner_id
      const clinic = await Clinic.findOne({
        where: { owner_id: userId },
        attributes: ["clinic_id"],
      });

      if (!clinic) {
        return res.status(404).json({
          message: "No clinic found for this clinic admin",
        });
      }

      clinicId = clinic.clinic_id;
    } else {
      // For vet professional: Get clinic_id from clinic_admin_id or appointments
      const vetProfessional = await VetProfessional.findOne({
        where: { user_id: userId },
        attributes: ["clinic_id"],
      });

      if (vetProfessional && vetProfessional.clinic_id) {
        clinicId = vetProfessional.clinic_id;
      } else {
        return res.status(404).json({
          message: "No clinic found for this vet professional",
        });
      }
    }

    // Get all EHRs for all clinic patients (using clinic_patients as reference)
    const ehrs = await getClinicPatientsEHRs(clinicId);
    
    res.status(200).json({
      message: "Clinic EHR records fetched successfully",
      ehrs,
    });
  } catch (err) {
    console.error("Error fetching clinic EHRs:", err);
    res.status(500).json({
      message: "Error fetching clinic EHR records",
      error: err.message,
    });
  }
};

// Helper function to get clinic_id from user
const getClinicIdFromUser = async (userId, userType) => {
  let clinicId;

  if (userType === 'clinic_admin') {
    const clinic = await Clinic.findOne({
      where: { owner_id: userId },
      attributes: ["clinic_id"],
    });
    if (!clinic) {
      throw new Error("No clinic found for this clinic admin");
    }
    clinicId = clinic.clinic_id;
  } else {
    const vetProfessional = await VetProfessional.findOne({
      where: { user_id: userId },
      attributes: ["clinic_admin_id"],
    });

    if (vetProfessional && vetProfessional.clinic_admin_id) {
      const clinic = await Clinic.findOne({
        where: { owner_id: vetProfessional.clinic_admin_id },
        attributes: ["clinic_id"],
      });
      if (clinic) {
        clinicId = clinic.clinic_id;
      }
    }

    if (!clinicId) {
      const recentAppointment = await Appointment.findOne({
        where: { vet_professional_id: userId },
        attributes: ["clinic_id"],
        order: [["createdAt", "DESC"]],
      });

      if (!recentAppointment || !recentAppointment.clinic_id) {
        throw new Error("No clinic found for this vet professional");
      }
      clinicId = recentAppointment.clinic_id;
    }
  }

  return clinicId;
};

// Search pets by owner email
export const searchPetsByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const pets = await searchPetsByOwnerEmail(email);

    res.status(200).json({
      message: "Pets found successfully",
      pets,
    });
  } catch (err) {
    console.error("Error searching pets by email:", err);
    res.status(500).json({
      message: "Error searching pets",
      error: err.message,
    });
  }
};

// Add patient to clinic (create EHR and clinic_patient entry)
export const addPatient = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.user_type;
    const { pet_id, ehrData } = req.body;

    if (!pet_id) {
      return res.status(400).json({
        message: "pet_id is required",
      });
    }

    // Get clinic_id
    const clinicId = await getClinicIdFromUser(userId, userType);

    // Get vet_professional_id (use userId if vet professional, or get from clinic)
    let vetProfessionalId = userId;
    if (userType === 'clinic_admin') {
      // For clinic admin, we need to get a vet professional or use a default
      const vetProfessional = await VetProfessional.findOne({
        where: { clinic_admin_id: userId },
        attributes: ["user_id"],
        limit: 1,
      });
      if (vetProfessional) {
        vetProfessionalId = vetProfessional.user_id;
      } else {
        // If no vet professional found, we can't create EHR
        return res.status(400).json({
          message: "No vet professional found for this clinic. Please add a vet professional first.",
        });
      }
    }

    // Add patient to clinic
    const result = await addPatientToClinic(clinicId, pet_id, vetProfessionalId, ehrData);

    res.status(201).json({
      message: "Patient added to clinic successfully",
      clinicPatient: result.clinicPatient,
      ehr: result.ehr,
      pet: result.pet,
    });
  } catch (err) {
    console.error("Error adding patient:", err);
    res.status(500).json({
      message: "Error adding patient to clinic",
      error: err.message,
    });
  }
};

// Get clinic services for vet professional or clinic admin
export const getMyClinicServices = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.user_type;
    
    let clinic;

    if (userType === 'clinic_admin') {
      // For clinic admin: Get clinic_id directly from owner_id
      clinic = await Clinic.findOne({
        where: { owner_id: userId },
        attributes: ["clinic_id", "service"],
      });

      if (!clinic) {
        return res.status(404).json({
          message: "No clinic found for this clinic admin",
        });
      }
    } else if (userType === 'vet_professional') {
      // For vet professional: Get clinic_id from clinic_admin_id or appointments
      const vetProfessional = await VetProfessional.findOne({
        where: { user_id: userId },
        attributes: ["clinic_admin_id"],
      });

      if (vetProfessional && vetProfessional.clinic_admin_id) {
        // Get clinic_id from clinic admin
        clinic = await Clinic.findOne({
          where: { owner_id: vetProfessional.clinic_admin_id },
          attributes: ["clinic_id", "service"],
        });
      }

      // Fallback: Get clinic_id from appointments
      if (!clinic) {
        const recentAppointment = await Appointment.findOne({
          where: { vet_professional_id: userId },
          attributes: ["clinic_id"],
          order: [["createdAt", "DESC"]],
        });

        if (!recentAppointment || !recentAppointment.clinic_id) {
          return res.status(404).json({
            message: "No clinic found for this vet professional",
          });
        }

        // Fetch clinic with services
        clinic = await Clinic.findByPk(recentAppointment.clinic_id, {
          attributes: ["clinic_id", "service"],
        });

        if (!clinic) {
          return res.status(404).json({
            message: "Clinic not found",
          });
        }
      }
    } else {
      return res.status(403).json({
        message: "Access denied - VetProfessional or ClinicAdmin only",
      });
    }

    // Extract services from clinic
    let services = [];
    if (clinic.service && Array.isArray(clinic.service)) {
      services = clinic.service;
    } else if (clinic.service && typeof clinic.service === 'string') {
      try {
        services = JSON.parse(clinic.service);
      } catch {
        services = [];
      }
    }

    return res.status(200).json({
      message: "Clinic services fetched successfully",
      services,
      clinic_id: clinic.clinic_id,
    });
  } catch (err) {
    console.error("Error fetching clinic services:", err);
    res.status(500).json({
      message: "Error fetching clinic services",
      error: err.message,
    });
  }
};

