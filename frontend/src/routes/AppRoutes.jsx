
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { useAuth } from "../context/AuthContext";
import ClinicViewPage from "../pages/ClinicViewPage";

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
const ClinicAdminDashboard = () => <div>Clinic Admin Dashboard</div>;
const Unauthorized = () => <div>Unauthorized</div>;


const AppRoutes = () => (
    <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}> 
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/clinic/:id" element={<ClinicViewPage />} />
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
                    <Route path="/clinic-admin" element={<ClinicAdminDashboard />} />
                </Route>
            </Route>

        {/* Unauthorized fallback */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/* Catch-all: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default AppRoutes;