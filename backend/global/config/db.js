import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DB_DATABASE,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "postgres",
//     logging: false,
//     pool: {
//       max: 10,        // maximum number of connections
//       min: 0,
//       acquire: 30000, // wait 30s before throwing error
//       idle: 10000,    // close idle connections after 10s
//     },
//   }
// );

// export default sequelize;

// prod sequelize pg db config
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: "postgres",
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