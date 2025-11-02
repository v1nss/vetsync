import Appointment from "../models/appointmentModel.js";
import ClinicAdmin from "../models/users/clinicAdminModel.js";
import VetProfessional from "../models/users/vetProfessionalModel.js";

export const createAppointment = async (appointmentData) => {
  const newAppointment = await Appointment.create(appointmentData);
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
  });// need to double check restriction logic
    if (!vetProExists) {
        throw new Error("Vet Professional does not belong to this Clinic"); // does not belong to clinic admin
    }
  appointment.status = "confirmed";
  appointment.vet_professional_id = vetProId;
 
  await appointment.update(appointment);
  return appointment;
};
