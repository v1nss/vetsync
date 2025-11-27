import { useState, useEffect } from "react";
import { FaCalendarAlt, FaCalendarCheck, FaClock, FaCheckCircle, FaClipboardList } from "react-icons/fa";
import ConfirmationModal from "../../components/ConfirmationModal";
import NotificationModal from "../../components/NotificationModal";
import CalendarModal from "../../components/appointments/CalendarModal";
import AppointmentDetailsModal from "../../components/appointments/AppointmentDetailsModal";
import VetAppointmentCard from "../../components/appointments/VetAppointmentCard";
import AppointmentsFilters from "../../components/appointments/AppointmentsFilters";
import { useVetAppointments } from "../../hooks/useVetAppointments";

export default function VetAppointmentsPage() {
  const { appointments, stats, markAppointmentComplete } = useVetAppointments();
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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

  return (
    <main className="min-h-screen pb-10 bg-gray-50">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600 mt-1">View and manage your assigned appointments</p>
          </div>
          <button
            onClick={() => setShowCalendar(true)}
            className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition"
          >
            <FaCalendarAlt /> View Calendar
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaClipboardList className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.today}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaCalendarCheck className="text-2xl text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FaClock className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <AppointmentsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">
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