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
import RegisterClinicPage from "../pages/clinic-admin/RegisterClinicPage";
import RegisterVetProPage from "../pages/clinic-admin/RegisterVetProPage";
import AddPetPage from "../pages/pet-owner/AddPetPage";
import UnauthorizedPage from "../pages/Unauthorized/UnauthorizedPage";

// Public routes (no auth required)
const PublicRoute = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

// Protected routes (auth required)
const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Role-based wrappers
const PetOwnerRoute = () => {
    const { user_type } = useAuth();
    return user_type === "pet_owner" ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

const ClinicAdminRoute = () => {
    const { user_type } = useAuth();
    return user_type === "clinic_admin" ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

const VetProRoute = () => {
    const { user_type } = useAuth();
    return user_type === "vet_professional" ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

const SystemAdminRoute = () => {
    const { user_type } = useAuth();
    return user_type === "system_admin" ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

const AppRoutes = () => (
    <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}> 
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Always accessible (no auth needed) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/:slug" element={<ClinicViewPage />} />
        <Route path="/:slug/book" element={<BookAppointmentPage />} />
        
        {/* Protected routes (requires auth) */}
        <Route element={<ProtectedRoute />}> 
            
            {/* Pet Owner Routes */}
            <Route element={<PetOwnerRoute />}> 
                <Route path="/health-records" element={<EHRPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/pets" element={<ManagePetsPage />} />
                <Route path="/pets/add" element={<AddPetPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Clinic Admin Routes */}
            <Route element={<ClinicAdminRoute />}> 
                <Route path="/register/clinic" element={<RegisterClinicPage />} />
                <Route path="/register/vet-pro" element={<RegisterVetProPage />} />
                <Route path="/admin/clinic" element={<ClinicAdminDashboard />} />
                <Route path="/admin/clinic/patients" element={<PatientManagementPage />} />
                <Route path="/admin/clinic/settings" element={<ClinicManagementPage />} />
            </Route>

            {/* Vet Professional Routes */}
            <Route element={<VetProRoute />}> 
                <Route path="/vet-appointments" element={<VetAppointmentPage />} />
            </Route>

            {/* System Admin Routes */}
            <Route element={<SystemAdminRoute />}> 
                <Route path="/admin/system/clinics" element={<ClinicsManagementPage />} />
                <Route path="/admin/system/users" element={<UserManagementPage />} />
            </Route>
        </Route>

        {/* Unauthorized fallback */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Catch-all: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default AppRoutes;