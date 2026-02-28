import { DataTypes } from "sequelize";
import sequelize from "../../global/config/db.js";

const AuditLog = sequelize.define("AuditLog", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  method: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING(2048),
    allowNull: false,
  },
  status_code: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  response_time_ms: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "audit_logs",
  timestamps: true,
  updatedAt: false,
});

export default AuditLog;
