import { DataTypes } from "sequelize";
import sequelize from "../../global/config/db.js";
import PetOwner from "./users/petOwnerModel.js";
import Pet from "./petModel.js";
import VetProfessional from "./users/vetProfessionalModel.js";
import Clinic from "./clinicModel.js";
import Appointment from "./appointmentModel.js";

const EHR = sequelize.define("EHR", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pet_owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PetOwner,
      key: "user_id",
    },
    onDelete: "CASCADE",
  },
  pet_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pet,
      key: "pet_id",
    },
    onDelete: "CASCADE",
  },
  vet_professional_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: VetProfessional,
      key: "user_id",
    },
    onDelete: "SET NULL",
  },
  clinic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Clinic,
      key: "clinic_id",
    },
    onDelete: "CASCADE",
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Appointment,
      key: "appointment_id",
    },
    onDelete: "SET NULL",
  },
  visit_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  attached_files: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: "ehr",
  timestamps: true,
});

// Associations
PetOwner.hasMany(EHR, { foreignKey: "pet_owner_id", as: "ehrs" });
EHR.belongsTo(PetOwner, { foreignKey: "pet_owner_id", as: "petOwner" });

Pet.hasMany(EHR, { foreignKey: "pet_id", as: "ehrs" });
EHR.belongsTo(Pet, { foreignKey: "pet_id", as: "pet" });

VetProfessional.hasMany(EHR, { foreignKey: "vet_professional_id", as: "ehrs" });
EHR.belongsTo(VetProfessional, { foreignKey: "vet_professional_id", as: "vetProfessional" });

Clinic.hasMany(EHR, { foreignKey: "clinic_id", as: "ehrs" });
EHR.belongsTo(Clinic, { foreignKey: "clinic_id", as: "clinic" });

Appointment.hasMany(EHR, { foreignKey: "appointment_id", as: "ehrs" });
EHR.belongsTo(Appointment, { foreignKey: "appointment_id", as: "appointment" });

export default EHR;

