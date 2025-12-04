import Appointment from "../models/appointmentModel.js";
import Pet from "../models/petModel.js";
import User from "../models/users/userModel.js";
import Clinic from "../models/clinicModel.js";

import {
  createAppointment,
  acceptAppointment,
  completeAppointment
} from "../services/appointmentService.js";
import { PetOwner } from "../models/index.js";

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

export const acceptAppointmentRequest = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const clinicAdminId = req.user.id; // from JWT
    const { vet_professional_id } = req.body // not sure for now if clinicAdmin is the only one that can accept appointment

    await acceptAppointment(clinicAdminId, appointmentId, vet_professional_id);

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
              attributes: ["full_name", "email", "phone_number"]
            }
          ]
        },
        {
          model: Pet,
          as: "pet",
          attributes: ["name", "species", "breed", "birthdate"]
        },
        {
          model: Clinic,
          as: "clinic",
          attributes: ["name", "address", "contact_number"]
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