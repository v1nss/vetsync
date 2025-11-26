import { DataTypes } from "sequelize";
import sequelize from "../../global/config/db.js";
import User from "./users/userModel.js";
import Clinic from "./clinicModel.js";

const ApprovalLog = sequelize.define( "ApprovalLog", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    system_admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    clinic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Clinic,
        key: "clinic_id",
      },
    },
    action: {
      type: DataTypes.ENUM("approved", "rejected"),
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },{
    tableName: "approval_logs",
    timestamps: false,
  });

ApprovalLog.belongsTo(User, { foreignKey: "system_admin_id", as: 'User' });
ApprovalLog.belongsTo(Clinic, { foreignKey: "clinic_id" });

export default ApprovalLog;
