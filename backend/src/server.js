import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { syncDB } from "./models/index.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from './routes/authRoutes.js';
import petRoutes from "./routes/petRoutes.js";
import clinicRoutes from "./routes/clinicRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import systemAdminRoutes from "./routes/systemAdminRoutes.js";
import ApprovalLogRoutes from "./routes/approvalLogsRoutes.js";
import ehrRoutes from "./routes/ehrRoutes.js";
import clinicPatientRoutes from "./routes/clinicPatientRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://vetsync-business.vercel.app",
  ],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));
app.use(express.json());
app.use(cookieParser());

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

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  // Ensure CORS headers are set even on errors
  const origin = req.headers.origin;
  const allowedOrigins = ["http://localhost:5173", "https://vetsync-business.vercel.app"];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// app.use('/api', testRoute);

// // app.use("/api")
// import { getAuthUrl, getToken } from "../global/config/oauth.js";

// app.get("/", (req, res) => {
//   res.redirect(getAuthUrl());
// });

// app.get("/oauth2callback", async (req, res) => {
//   const code = req.query.code;
//   const tokens = await getToken(code);

//   console.log("TOKENS:", tokens);
//   res.send("Authentication complete! Tokens saved.");
// });

syncDB().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
