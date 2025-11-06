import {
  createAppointment,
  acceptAppointment,
  completeAppointment
} from "../services/appointmentService.js";

export const createNewAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    const newAppointment = await createAppointment(appointmentData);
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
