import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(process.env.PGURL, {
  dialect: "postgres",
  dialectOptions: isProduction
    ? { ssl: { require: true, rejectUnauthorized: true } }
    : {},
  logging: isProduction ? false : console.log,
  pool: {
    max: isProduction ? 10 : 5,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
  retry: { max: 3 },
});

export default sequelize;