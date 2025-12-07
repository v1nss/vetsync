import { getClinicPatients, getClinicPatient, getClinicPatientsEHRs } from "../services/clinicPatientService.js";
import VetProfessional from "../models/users/vetProfessionalModel.js";
import ClinicAdmin from "../models/users/clinicAdminModel.js";
import Clinic from "../models/clinicModel.js";
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

