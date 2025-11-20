import { DataTypes } from "sequelize";
import sequelize from "../../global/config/db.js";
import User from "./users/userModel.js";

const Clinic = sequelize.define( "Clinic", {
    clinic_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    owner_id: { // change to clinic_admin_id
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id", // links to User's primary key
      },
      // onDelete: "CASCADE", // if owner is deleted, clinic is deleted (not sure abt this)
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
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
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    // Additional fields like
    // operating schedule, services offered, etc. can be added later
  }, {
    tableName: "clinics",
    timestamps: false,
  });

  Clinic.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

  export default Clinic;