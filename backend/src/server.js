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
import testRoute from './routes/testRoute.js'

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: "http://localhost:5173", // Change this when deployed to prod
  credentials: true,
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
