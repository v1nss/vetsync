import { DataTypes } from "sequelize";
import sequelize from "../../global/config/db.js";
import EHR from "./ehrModel.js";

const LabResult = sequelize.define("LabResult", {
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
  tableName: "lab_result",
  timestamps: true,
});

// Associations
EHR.hasMany(LabResult, { foreignKey: "ehr_id", as: "labResults" });
LabResult.belongsTo(EHR, { foreignKey: "ehr_id", as: "ehr" });

export default LabResult;

