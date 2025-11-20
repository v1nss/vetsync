import sequelize from "../../global/config/db.js";
import User from "./users/userModel.js";
import PetOwner from "./users/petOwnerModel.js";
import ClinicAdmin from "./users/clinicAdminModel.js";
import VetProfessional from "./users/vetProfessionalModel.js";

import Pet from "./petModel.js";
import Clinic from "./clinicModel.js";
import Appointment from "./appointmentModel.js";

// Sync all models with the database
const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true }); // or { force: true } for dev reset // default alter: true
    console.log("Users Database & tables synced successfully!");
  } catch (err) {
    console.error("Error syncing database:", err);
  }
};

export {
  sequelize,
  User,
  PetOwner,
  ClinicAdmin,
  VetProfessional,
  Pet,
  Clinic,
  Appointment,
  syncDB,
};
