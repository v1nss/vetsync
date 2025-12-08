import Appointment from "../models/appointmentModel.js";
import ClinicAdmin from "../models/users/clinicAdminModel.js";
import VetProfessional from "../models/users/vetProfessionalModel.js";
import ClinicPatient from "../models/clinicPatientModel.js";
import PetOwner from "../models/users/petOwnerModel.js";
import Pet from "../models/petModel.js";
import Clinic from "../models/clinicModel.js";
import User from "../models/users/userModel.js";
import { sendAppointmentApprovalEmail, sendAppointmentRejectionEmail } from "../../global/utils/emailService.js";

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
  const appointment = await Appointment.findByPk(appointmentId, {
    include: [
      {
        model: PetOwner,
        as: "owner",
        include: [
          {
            model: User,
            attributes: ["first_name", "last_name", "email"]
          }
        ]
      },
      {
        model: Pet,
        as: "pet",
        attributes: ["name", "species"]
      },
      {
        model: Clinic,
        as: "clinic",
        attributes: ["name"]
      },
      {
        model: VetProfessional,
        as: "vet",
        include: [
          {
            model: User,
            attributes: ["first_name", "last_name"]
          }
        ],
        required: false
      }
    ]
  });

  if (!appointment) throw new Error("Appointment not found");
  
  // Store original status before updating to check if email should be sent
  const originalStatus = appointment.status;
  
  const vetProExists = await VetProfessional.findOne({
    where: {
      user_id: vetProId,
      clinic_admin_id: clinicAdminId,
    },
    include: [
      {
        model: User,
        attributes: ["first_name", "last_name"]
      }
    ]
  });

  if (!vetProExists) {
    throw new Error("Vet Professional does not belong to this Clinic");
  }

  await appointment.update({
    status: "approved",
    vet_professional_id: vetProId,
  });

  // Reload appointment to get updated vet info
  await appointment.reload({
    include: [
      {
        model: PetOwner,
        as: "owner",
        include: [
          {
            model: User,
            attributes: ["first_name", "last_name", "email"]
          }
        ]
      },
      {
        model: Pet,
        as: "pet",
        attributes: ["name", "species"]
      },
      {
        model: Clinic,
        as: "clinic",
        attributes: ["name"]
      },
      {
        model: VetProfessional,
        as: "vet",
        include: [
          {
            model: User,
            attributes: ["first_name", "last_name"]
          }
        ],
        required: false
      }
    ]
  });

  // Send approval email only if appointment was previously pending
  // Check original status before update to avoid duplicate emails
  const wasPending = originalStatus === 'pending' || originalStatus === 'Pending';
  
  if (wasPending) {
    try {
      const ownerName = appointment.owner?.User?.first_name && appointment.owner?.User?.last_name
        ? `${appointment.owner.User.first_name} ${appointment.owner.User.last_name}`
        : 'Pet Owner';
      const ownerEmail = appointment.owner?.User?.email;
      const petName = appointment.pet?.name || 'Your pet';
      const clinicName = appointment.clinic?.name || 'the clinic';
      const vetName = vetProExists?.User?.first_name && vetProExists?.User?.last_name
        ? `${vetProExists.User.first_name} ${vetProExists.User.last_name}`
        : null;

      if (ownerEmail) {
        console.log('Sending approval email for appointment:', appointmentId);
        await sendAppointmentApprovalEmail({
          ownerName,
          ownerEmail,
          petName,
          clinicName,
          appointmentDate: appointment.date,
          appointmentTime: appointment.time,
          service: appointment.service,
          vetName
        });
        console.log('Approval email sent successfully');
      }
    } catch (emailError) {
      console.error("Error sending approval email:", emailError);
      // Don't throw - email failure shouldn't break the approval process
    }
  } else {
    console.log('Appointment already approved, skipping email to avoid duplicates');
  }

  return appointment;
};

export const rejectAppointment = async (appointmentId, rejectionReason) => {
  const appointment = await Appointment.findByPk(appointmentId, {
    include: [
      {
        model: PetOwner,
        as: "owner",
        include: [
          {
            model: User,
            attributes: ["first_name", "last_name", "email"]
          }
        ]
      },
      {
        model: Pet,
        as: "pet",
        attributes: ["name", "species"]
      },
      {
        model: Clinic,
        as: "clinic",
        attributes: ["name"]
      }
    ]
  });

  if (!appointment) throw new Error("Appointment not found");

  // Store original status before updating to check if email should be sent
  const originalStatus = appointment.status;

  // Update status to canceled (since rejected is not in enum, using canceled)
  // Store rejection reason in notes field
  const updatedNotes = rejectionReason 
    ? (appointment.notes ? `${appointment.notes}\n\nRejection Reason: ${rejectionReason}` : `Rejection Reason: ${rejectionReason}`)
    : appointment.notes;

  await appointment.update({
    status: "canceled",
    notes: updatedNotes,
  });

  // Send rejection email only if appointment was previously pending
  // Check original status before update to avoid duplicate emails
  const wasPending = originalStatus === 'pending' || originalStatus === 'Pending';
  
  if (wasPending) {
    try {
      const ownerName = appointment.owner?.User?.first_name && appointment.owner?.User?.last_name
        ? `${appointment.owner.User.first_name} ${appointment.owner.User.last_name}`
        : 'Pet Owner';
      const ownerEmail = appointment.owner?.User?.email;
      const petName = appointment.pet?.name || 'Your pet';
      const clinicName = appointment.clinic?.name || 'the clinic';

      if (ownerEmail) {
        console.log('Sending rejection email for appointment:', appointmentId);
        await sendAppointmentRejectionEmail({
          ownerName,
          ownerEmail,
          petName,
          clinicName,
          appointmentDate: appointment.date,
          appointmentTime: appointment.time,
          service: appointment.service,
          rejectionReason: rejectionReason || 'No reason provided'
        });
        console.log('Rejection email sent successfully');
      }
    } catch (emailError) {
      console.error("Error sending rejection email:", emailError);
      // Don't throw - email failure shouldn't break the rejection process
    }
  } else {
    console.log('Appointment already rejected/canceled, skipping email to avoid duplicates');
  }

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
