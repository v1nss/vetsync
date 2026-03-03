import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// prod sequelize pg db config
const sequelize = new Sequelize(
  process.env.PGURL,
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: "postgres",
    dialectOptions: {
    ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      max: 10,        // maximum number of connections
      min: 0,
      acquire: 30000, // wait 30s before throwing error
      idle: 10000,    // close idle connections after 10s
    },
  }
);

export default sequelize;