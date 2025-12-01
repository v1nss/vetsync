import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { FaPaw, FaNotesMedical, FaClinicMedical, FaUserMd, FaCalendarAlt, FaCalendar } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { BiSolidDashboard } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";
import { fetchMyClinic } from "../../global/api/clinicAdmin";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function ClinicAdminLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  
  // Logout confirmation modal state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const clinicAdminLinks = [
    { name: "Dashboard", icon: <BiSolidDashboard />, path: "/clinic-admin/dashboard" },
    { name: "Health Records", icon: <FaNotesMedical />, path: "/clinic-admin/ehr" },
    { name: "Patient Management", icon: <FaPaw />, path: "/clinic-admin/patients" },
    { name: "Clinic Management", icon: <FaClinicMedical />, path: "/clinic-admin/settings" },
    { name: "Appointments", icon: <FaCalendarAlt />, path: "/clinic-admin/appointments" },
    { name: "Vet Professionals", icon: <FaUserMd />, path: "/clinic-admin/vet-pros" },
    // { name: "Settings", icon: <FaCog />, path: "/clinic-admin/profile-settings" },
  ];

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Call logout from AuthContext
    logout();
    // Navigate to login page
    navigate("/login");
  };

  useEffect(() => {
    fetchMyClinic()
      .catch(err => console.error("Failed to fetch clinic data:", err));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="VetSync"
        links={clinicAdminLinks}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="sticky top-0 bg-white shadow-sm p-4 flex items-center justify-between z-25">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none md:hidden"
          >
            <IoMenu className="text-2xl"/>
          </button>
          <h1 className="md:ml-64 text-xl font-semibold text-gray-800">Clinic Admin Portal</h1>
        </div>

        {/* Page Content */}
        <main className="md:pl-68 flex-1 p-base pb-16 sm:pb-base overflow-y-auto max-w-screen lg:w-full">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        type="danger"
        title="Logout Confirmation"
        message="Are you sure you want to logout? Any unsaved changes will be lost."
        confirmText="Logout"
        cancelText="Stay"
      />
    </div>
  );
}