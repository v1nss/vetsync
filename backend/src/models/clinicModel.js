import { DataTypes } from "sequelize";
import sequelize from "../../global/config/db.js";
import User from "./users/userModel.js";

const Clinic = sequelize.define("Clinic", {
  clinic_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  contact_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  service: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },

  clinic_images: {
    type: DataTypes.JSON,
    allowNull: true,
  },

  secdti_url: {
    type: DataTypes.JSON,
    allowNull: false,
  },

  mayor_permit_url: {
    type: DataTypes.JSON,
    allowNull: false,
  },

  bir_url: {
    type: DataTypes.JSON,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },

}, {
  tableName: "clinics",
  timestamps: false,
});

Clinic.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

export default Clinic;
