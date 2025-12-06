import { DataTypes } from "sequelize";
import sequelize from "../../../global/config/db.js";
import User from "./userModel.js";

const PetOwner = sequelize.define("PetOwner", {
  user_id: { // change reference to other entities to pet_owner_id
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: User, key: "id" },
  },
  address: DataTypes.TEXT,
}, {
  tableName: "pet_owners",
  timestamps: false,
});

User.hasOne(PetOwner, { foreignKey: "user_id" });
PetOwner.belongsTo(User, { foreignKey: "user_id" });

export default PetOwner;