import { DataTypes } from "sequelize";
import sequelize from "../../global/config/db.js";
import EHR from "./ehrModel.js";

const Vaccination = sequelize.define("Vaccination", {
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
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "vaccination",
  timestamps: true,
});

// Associations
EHR.hasMany(Vaccination, { foreignKey: "ehr_id", as: "vaccinations" });
Vaccination.belongsTo(EHR, { foreignKey: "ehr_id", as: "ehr" });

export default Vaccination;

