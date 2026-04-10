import { Op, fn, col, literal } from "sequelize";
import sequelize from "../../global/config/db.js";
import Clinic from "../models/clinicModel.js";
import User from "../models/users/userModel.js";
import AuditLog from "../models/auditLogModel.js";
import Appointment from "../models/appointmentModel.js";
import ClinicPatient from "../models/clinicPatientModel.js";
import Pet from "../models/petModel.js";

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

const MAX_RANGE_DAYS = 7;

function getRangeDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;

  return Math.floor((utcEnd - utcStart) / msPerDay) + 1;
}

export const getAuditTrailReport = async ({
  method,
  url,
  user_id,
  startDate,
  endDate
}) => {
  if (!startDate || !endDate) {
    throw new Error("startDate and endDate are required for downloads");
  }

  const rangeDays = getRangeDays(startDate, endDate);

  if (rangeDays > MAX_RANGE_DAYS) {
    throw new Error(`Download range cannot exceed ${MAX_RANGE_DAYS} days`);
  }

  const where = {};

  if (method) where.method = method;
  if (url) where.url = { [Op.like]: `%${url}%` };
  if (user_id) where.user_id = user_id;

  where.createdAt = {
    [Op.gte]: new Date(startDate),
    [Op.lte]: new Date(endDate),
  };

  const logs = await AuditLog.findAll({
    where,
    order: [["createdAt", "DESC"]],
    raw: true,
  });
  return logs;
};

export const getClinicPerformanceReport = async () => {
  const result = await Clinic.findAll({
    attributes: [
      "clinic_id",
      "name",
      [fn("COUNT", col("appointments.appointment_id")), "total_completed_appointments"],
    ],
    include: [
      {
        model: Appointment,
        as: "appointments",
        attributes: [],
        where: { status: "completed" },
        required: false,
      },
    ],
    group: ["Clinic.clinic_id", "Clinic.name"],
    order: [[fn("COUNT", col("appointments.appointment_id")), "DESC"]],
    raw: true,
  });

  const ranked = result.map((row, index) => ({
    rank: index + 1,
    clinic_id: row.clinic_id,
    clinic_name: row.name,
    total_completed_appointments: parseInt(row.total_completed_appointments, 10),
  }));

  return { clinics: ranked };
};

export const getClinicReport = async (clinicId) =>{
  const clinicName = await Clinic.findByPk(clinicId, { attributes: ["name"], raw: true }).then(c => c ? c.name : "Clinic");
  const patients = await ClinicPatient.findAll({
    where: { clinic_id: clinicId },
    include: [
      {
        model: Pet,
        as: "pet",
        attributes: ["pet_id", "name", "species", "breed", "birthdate", "gender"],
        include: [
          {
            model: User,
            as: "owner",
            attributes: ["id", "first_name", "last_name"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const petIds = patients.map(cp => cp.pet?.pet_id).filter(Boolean);

  const appointmentCounts = petIds.length > 0
    ? await Appointment.findAll({
        where: { pet_id: { [Op.in]: petIds }, clinic_id: clinicId },
        attributes: [
          "pet_id",
          [sequelize.fn("COUNT", sequelize.col("appointment_id")), "appointmentCount"],
        ],
        group: ["pet_id"],
        raw: true,
      })
    : [];

  const countMap = {};
  appointmentCounts.forEach((ac) => {
    countMap[ac.pet_id] = parseInt(ac.appointmentCount, 10);
  });

  // Gender counts
  const genderCounts = patients.reduce(
    (acc, cp) => {
      const gender = cp.pet?.gender?.toLowerCase();
      if (gender === "male")        acc.male++;
      else if (gender === "female") acc.female++;
      return acc;
    },
    { male: 0, female: 0 }
  );

  // Breed summary
  const breedMap = {};
  patients.forEach((cp) => {
    const breed = cp.pet?.breed;
    if (breed) breedMap[breed] = (breedMap[breed] || 0) + 1;
  });

  const breedSummary = Object.entries(breedMap)
    .map(([breed, count]) => ({ breed, count }))
    .sort((a, b) => b.count - a.count);

  // Map to plain objects with only needed fields
  const patientList = patients
    .map((cp) => {
      const pet = cp.pet;
      if (!pet) return null;

      const birthdate = pet.birthdate ? new Date(pet.birthdate) : null;
      const age = birthdate
        ? Math.floor((Date.now() - birthdate) / (1000 * 60 * 60 * 24 * 365.25))
        : null;

      return {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age,
        owner: pet.owner
          ? `${pet.owner.first_name} ${pet.owner.last_name}`
          : null,
        appointmentCount: countMap[pet.pet_id] || 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.appointmentCount - a.appointmentCount);

  return {
    patients: patientList,
    genderCounts,
    breedSummary,
    clinicName
  };
};