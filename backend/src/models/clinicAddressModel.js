import { DataTypes } from "sequelize";
import sequelize from "../../global/config/db.js";
import Clinic from "./clinicModel.js";

const ClinicAddress = sequelize.define("ClinicAddress", {
  address_id: {
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
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  barangay: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  province: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zipcode: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  landmark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true,
  },
}, {
  tableName: "clinic_addresses",
  timestamps: false,
});

// Associations
Clinic.hasOne(ClinicAddress, { foreignKey: "clinic_id", as: "address" });
ClinicAddress.belongsTo(Clinic, { foreignKey: "clinic_id" });

export default ClinicAddress;

