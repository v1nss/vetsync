'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("audit_logs", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    method: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    url: {
      type: Sequelize.STRING(2048),
      allowNull: false,
    },
    status_code: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    user_email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    user_type: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    ip_address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    response_time_ms: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("NOW()"),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("audit_logs");
}
