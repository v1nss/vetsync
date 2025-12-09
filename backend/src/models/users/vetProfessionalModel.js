import { DataTypes } from "sequelize";
import sequelize from "../../../global/config/db.js";
import User from "./userModel.js";
import ClinicAdmin from "./clinicAdminModel.js";
import Clinic from "../clinicModel.js";

const VetProfessional = sequelize.define("VetProfessional", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: User, key: "id" },
  },
  license_number: { type: DataTypes.STRING, allowNull: false },
  specialization: DataTypes.STRING,
  clinic_admin_id: { 
    type: DataTypes.INTEGER,
    references: { model: ClinicAdmin, key: "user_id" },
    onDelete: "SET NULL",
  },
  clinic_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: Clinic, key: "clinic_id" },
    onDelete: "SET NULL",
  },
}, {
  tableName: "vet_professionals",
  timestamps: false,
});

// Associations
User.hasOne(VetProfessional, { foreignKey: "user_id" });
VetProfessional.belongsTo(User, { foreignKey: "user_id" });

ClinicAdmin.hasMany(VetProfessional, { foreignKey: "clinic_admin_id" });
VetProfessional.belongsTo(ClinicAdmin, { foreignKey: "clinic_admin_id" });

export default VetProfessional; 