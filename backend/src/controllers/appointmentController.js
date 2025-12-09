import Appointment from "../models/appointmentModel.js";
import Pet from "../models/petModel.js";
import User from "../models/users/userModel.js";
import Clinic from "../models/clinicModel.js";
import ClinicAddress from "../models/clinicAddressModel.js";
import {
  createAppointment,
  approveAppointment,
  completeAppointment,
  rejectAppointment
} from "../services/appointmentService.js";
import { PetOwner, VetProfessional } from "../models/index.js";

export const createNewAppointment = async (req, res) => {
  try {
    const owner_id = req.user.id; // from JWT
    const newAppointment = await createAppointment(owner_id, req);
    res
      .status(201)
      .json({
        message: "Appointment created successfully",
        appointment: newAppointment,
      });
  } catch (err) {
    console.error("Error creating appointment", err.message);
    res
      .status(500)
      .json({ message: "Error creating appointment", error: err.message });
  }
};

export const approveAppointmentRequest = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const clinicAdminId = req.user.id; // from JWT
    const { vet_professional_id } = req.body // not sure for now if clinicAdmin is the only one that can accept appointment

    await approveAppointment(clinicAdminId, appointmentId, vet_professional_id);

    res
    .status(200)
    .json({message: "Appointment accepted successfully" });

  } catch (err) {
    console.error("Error accepting appointment", err.message);
    res
    .status(500)
    .json({message: "Error accepting appointment", error: err.message });
  }
};

export const rejectAppointmentRequest = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const { rejection_reason } = req.body;

    const appointment = await rejectAppointment(appointmentId, rejection_reason);

    res
      .status(200)
      .json({message: "Appointment rejected successfully", appointment });
  } catch (err) {
    console.error("Error rejecting appointment", err.message);
    res
      .status(500)
      .json({message: "Error rejecting appointment", error: err.message });
  }
};

export const completeAppointmentRequest = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    // const { vet_professional_id } = req.body // not sure for now if clinicAdmin is the only one that can accept appointment
    const appointment = await completeAppointment(appointmentId);
    res
      .status(200)
      .json({message: "Appointment completed successfully", appointment });
  } catch (err) {
    console.error("Error completing appointment", err.message);
    res
      .status(500)
      .json({message: "Error completing appointment", error: err.message });
  }
};

export const getAppointmentsByOwner = async (req, res) => {
  try {
    const owner_id = req.user.id; // from JWT
    const appointments = await Appointment.findAll({
      where: {
        owner_id: owner_id
      },
      include: [
        {
          model: PetOwner,
          as: "owner",
          attributes: ["address"],

          include: [
            {
              model: User,
              attributes: ["first_name","last_name", "email", "phone_number"]
            }
          ]
        },
        {
          model: VetProfessional,
          as: "vet",
          include: [
            {
              model: User,
              attributes: ["first_name","last_name", "email", "phone_number"]
            }
          ]
        },
        {
          model: Pet,
          as: "pet",
          attributes: ["name", "species", "breed", "birthdate", "gender"]
        },
        {
          model: Clinic,
          as: "clinic",
          attributes: ["name", "contact_number"],
          include: [{ model: ClinicAddress, as: "address" }]
        }
      ],
      order: [["date", "ASC"], ["time", "ASC"]]
    });
    
    return res
      .status(200)
      .json({ appointments });
  } catch (err) {
    console.error("Error fetching appointments for owner", err.message);
    res
      .status(500)
      .json({ message: "Error fetching appointments for owner", error: err.message });
  }
}

export const fetchAppointmentsByClinic = async (req, res) => {
  const clinicId = req.params.clinicId;
  try {
    const appointments = await Appointment.findAll({
      where: {
        clinic_id: clinicId
      }, 
      include: [
        {
          model: PetOwner,
          as: "owner",
          attributes: ["address"],

          include: [
            {
              model: User,
              attributes: ["first_name", "last_name", "email", "phone_number"]
            }
          ]
        },
        {
          model: Pet,
          as: "pet",
          attributes: ["name", "species", "breed", "birthdate", "gender"]
        },
        {
          model: Clinic,
          as: "clinic",
          attributes: ["name", "contact_number"],
          include: [{ model: ClinicAddress, as: "address" }]
        }
      ],
      order: [["createdAt", "ASC"], ["time", "ASC"]]
    });
    return res 
          .status(200)
          .json({appointments});
  } catch (err) {
    console.error("Error fetching appointments by clinic", err.message);
    throw err;
  }
};

export const getAppointmentsByVet = async (req, res) => {
  try {
    const vetProfessionalId = req.user.id; // from JWT 
    const appointments = await Appointment.findAll({
      where: {
        vet_professional_id: vetProfessionalId
      },
       include: [
        {
          model: PetOwner,
          as: "owner",
          attributes: ["address"],

          include: [
            {
              model: User,
              attributes: ["first_name", "last_name", "email", "phone_number"]
            }
          ]
        },
        {
          model: VetProfessional,
          as: "vet",
          include: [
            {
              model: User,
              attributes: ["first_name", "last_name", "email", "phone_number"]
            }
          ]
        },
        {
          model: Pet,
          as: "pet",
          attributes: ["name", "species", "breed", "birthdate", "gender"]
        },
        {
          model: Clinic,
          as: "clinic",
          attributes: ["name",  "contact_number"],
          include: [{ model: ClinicAddress, as: "address" }]
        }
      ],
      order: [["date", "ASC"], ["time", "ASC"]]
    });
    return res
      .status(200)
      .json({ appointments });
  } catch (err) {
    console.error("Error fetching appointments for vet", err.message);
    res
      .status(500)
      .json({ message: "Error fetching appointments for vet", error: err.message });
  }
};

export const deleteAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    await Appointment.destroy({
      where: {
        appointment_id: appointmentId
      }
    });
    return res
      .status(200)
      .json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment", err.message);
    res
      .status(500)
      .json({ message: "Error deleting appointment", error: err.message });
  }
};