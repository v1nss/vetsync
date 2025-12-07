import { DataTypes } from "sequelize";
import sequelize from "../../global/config/db.js";
import Clinic from "./clinicModel.js";
import Pet from "./petModel.js";

const ClinicPatient = sequelize.define("ClinicPatient", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  pet_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pet,
      key: "pet_id",
    },
    onDelete: "CASCADE",
  },
}, {
  tableName: "clinic_patients",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['clinic_id', 'pet_id'],
      name: 'unique_clinic_pet'
    }
  ]
});

// Associations
Clinic.belongsToMany(Pet, {
  through: ClinicPatient,
  foreignKey: "clinic_id",
  otherKey: "pet_id",
  as: "patients",
});

Pet.belongsToMany(Clinic, {
  through: ClinicPatient,
  foreignKey: "pet_id",
  otherKey: "clinic_id",
  as: "clinics",
});

ClinicPatient.belongsTo(Clinic, { foreignKey: "clinic_id", as: "clinic" });
ClinicPatient.belongsTo(Pet, { foreignKey: "pet_id", as: "pet" });

export default ClinicPatient;

