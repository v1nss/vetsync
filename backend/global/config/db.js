import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.VITE_NODE_ENV === "production";

const dbUrl =
  process.env.PGURL ||
  `postgres://${process.env.DB_USER || "postgres"}:${process.env.DB_PASSWORD || "password"}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 5432}/${process.env.DB_DATABASE || "vetsync_dev"}`;

const sequelize = new Sequelize(dbUrl, {
  dialect: "postgres",
  dialectOptions: isProduction
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  logging: false,
  pool: {
    max: isProduction ? 10 : 5,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
  retry: { max: 3 },
});

export default sequelize;