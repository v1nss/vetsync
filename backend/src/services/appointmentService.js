import Appointment from "../models/appointmentModel.js";
import ClinicAdmin from "../models/users/clinicAdminModel.js";
import VetProfessional from "../models/users/vetProfessionalModel.js";
import ClinicPatient from "../models/clinicPatientModel.js";

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

export const approveAppointment = async (clinicAdminId, appointmentId, vetProId) => {
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
    status: "approved",
    vet_professional_id: vetProId,
  });

  return appointment;
};

export const completeAppointment = async (appointmentId) => {
  // Get the appointment with clinic_id and pet_id
  const appointment = await Appointment.findByPk(appointmentId);
  
  if (!appointment) {
    throw new Error("Appointment not found");
  }

  const { clinic_id, pet_id } = appointment;

  if (!clinic_id || !pet_id) {
    throw new Error("Appointment missing clinic_id or pet_id");
  }

  // Check if the pet already exists as a patient for this clinic
  const existingClinicPatient = await ClinicPatient.findOne({
    where: {
      clinic_id: clinic_id,
      pet_id: pet_id,
    },
  });

  // If not exists, create a new clinic_patient record
  if (!existingClinicPatient) {
    await ClinicPatient.create({
      clinic_id: clinic_id,
      pet_id: pet_id,
    });
    console.log(`Added pet ${pet_id} as patient to clinic ${clinic_id}`);
  }

  // Complete the appointment
  await appointment.update({ status: "completed" });
  
  // Reload to get the latest data
  await appointment.reload();

  return appointment;
}
