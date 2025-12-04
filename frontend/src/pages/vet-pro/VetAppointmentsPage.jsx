import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaCalendarCheck, FaClock, FaCheckCircle, FaClipboardList, FaBars } from "react-icons/fa";
import ConfirmationModal from "../../components/ConfirmationModal";
import NotificationModal from "../../components/NotificationModal";
import CalendarModal from "../../components/appointments/CalendarModal";
import AppointmentDetailsModal from "../../components/appointments/AppointmentDetailsModal";
import VetAppointmentCard from "../../components/appointments/VetAppointmentCard";
import AppointmentsFilters from "../../components/appointments/AppointmentsFilters";
import { useVetAppointments } from "../../hooks/useVetAppointments";
import Navbar from "../../components/Navbar";

export default function VetAppointmentsPage() {
  const { logout, user } = useAuth();
  const { appointments, stats, markAppointmentComplete } = useVetAppointments();
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    appointmentId: null
  });

  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  const filterAppointments = () => {
    let filtered = appointments;

    if (statusFilter !== "all") {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.pet_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleMarkComplete = (appointment) => {
    setConfirmation({
      isOpen: true,
      appointmentId: appointment.id,
      petName: appointment.pet_name
    });
  };

  const confirmMarkComplete = () => {
    markAppointmentComplete(confirmation.appointmentId);
    
    setNotification({
      isOpen: true,
      type: 'success',
      title: 'Appointment Completed! ✅',
      message: `Appointment for ${confirmation.petName} has been marked as completed.`
    });
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const statsCards = [
    { label: "Total Appointments", value: stats.total, icon: FaClipboardList, bgColor: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Today's Appointments", value: stats.today, icon: FaCalendarCheck, bgColor: "bg-orange-100", iconColor: "text-orange-600" },
    { label: "Upcoming", value: stats.upcoming, icon: FaClock, bgColor: "bg-yellow-100", iconColor: "text-yellow-600" },
    { label: "Completed", value: stats.completed, icon: FaCheckCircle, bgColor: "bg-green-100", iconColor: "text-green-600" }
  ];

  return (
    <main className="min-h-screen pb-20 sm:pb-10 bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-base text-gray-600 mt-1">View and manage your assigned appointments</p>
          </div>
          <button
            onClick={() => setShowCalendar(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition text-sm sm:text-base font-medium"
          >
            <FaCalendarAlt className="text-sm sm:text-base" />
            <span>View Calendar</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center`}>
                    <Icon className={`text-xl sm:text-2xl ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <AppointmentsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Appointments List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
              <FaCalendarAlt className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-sm sm:text-base text-gray-600">
                {statusFilter !== "all" 
                  ? "Try adjusting your filters or search terms" 
                  : "You don't have any appointments assigned yet"}
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <VetAppointmentCard
                key={appointment.id}
                appointment={appointment}
                onMarkComplete={handleMarkComplete}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>
      </div>

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        appointments={appointments}
      />

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        appointment={selectedAppointment}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation({ ...confirmation, isOpen: false })}
        onConfirm={confirmMarkComplete}
        type="info"
        title="Mark as Complete?"
        message={`Are you sure you want to mark this appointment for ${confirmation.petName} as completed?`}
        confirmText="Mark Complete"
        cancelText="Cancel"
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </main>
  );
}