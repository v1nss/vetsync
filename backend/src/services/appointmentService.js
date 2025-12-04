import Appointment from "../models/appointmentModel.js";
import ClinicAdmin from "../models/users/clinicAdminModel.js";
import VetProfessional from "../models/users/vetProfessionalModel.js";

export const createAppointment = async (id, appointmentData) => {
 const { body } = appointmentData;
  // No need to parse - it's already an object
  const appointmentInfo = body;
  const newAppointment = await Appointment.create({
    ...appointmentInfo,
    owner_id: id,
  });
  return newAppointment;
};

export const acceptAppointment = async (clinicAdminId, appointmentId, vetProId) => {
  const appointment = await Appointment.findByPk(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  const vetProExists = await VetProfessional.findOne({
    where: {
      user_id: vetProId,
      clinic_admin_id: clinicAdminId,
    },
  });

  if (!vetProExists) {
    throw new Error("Vet Professional does not belong to this Clinic");
  }

  await appointment.update({
    status: "confirmed",
    vet_professional_id: vetProId,
  });

  return appointment;
};

export const completeAppointment = async (appointmentId) => {
  await Appointment.update(
    { status: "completed" },
    { where: { appointment_id: appointmentId } }
  );
}
