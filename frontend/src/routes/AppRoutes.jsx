
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/pet-owner/HomePage";
import ClinicViewPage from "../pages/pet-owner/ClinicViewPage";
import BookAppointmentPage from "../pages/pet-owner/BookAppointmentPage";
import EHRPage from "../pages/pet-owner/EHRPage";
import AppointmentsPage from "../pages/pet-owner/AppointmentsPage";
import ManagePetsPage from "../pages/pet-owner/ManagePetsPage";
import MessagesPage from "../pages/pet-owner/MessagesPage";
import ClinicAdminDashboard from "../pages/clinic-admin/ClinicAdminDashboard";
import PatientManagementPage from "../pages/clinic-admin/PatientManagementPage";
import ClinicManagementPage from "../pages/clinic-admin/ClinicManagementPage";
import SettingsPage from "../pages/pet-owner/SettingsPage";
import VetAppointmentPage from "../pages/vet-pro/VetAppointmentsPage";
import ClinicsManagementPage from "../pages/system-admin/ClinicsManagementPage";
import UserManagementPage from "../pages/system-admin/UserManagementPage";

// Public routes (no auth required)
const PublicRoute = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

// Protected routes (auth required)
const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Role-based wrappers
const PetOwnerRoute = () => {
    const { role } = useAuth();
    return role === "pet_owner" ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

const ClinicAdminRoute = () => {
    const { role } = useAuth();
    return role === "clinic_admin" ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

// Placeholder dashboard pages for each role
const PetOwnerDashboard = () => <div>Pet Owner Dashboard</div>;
const Unauthorized = () => <div>Unauthorized</div>;

const AppRoutes = () => (
    <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}> 
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* For Pet Owners - Temporary routing */}
            <Route path="/:slug" element={<ClinicViewPage />} />
            <Route path="/:slug/book" element={<BookAppointmentPage />} />
            <Route path="/health-records" element={<EHRPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/pets" element={<ManagePetsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* For Clinic Admin - Temporary routing */}
            <Route path="admin/clinic" element={<ClinicAdminDashboard />} />
            <Route path="admin/clinic/patients" element={<PatientManagementPage />} />
            <Route path="admin/clinic/settings" element={<ClinicManagementPage />} />

            {/* For Vet Professionals - Temporary routing */}
            <Route path="/vet-appointments" element={<VetAppointmentPage />} />
            
            {/* For System Admin - Temporary routing */}
            <Route path="/admin/system/clinics" element={<ClinicsManagementPage />} />
            <Route path="/admin/system/users" element={<UserManagementPage />} />
        </Route>

        {/* Protected routes (requires auth) */}
            <Route element={<ProtectedRoute />}> 
                {/* Pet Owner */}
                <Route element={<PetOwnerRoute />}> 
                    <Route path="/clinic/:id" element={<ClinicViewPage />} />
                    <Route path="/dashboard" element={<PetOwnerDashboard />} />
                </Route>
                {/* Clinic Admin */}
                <Route element={<ClinicAdminRoute />}> 
                    {/* <Route path="/clinic-admin" element={<ClinicAdminDashboard />} /> */}
                </Route>
            </Route>

        {/* Unauthorized fallback */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/* Catch-all: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default AppRoutes;