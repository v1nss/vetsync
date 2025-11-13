import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { FaPaw, FaNotesMedical, FaBell, FaClinicMedical, FaUserMd, FaCog } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { BiSolidDashboard } from "react-icons/bi";

export default function ClinicAdminLayout() {
  const [isOpen, setIsOpen] = useState(true);

  const clinicAdminLinks = [
    { name: "Dashboard", icon: <BiSolidDashboard />, path: "/clinic-admin/dashboard" },
    { name: "Patient Management", icon: <FaPaw />, path: "/clinic-admin/patients" },
    { name: "Electronic Health Records", icon: <FaNotesMedical />, path: "/clinic-admin/ehr" },
    // { name: "Communication", icon: <FaBell />, path: "/clinic-admin/communication" },
    { name: "Clinic Management", icon: <FaClinicMedical />, path: "/clinic-admin/settings" },
    { name: "Vet Professionals", icon: <FaUserMd />, path: "/clinic-admin/vet-pros" },
    // { name: "Settings", icon: <FaCog />, path: "/clinic-admin/profile-settings" },
  ];

  const handleLogout = () => {
    alert("Logging out...");
  };

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
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none md:hidden"
          >
            <IoMenu className="text-2xl"/>
          </button>
          <h1 className="md:ml-64 text-xl font-semibold text-gray-800">Clinic Admin Portal</h1>
        </div>

        {/* Page Content */}
        <main className="md:ml-64 flex-1 p-base pb-16 sm:pb-base overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
