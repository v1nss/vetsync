
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedLayout from "../layouts/ProtectedLayout";

import { useAuth } from "../context/AuthContext";

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
const VetProRoute = () => {
    const { role } = useAuth();
    return role === "vet_pro" ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};
const SuperAdminRoute = () => {
    const { role } = useAuth();
    return role === "super_admin" ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

// Placeholder dashboard pages for each role
const PetOwnerDashboard = () => <div>Pet Owner Dashboard</div>;
const ClinicAdminDashboard = () => <div>Clinic Admin Dashboard</div>;
const VetProDashboard = () => <div>Vet Professional Dashboard</div>;
const SuperAdminDashboard = () => <div>Super Admin Dashboard</div>;
const Unauthorized = () => <div>Unauthorized</div>;


const AppRoutes = () => (
    <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}> 
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes (requires auth) */}
            <Route element={<ProtectedRoute />}> 
                <Route element={<ProtectedLayout />}> 
                    {/* Pet Owner */}
                    <Route element={<PetOwnerRoute />}> 
                        <Route path="/dashboard" element={<PetOwnerDashboard />} />
                    </Route>
                    {/* Clinic Admin */}
                    <Route element={<ClinicAdminRoute />}> 
                        <Route path="/clinic-admin" element={<ClinicAdminDashboard />} />
                    </Route>
                    {/* Vet Professional */}
                    <Route element={<VetProRoute />}> 
                        <Route path="/vet-pro" element={<VetProDashboard />} />
                    </Route>
                    {/* Super Admin */}
                    <Route element={<SuperAdminRoute />}> 
                        <Route path="/super-admin" element={<SuperAdminDashboard />} />
                    </Route>
                </Route>
            </Route>

        {/* Unauthorized fallback */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/* Catch-all: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default AppRoutes;