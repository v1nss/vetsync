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
import PendingClinicPage from "../pages/clinic-admin/PendingClinicPage";
import ClinicAdminLayout from "../pages/clinic-admin/ClinicAdminLayout";
import VetProManagementPage from "../pages/clinic-admin/VetProManagementPage";
import ClinicAdminEHRPage from "../pages/clinic-admin/ClinicAdminEHRPage";

// Public routes (no auth required)
const PublicRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

// Protected routes (auth required)
const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Role-based route guards
const PetOwnerRoute = () => {
    const { role, loading } = useAuth();
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    return role === "pet_owner" ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

const ClinicAdminRoute = () => {
    const { role, loading } = useAuth();
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    // // Checking if the clinic status is pending
    // if (role === "clinic_admin" && user?.clinic_status === "pending") {
    //     return <Navigate to="/clinic-admin/pending" replace />;
    // }
    
    return role === "clinic_admin" ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

const VetProRoute = () => {
    const { role, loading } = useAuth();
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    return role === "vet_professional" ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

const SystemAdminRoute = () => {
    const { role, loading } = useAuth();
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    return role === "system_admin" ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

const HomePageRoute = () => {
    const { isAuthenticated, role } = useAuth();
    
    // Allow unauthenticated users and pet owners
    if (!isAuthenticated || role === "pet_owner") {
        return <Outlet />;
    }
    
    // Redirect other authenticated users to their default pages
    switch (role) {
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
            <Route path="/register-clinic" element={<RegisterClinicPage />} />
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
                <Route element={<ClinicAdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<ClinicAdminDashboard />} />
                    <Route path="patients" exact element={<PatientManagementPage />} />
                    <Route path="ehr" exact element={<ClinicAdminEHRPage />} />
                    <Route path="vet-pros" element={<VetProManagementPage />} />
                    <Route path="settings" element={<ClinicManagementPage />} />
                    {/* <Route path="register-clinic" element={<RegisterClinicPage />} /> */}
                    <Route path="register-vet" element={<RegisterVetProPage />} />
                </Route>
                <Route path="pending" element={<PendingClinicPage />} />
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