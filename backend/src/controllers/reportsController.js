import { getUserActivityReport, getAuditTrail, getClinicPerformanceReport, getClinicReport } from "../services/reportsService.js";
import { generatePDFReport } from "../../global/utils/pdfGenerator.js";

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

export const downloadPatientReport = async (req, res) => {
  try {
    const buffer = await generatePDFReport(req.body, "patient");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("content-disposition", `attachment; filename="Patient ${req.body.petName} Report.pdf"`);
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    res.setHeader("Content-Length", buffer.length);

    res.status(200).send(buffer);
  } catch (err) {
    console.error("Failed to generate patient report", err);
    res.status(500).json({ message: "Failed to generate report" });
  }
};

export const downloadClinicReport = async (req, res) => {
  try {
    const data = await getClinicReport(req.params.clinicId);
    const buffer = await generatePDFReport(data, "clinic");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("content-disposition", `attachment; filename="${data.clinicName} Report.pdf"`);
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    res.setHeader("Content-Length", buffer.length);

    res.status(200).send(buffer);
  } catch (err) {
    console.error("Failed to generate clinic report", err);
    res.status(500).json({ message: "Failed to generate report" });
  }
};