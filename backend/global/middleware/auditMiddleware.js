import AuditLog from "../../src/models/auditLogModel.js";

export const auditLogger = (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  const start = Date.now();

  res.on("finish", async () => {
    if (res.statusCode >= 400 && res.statusCode < 500 && !req.user) return;

    try {
      await AuditLog.create({
        method: req.method,
        url: req.originalUrl,
        status_code: res.statusCode,
        user_id: req.user?.id || null,
        user_email: req.user?.email || null,
        user_type: req.user?.user_type || null,
        ip_address: req.ip || req.connection?.remoteAddress || null,
        response_time_ms: Date.now() - start,
      });
    } catch (err) {
      console.error("Audit log write failed:", err.message);
    }
  });

  next();
};
