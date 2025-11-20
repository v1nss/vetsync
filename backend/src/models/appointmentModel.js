import { DataTypes } from "sequelize";
import sequelize from "../../global/config/db.js";
import Pet from "./petModel.js";
import VetProfessional from "./users/vetProfessionalModel.js";
import Clinic from "./clinicModel.js";
import PetOwner from "./users/petOwnerModel.js";

const Appointment = sequelize.define("Appointment", {
  appointment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PetOwner,
      key: "user_id",
    },
  },
  pet_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pet,
      key: "pet_id",
    },
    // onDelete: "CASCADE", // if pet is deleted, appointments are deleted
  },
  vet_professional_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: VetProfessional,
      key: "user_id",
    },
    // onDelete: "SET NULL", // if vet professional is deleted, set to null
  },
  clinic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    reference: {
      model: Clinic,
      key: "clinic_id",
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "completed", "canceled"),
    defaultValue: "pending",
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
},{
  tableName: "appointments",
  timestamps: true,
});

Clinic.hasMany(VetProfessional, { foreignKey: "clinic_id", as: "vets" });
VetProfessional.belongsTo(Clinic, { foreignKey: "clinic_id", as: "clinic" });

VetProfessional.hasMany(Appointment, { foreignKey: "vet_professional_id", as: "appointments" });
Appointment.belongsTo(VetProfessional, { foreignKey: "vet_professional_id", as: "vet" });

Clinic.hasMany(Appointment, { foreignKey: "clinic_id", as: "appointments" });
Appointment.belongsTo(Clinic, { foreignKey: "clinic_id", as: "clinic" });

export default Appointment;
