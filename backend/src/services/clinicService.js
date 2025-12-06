import ClinicAdmin from "../models/users/clinicAdminModel.js";
import Clinic from "../models/clinicModel.js";
import ClinicAddress from "../models/clinicAddressModel.js";
import ClinicSchedule from "../models/clinicScheduleModel.js";
import User from "../models/users/userModel.js";

// Helper function to format address as string for backward compatibility
const formatAddress = (address) => {
  if (!address) return '';
  const parts = [
    address.street,
    address.barangay,
    address.city,
    address.province,
    address.zipcode
  ].filter(Boolean);
  return parts.join(', ');
};

export const registerClinic = async (clinicData, adminUserId) => {

  const admin = await ClinicAdmin.findOne({ where: { user_id: adminUserId } });
  if (!admin) throw new Error("Only clinic admins can register clinics");

  // Extract address and schedule data from clinicData
  const { 
    street, barangay, city, province, zipcode, landmark, latitude, longitude,
    schedules,
    ...clinicFields 
  } = clinicData;

  // Validate service array
  if (!clinicFields.service || !Array.isArray(clinicFields.service) || clinicFields.service.length === 0) {
    throw new Error("At least one service is required");
  }

  // Ensure service is an array of strings
  clinicFields.service = clinicFields.service.filter(s => s && typeof s === 'string' && s.trim().length > 0);
  if (clinicFields.service.length === 0) {
    throw new Error("At least one valid service is required");
  }

  // Create clinic
  const newClinic = await Clinic.create({
    owner_id: adminUserId,
    ...clinicFields,
  });

  // Create address if provided
  if (street || barangay || city || province || zipcode) {
    await ClinicAddress.create({
      clinic_id: newClinic.clinic_id,
      street: street || "",
      barangay: barangay || "",
      city: city || "",
      province: province || "",
      zipcode: zipcode || "",
      landmark: landmark || null,
      latitude: latitude || null,
      longitude: longitude || null,
    });
  }

  // Create schedules if provided
  if (schedules && Array.isArray(schedules)) {
    const schedulePromises = schedules.map(schedule => 
      ClinicSchedule.create({
        clinic_id: newClinic.clinic_id,
        day_of_week: schedule.day_of_week,
        open_time: schedule.open_time || null,
        close_time: schedule.close_time || null,
        is_closed: schedule.is_closed || false,
      })
    );
    await Promise.all(schedulePromises);
  }

  // Return clinic with associations
  return await Clinic.findOne({
    where: { clinic_id: newClinic.clinic_id },
    include: [
      { model: ClinicAddress, as: "address" },
      { model: ClinicSchedule, as: "schedules" },
    ],
  });
};

export const updateClinic = async (clinicId, updateData, adminUserId) => {

  const admin = await ClinicAdmin.findOne({ where: { user_id: adminUserId } });

  if (!admin) throw new Error("Only clinic admins can update clinic details"); 
    const clinic = await Clinic.findOne({ where: { clinic_id: clinicId } });

    if (!clinic) throw new Error("Clinic not found");

    if (clinic.owner_id !== adminUserId) {
        throw new Error("You do not have permission to update this clinic");
    }

    await clinic.update(updateData);
    return clinic;
}

export const getClinicByOwnerId = async (owner_id) => {
  const owner = await ClinicAdmin.findOne({ where: {user_id: owner_id}})
  if (!owner) throw new Error("Owner id does not exist")

  const clinic = await Clinic.findOne({
    where: {owner_id: owner_id},
    include: [
      { model: ClinicAddress, as: "address" },
      { model: ClinicSchedule, as: "schedules" },
    ],
  })
  if (!clinic) throw new Error("Clinic does not exist");

  return clinic;
}

export const getAllApprovedClinics = async () => {
  const clinics = await Clinic.findAll({
    where: { status: "approved" },
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "full_name", "email"], // Only include necessary fields
      },
      { model: ClinicAddress, as: "address" },
      { model: ClinicSchedule, as: "schedules" },
    ],
    order: [["name", "ASC"]], // Sort by name
  });

  return clinics;
};

export const getClinicById = async (clinicId) => {
  const clinic = await Clinic.findOne({
    where: { 
      clinic_id: clinicId,
      status: "approved" // Only show approved clinics publicly
    },
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "full_name", "email"],
      },
      { model: ClinicAddress, as: "address" },
      { model: ClinicSchedule, as: "schedules" },
    ],
  });

  if (!clinic) {
    throw new Error("Clinic not found or not approved");
  }

  return clinic;
};

export const searchApprovedClinics = async (searchTerm) => {
  const { Op } = await import("sequelize");
  
  const clinics = await Clinic.findAll({
    where: {
      status: "approved",
      [Op.or]: [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { description: { [Op.like]: `%${searchTerm}%` } },
      ],
    },
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "full_name", "email"],
      },
      { 
        model: ClinicAddress, 
        as: "address",
        where: {
          [Op.or]: [
            { street: { [Op.like]: `%${searchTerm}%` } },
            { city: { [Op.like]: `%${searchTerm}%` } },
            { province: { [Op.like]: `%${searchTerm}%` } },
            { barangay: { [Op.like]: `%${searchTerm}%` } },
          ],
        },
        required: false,
      },
      { model: ClinicSchedule, as: "schedules" },
    ],
  });

  return clinics;
};