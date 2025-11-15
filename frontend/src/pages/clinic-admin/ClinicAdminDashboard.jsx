import React, { useEffect, useState } from "react";
import { FaUsers, FaCalendarAlt, FaUserMd, FaBell, FaNotesMedical } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ClinicAdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalVets: 0,
  });

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);

  useEffect(() => {
    // Mock data (replace with API integration)
    setStats({
      totalPatients: 120,
      totalAppointments: 35,
      totalVets: 5,
    });

    setUpcomingAppointments([
      { id: 1, petName: "Buddy", date: "2025-11-15", vet: "Dr. Ana Reyes" },
      { id: 2, petName: "Milo", date: "2025-11-16", vet: "Dr. Roberto Garcia" },
    ]);

    setRecentRecords([
      { id: 1, petName: "Bella", updatedBy: "Dr. Maria Santos", date: "2025-11-12" },
      { id: 2, petName: "Charlie", updatedBy: "Dr. Ana Reyes", date: "2025-11-11" },
    ]);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clinic Dashboard</h1>
          <p className="text-gray-600 text-sm">
            Search and view through patient records and owner information
          </p>
        </div>
        <Link
          to="/clinic-admin/patients"
          className="mt-3 sm:mt-0 px-5 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium transition"
        >
          Manage Patients
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 flex items-center justify-between border border-gray-200">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Patients</p>
            <h2 className="text-3xl font-semibold">{stats.totalPatients}</h2>
          </div>
          <FaUsers className="text-primary text-4xl" />
        </div>

        <div className="bg-white rounded-xl p-5 flex items-center justify-between border border-gray-200">
          <div>
            <p className="text-sm text-gray-600 mb-1">Appointments</p>
            <h2 className="text-3xl font-semibold">{stats.totalAppointments}</h2>
          </div>
          <FaCalendarAlt className="text-green-500 text-4xl" />
        </div>

        <div className="bg-white rounded-xl p-5 flex items-center justify-between border border-gray-200">
          <div>
            <p className="text-sm text-gray-600 mb-1">Vet Professionals</p>
            <h2 className="text-3xl font-semibold">{stats.totalVets}</h2>
          </div>
          <FaUserMd className="text-purple-600 text-4xl" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-green-500" /> Upcoming Appointments
          </h3>

          {upcomingAppointments.length > 0 ? (
            <ul className="space-y-3">
              {upcomingAppointments.map((appt) => (
                <li key={appt.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <div>
                    <p className="font-medium">{appt.petName}</p>
                    <p className="text-sm text-gray-500">with {appt.vet}</p>
                  </div>
                  <span className="text-sm text-gray-600">{appt.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No upcoming appointments.</p>
          )}

          <div className="mt-4 text-right">
            <Link
              to="/clinic-admin/settings"
              className="text-primary text-sm font-medium hover:underline"
            >
              View all appointments →
            </Link>
          </div>
        </div>

        {/* Recent EHR Updates */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaNotesMedical className="text-red-500" /> Recent EHR Updates
          </h3>

          {recentRecords.length > 0 ? (
            <ul className="space-y-3">
              {recentRecords.map((record) => (
                <li key={record.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <div>
                    <p className="font-medium">{record.petName}</p>
                    <p className="text-sm text-gray-500">Updated by {record.updatedBy}</p>
                  </div>
                  <span className="text-sm text-gray-600">{record.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No recent records.</p>
          )}

          <div className="mt-4 text-right">
            <Link
              to="/clinic-admin/ehr"
              className="text-primary text-sm font-medium hover:underline"
            >
              View all records →
            </Link>
          </div>
        </div>
      </div>

      {/* Communication / Reminder Section */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
            <FaBell className="text-yellow-500" /> Reminders & Notifications
          </h3>
          <p className="text-sm text-gray-600">
            Send appointment reminders or clinic announcements via email.
          </p>
        </div>

        <Link
          to="/clinic-admin/communication"
          className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition"
        >
          Set Reminder
        </Link>
      </div>
    </div>
  );
}
