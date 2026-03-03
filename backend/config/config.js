import dotenv from "dotenv";

dotenv.config();

export default {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "vetsync_dev",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "vetsync_test",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  },
  production: {
    use_env_variable: "PGURL",
    dialect: "postgres",              
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};