import { getUserActivityReport, getAuditTrail, getClinicPerformanceReport } from "../services/reportsService.js";

export const fetchUserActivityReport = async (req, res) => {
  try {
    const report = await getUserActivityReport();
    res.status(200).json(report);
  } catch (err) {
    console.error("Error fetching user activity report:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const fetchAuditTrail = async (req, res) => {
  try {
    const { page, limit, method, url, user_id, startDate, endDate } = req.query;
    const result = await getAuditTrail({ page, limit, method, url, user_id, startDate, endDate });
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching audit trail:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const fetchClinicPerformanceReport = async (req, res) => {
  try {
    const result = await getClinicPerformanceReport();
    // Placeholder for clinic performance report logic
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching clinic performance report:", err.message);
    res.status(500).json({ error: err.message });
  }
};
