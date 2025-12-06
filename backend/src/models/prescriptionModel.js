import { DataTypes } from "sequelize";
import sequelize from "../../global/config/db.js";
import EHR from "./ehrModel.js";

const Prescription = sequelize.define("Prescription", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ehr_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EHR,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "prescription",
  timestamps: true,
});

// Associations
EHR.hasMany(Prescription, { foreignKey: "ehr_id", as: "prescriptions" });
Prescription.belongsTo(EHR, { foreignKey: "ehr_id", as: "ehr" });

export default Prescription;

