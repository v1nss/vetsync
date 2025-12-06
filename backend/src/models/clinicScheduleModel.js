import { DataTypes } from "sequelize";
import sequelize from "../../global/config/db.js";
import Clinic from "./clinicModel.js";

const ClinicSchedule = sequelize.define("ClinicSchedule", {
  schedule_id: {
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
  day_of_week: {
    type: DataTypes.ENUM(
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"
    ),
    allowNull: false,
  },
  open_time: {
    type: DataTypes.TIME,
    allowNull: true, // null = closed
  },
  close_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  is_closed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "clinic_schedules",
  timestamps: false,
});

// Associations
Clinic.hasMany(ClinicSchedule, { foreignKey: "clinic_id", as: "schedules" });
ClinicSchedule.belongsTo(Clinic, { foreignKey: "clinic_id" });

export default ClinicSchedule;

