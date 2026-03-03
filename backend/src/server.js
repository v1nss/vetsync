import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from './routes/authRoutes.js';
import petRoutes from "./routes/petRoutes.js";
import clinicRoutes from "./routes/clinicRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import systemAdminRoutes from "./routes/systemAdminRoutes.js";
import ApprovalLogRoutes from "./routes/approvalLogsRoutes.js";
import ehrRoutes from "./routes/ehrRoutes.js";
import clinicPatientRoutes from "./routes/clinicPatientRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import { auditLogger } from "../global/middleware/auditMiddleware.js";

import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// CORS config
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://vetsync-business.vercel.app",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(auditLogger);

//user Routes
app.use("/api/users", userRoutes);

//auth Routes
app.use('/api/auth', authRoutes);

//pet Routes
app.use("/api/pets", petRoutes);

//clinic Routes
app.use("/api/clinics", clinicRoutes);

// appointment Routes
app.use("/api/appointments", appointmentRoutes);

//system admin Routes
app.use("/api/system-admin", systemAdminRoutes);

app.use("/api/approval-logs", ApprovalLogRoutes);

// EHR Routes
app.use("/api/ehr", ehrRoutes);
app.use("/api/clinic-patients", clinicPatientRoutes);

// Reports Routes
app.use("/api/reports", reportsRoutes);

// Reports Routes
app.use("/api/reports", reportsRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


