import { getUserActivityReport, getAuditTrail, getClinicPerformanceReport, getClinicReport, getAuditTrailReport } from "../services/reportsService.js";
import { generatePDFReport } from "../../global/utils/pdfGenerator.js";
import { getEHRsByPet } from "../services/ehrService.js";

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

export const downloadAuditTrail = async (req, res) => {
  try {
    const {method, url, user_id, startDate, endDate } = req.query;
      try {
        const logs = await getAuditTrailReport({method, url, user_id, startDate, endDate });

        const headers = [
          'id', 'method', 'url', 'status_code',
          'user_id', 'user_email', 'user_type',
          'ip_address', 'response_time_ms', 'createdAt'
        ];

        const escape = (val) => {
          if (val == null) return '';
          const str = String(val);
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        };

        const csvRows = [
          headers.join(','),
          ...logs.map(row => headers.map(h => escape(row[h])).join(','))
        ].join('\r\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="audit-trail-${req.query.startDate}-to-${req.query.endDate}.csv"`);
        res.status(200).end(csvRows);

      } catch (err) {
        console.error('Audit trail download error:', err);
        res.status(400).json({ message: err.message });
      }
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
    if (req.body.patientId) {
      const healthData = await getEHRsByPet(req.body.patientId);
      req.body = { ...req.body, healthData };
    }
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