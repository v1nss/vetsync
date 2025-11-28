import ClinicAdmin from "../models/users/clinicAdminModel.js";
import Clinic from "../models/clinicModel.js";
import User from "../models/users/userModel.js";

export const registerClinic = async (clinicData, adminUserId) => {

  const admin = await ClinicAdmin.findOne({ where: { user_id: adminUserId } });
  if (!admin) throw new Error("Only clinic admins can register clinics");

//   const { name, address, contact_number, email } = clinicData; //for validation if needed

  const newClinic = await Clinic.create({
    owner_id: adminUserId,
    ...clinicData,
  });
  return newClinic;
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

  const clinic = await Clinic.findOne({where: {owner_id: owner_id}})
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
        { address: { [Op.like]: `%${searchTerm}%` } },
        { description: { [Op.like]: `%${searchTerm}%` } },
      ],
    },
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "full_name", "email"],
      },
    ],
  });

  return clinics;
};