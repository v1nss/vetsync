import { Op, fn, col, literal } from "sequelize";
import sequelize from "../../global/config/db.js";
import Clinic from "../models/clinicModel.js";
import User from "../models/users/userModel.js";
import AuditLog from "../models/auditLogModel.js";

export const getUserActivityReport = async () => {
  const clinicStats = await Clinic.findAll({
    attributes: [
      "status",
      [fn("COUNT", col("clinic_id")), "count"],
    ],
    group: ["status"],
    raw: true,
  });

  const clinicBreakdown = { approved: 0, pending: 0, rejected: 0 };
  clinicStats.forEach((row) => {
    clinicBreakdown[row.status] = parseInt(row.count, 10);
  });

  const userStats = await User.findAll({
    attributes: [
      "user_type",
      [fn("COUNT", col("id")), "count"],
    ],
    group: ["user_type"],
    raw: true,
  });

  const userBreakdown = {};
  userStats.forEach((row) => {
    userBreakdown[row.user_type] = parseInt(row.count, 10);
  });

  const now = new Date();
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [logins30d, logins7d, logins24h] = await Promise.all([
    AuditLog.count({
      where: {
        url: { [Op.like]: "%/auth/login%" },
        method: "POST",
        status_code: 200,
        createdAt: { [Op.gte]: last30d },
      },
    }),
    AuditLog.count({
      where: {
        url: { [Op.like]: "%/auth/login%" },
        method: "POST",
        status_code: 200,
        createdAt: { [Op.gte]: last7d },
      },
    }),
    AuditLog.count({
      where: {
        url: { [Op.like]: "%/auth/login%" },
        method: "POST",
        status_code: 200,
        createdAt: { [Op.gte]: last24h },
      },
    }),
  ]);

  const uniqueActiveUsers30d = await AuditLog.count({
    distinct: true,
    col: "user_id",
    where: {
      user_id: { [Op.ne]: null },
      createdAt: { [Op.gte]: last30d },
    },
  });

  const totalRequests30d = await AuditLog.count({
    where: { createdAt: { [Op.gte]: last30d } },
  });

  const dailyLogins = await AuditLog.findAll({
    attributes: [
      [fn("DATE", col("createdAt")), "date"],
      [fn("COUNT", col("id")), "count"],
    ],
    where: {
      url: { [Op.like]: "%/auth/login%" },
      method: "POST",
      status_code: 200,
      createdAt: { [Op.gte]: last30d },
    },
    group: [fn("DATE", col("createdAt"))],
    order: [[fn("DATE", col("createdAt")), "ASC"]],
    raw: true,
  });

  const topEndpoints = await AuditLog.findAll({
    attributes: [
      "url",
      "method",
      [fn("COUNT", col("id")), "count"],
    ],
    where: { createdAt: { [Op.gte]: last7d } },
    group: ["url", "method"],
    order: [[fn("COUNT", col("id")), "DESC"]],
    limit: 10,
    raw: true,
  });

  return {
    clinics: clinicBreakdown,
    users: userBreakdown,
    logins: { last24h: logins24h, last7d: logins7d, last30d: logins30d },
    activeUsers30d: uniqueActiveUsers30d,
    totalRequests30d,
    dailyLogins,
    topEndpoints,
  };
};

export const getAuditTrail = async ({ page = 1, limit = 20, method, url, user_id, startDate, endDate }) => {
  const where = {};

  if (method) where.method = method;
  if (url) where.url = { [Op.like]: `%${url}%` };
  if (user_id) where.user_id = user_id;

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = new Date(startDate);
    if (endDate) where.createdAt[Op.lte] = new Date(endDate);
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await AuditLog.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit, 10),
    offset,
  });

  return {
    logs: rows,
    total: count,
    page: parseInt(page, 10),
    totalPages: Math.ceil(count / limit),
  };
};
