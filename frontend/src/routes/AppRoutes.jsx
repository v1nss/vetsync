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

// Role-based route guards
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

const HomePageRoute = () => {
    const { isAuthenticated, user_type } = useAuth();
    
    // Allow unauthenticated users and pet owners
    if (!isAuthenticated || user_type === "pet_owner") {
        return <Outlet />;
    }
    
    // Redirect other authenticated users to their default pages
    switch (user_type) {
        case "clinic_admin":
            return <Navigate to="/clinic-admin/dashboard" replace />;
        case "vet_professional":
            return <Navigate to="/vet/appointments" replace />;
        case "system_admin":
            return <Navigate to="/system-admin/clinics" replace />;
        default:
            return <Navigate to="/unauthorized" replace />;
    }
};

const AppRoutes = () => (
    <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicRoute />}> 
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* PUBLIC PAGES (No Auth Required) */}
        <Route element={<HomePageRoute />} >
            <Route path="/" element={<HomePage />} />
            <Route path="/clinics/:slug" element={<ClinicViewPage />} />
        </Route>
        
        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}> 
            
            {/* Pet Owner Routes */}
            <Route path="/pet-owner" element={<PetOwnerRoute />}> 
                <Route index element={<Navigate to="home" replace />} />
                <Route path="home" element={<HomePage />} />
                <Route path="clinics/:slug/book" element={<BookAppointmentPage />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="health-records" element={<EHRPage />} />
                <Route path="pets" element={<ManagePetsPage />} />
                <Route path="pets/add" element={<AddPetPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Clinic Admin Routes */}
            <Route path="/clinic-admin" element={<ClinicAdminRoute />}> 
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ClinicAdminDashboard />} />
                <Route path="patients" element={<PatientManagementPage />} />
                <Route path="settings" element={<ClinicManagementPage />} />
                <Route path="register-clinic" element={<RegisterClinicPage />} />
                <Route path="register-vet" element={<RegisterVetProPage />} />
            </Route>

            {/* Vet Professional Routes */}
            <Route path="/vet" element={<VetProRoute />}> 
                <Route index element={<Navigate to="appointments" replace />} />
                <Route path="appointments" element={<VetAppointmentPage />} />
            </Route>

            {/* System Admin Routes */}
            <Route path="/system-admin" element={<SystemAdminRoute />}> 
                <Route index element={<Navigate to="clinics" replace />} />
                <Route path="clinics" element={<ClinicsManagementPage />} />
                <Route path="users" element={<UserManagementPage />} />
            </Route>
        </Route>

        {/* ERROR ROUTES */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default AppRoutes;