import React, { useEffect, useState } from "react";
import { FaUsers, FaCalendarAlt, FaUserMd, FaBell, FaNotesMedical, FaArrowUp, FaPaw, FaClock } from "react-icons/fa";
import { Link } from "react-router";

export default function ClinicAdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalVets: 0,
    activePatients: 0,
  });

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [todayStats, setTodayStats] = useState({ appointments: 0, checkIns: 0 });

  useEffect(() => {
    // Mock data (replace with API integration)
    setStats({
      totalPatients: 120,
      totalAppointments: 35,
      totalVets: 5,
      activePatients: 89,
    });

    setTodayStats({
      appointments: 8,
      checkIns: 5,
    });

    setUpcomingAppointments([
      { id: 1, petName: "Buddy", owner: "Maria Santos", time: "10:00 AM", date: "2025-11-15", vet: "Dr. Ana Reyes", type: "Checkup", status: "confirmed" },
      { id: 2, petName: "Milo", owner: "John Cruz", time: "11:30 AM", date: "2025-11-15", vet: "Dr. Roberto Garcia", type: "Vaccination", status: "pending" },
      { id: 3, petName: "Luna", owner: "Sarah Lee", time: "2:00 PM", date: "2025-11-15", vet: "Dr. Ana Reyes", type: "Surgery", status: "confirmed" },
      { id: 4, petName: "Max", owner: "Carlos Diaz", time: "3:30 PM", date: "2025-11-16", vet: "Dr. Maria Santos", type: "Follow-up", status: "confirmed" },
    ]);

    setRecentRecords([
      { id: 1, petName: "Bella", owner: "Emma Wilson", updatedBy: "Dr. Maria Santos", date: "2025-11-12", time: "2:30 PM", type: "Lab Results" },
      { id: 2, petName: "Charlie", owner: "Mike Johnson", updatedBy: "Dr. Ana Reyes", date: "2025-11-12", time: "1:15 PM", type: "Prescription" },
      { id: 3, petName: "Daisy", owner: "Lisa Brown", updatedBy: "Dr. Roberto Garcia", date: "2025-11-11", time: "4:45 PM", type: "Diagnosis" },
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back! Here's what's happening today
            </p>
          </div>
          <div className="flex gap-3 mt-3 sm:mt-0">
            <button
              onClick={() => handleNavigation('/clinic-admin/appointments/new')}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition flex items-center gap-2"
            >
              <FaCalendarAlt className="text-sm" />
              New Appointments
            </button>
          </div>
        </div>
      </div>

      <div>
        {/* Today's Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-linear-to-br from-primary to-primary/80 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-50 text-sm font-medium">Today's Appointments</p>
                <h2 className="text-4xl font-bold mt-1">{todayStats.appointments}</h2>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <FaCalendarAlt className="text-3xl" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-white/20 px-2 py-1 rounded">{todayStats.checkIns} checked in</span>
              <span className="text-gray-50">• {todayStats.appointments - todayStats.checkIns} pending</span>
            </div>
          </div>

          <div className="bg-linear-to-br from-primary to-primary/80 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-50 text-sm font-medium">Active Patients</p>
                <h2 className="text-4xl font-bold mt-1">{stats.activePatients}</h2>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <FaPaw className="text-3xl" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <FaArrowUp className="text-xs" />
              <span className="font-semibold">12%</span>
              <span className="text-gray-50">from last month</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-600 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
              <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                <FaArrowUp className="text-xs" /> 8%
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Patients</p>
            <h2 className="text-3xl font-bold text-gray-900">{stats.totalPatients}</h2>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-600 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <FaCalendarAlt className="text-green-600 text-2xl" />
              </div>
              <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                <FaArrowUp className="text-xs" /> 15%
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <h2 className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</h2>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-600 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-50 p-3 rounded-lg">
                <FaUserMd className="text-purple-600 text-2xl" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Vet Professionals</p>
            <h2 className="text-3xl font-bold text-gray-900">{stats.totalVets}</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Upcoming Appointments - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" /> Upcoming Appointments
                </h3>
                <Link
                  to="/clinic-admin/appointments"
                  className="flex gap-2 items-center text-coral-500 text-sm font-medium hover:text-primary transition"
                >
                  <span className="hidden sm:flex">View all</span>→
                </Link>
              </div>
            </div>

            <div className="p-6">
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments.map((appt) => (
                    <div key={appt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-primary/10 hover:border-primary transition-colors border border-gray-200 cursor-pointer">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-center min-w-[70px]">
                          <p className="text-xs text-gray-500 font-medium">
                            {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-sm font-bold text-gray-900">{appt.time}</p>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">{appt.petName}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${getStatusColor(appt.status)}`}>
                              {appt.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Owner: {appt.owner}</p>
                          <p className="text-xs text-gray-500 mt-1">{appt.vet} • {appt.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaCalendarAlt className="text-gray-300 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming appointments</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent EHR Updates */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">              
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaNotesMedical className="text-primary" /> Recent Updates
                </h3>                            
                <Link
                  to="/clinic-admin/ehr"
                  className="flex gap-2 items-center text-coral-500 text-sm font-medium hover:text-primary transition"
                >
                  <span className="hidden sm:flex">View all</span>→
                </Link>
              </div>
            </div>

            <div className="p-6">
              {recentRecords.length > 0 ? (
                <div className="space-y-4">
                  {recentRecords.map((record) => (
                    <div key={record.id} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg mt-1">
                          <FaNotesMedical className="text-primary text-sm" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{record.petName}</p>
                          <p className="text-xs text-gray-500 mb-1">{record.owner}</p>
                          <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                            {record.type}
                          </span>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <FaClock className="text-xs" />
                            <span>{record.date} • {record.time}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">by {record.updatedBy}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaNotesMedical className="text-gray-300 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No recent records</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}