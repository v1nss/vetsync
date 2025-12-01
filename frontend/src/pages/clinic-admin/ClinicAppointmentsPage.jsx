import { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import ConfirmationModal from "../../components/ConfirmationModal";
import NotificationModal from "../../components/NotificationModal";
import CalendarModal from "../../components/appointments/CalendarModal";
import AssignVetModal from "../../components/appointments/AssignVetModal";
import AppointmentCard from "../../components/appointments/AppointmentCard";
import AppointmentsFilters from "../../components/appointments/AppointmentsFilters";
import { useAppointments } from "../../hooks/useAppointments";

const STATUS_MESSAGES = {
  approved: {
    title: 'Approve Appointment?',
    message: (apt) => `Approve appointment for ${apt.pet_name} with ${apt.owner_name}?`,
    type: 'info'
  },
  rejected: {
    title: 'Reject Appointment?',
    message: () => 'Are you sure you want to reject this appointment? The pet owner will be notified.',
    type: 'danger'
  },
  cancelled: {
    title: 'Cancel Appointment?',
    message: (apt) => `Cancel appointment for ${apt.pet_name}? This action cannot be undone.`,
    type: 'warning'
  }
};

export default function ClinicAppointmentsPage() {
  const { appointments, vets, updateAppointmentStatus, assignVetToAppointment } = useAppointments();
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAssignVetModal, setShowAssignVetModal] = useState(false);
  
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    type: 'danger',
    title: '',
    message: '',
    action: null,
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

  const handleStatusChange = (appointmentId, newStatus, appointmentDetails) => {
    const config = STATUS_MESSAGES[newStatus];
    setConfirmation({
      isOpen: true,
      title: config.title,
      message: config.message(appointmentDetails),
      type: config.type,
      action: newStatus,
      appointmentId
    });
  };

  const confirmStatusChange = () => {
    const { action, appointmentId } = confirmation;
    updateAppointmentStatus(appointmentId, action);
    
    const appointment = appointments.find(apt => apt.id === appointmentId);
    setNotification({
      isOpen: true,
      type: 'success',
      title: 'Success!',
      message: `Appointment for ${appointment.pet_name} has been ${action}.`
    });
  };

  const openAssignVetModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAssignVetModal(true);
  };

  const handleAssignVet = (selectedVet) => {
    if (!selectedVet) {
      setNotification({
        isOpen: true,
        type: 'warning',
        title: 'No Vet Selected',
        message: 'Please select a veterinarian to assign.'
      });
      return;
    }

    assignVetToAppointment(selectedAppointment.id, selectedVet);
    setShowAssignVetModal(false);
    
    setNotification({
      isOpen: true,
      type: 'success',
      title: 'Vet Assigned!',
      message: `${selectedVet} has been assigned to ${selectedAppointment.pet_name}'s appointment.`
    });
  };

  return (
    <main className="min-h-screen pb-10 bg-gray-50">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">Manage clinic appointments and schedules</p>
          </div>
          <button
            onClick={() => setShowCalendar(true)}
            className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition"
          >
            <FaCalendarAlt /> View Calendar
          </button>
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
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onStatusChange={handleStatusChange}
                onAssignVet={openAssignVetModal}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <CalendarModal
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        appointments={appointments}
      />

      <AssignVetModal
        isOpen={showAssignVetModal}
        onClose={() => setShowAssignVetModal(false)}
        appointment={selectedAppointment}
        vets={vets}
        onAssign={handleAssignVet}
      />

      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation({ ...confirmation, isOpen: false })}
        onConfirm={confirmStatusChange}
        type={confirmation.type}
        title={confirmation.title}
        message={confirmation.message}
        confirmText="Confirm"
        cancelText="Cancel"
      />

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