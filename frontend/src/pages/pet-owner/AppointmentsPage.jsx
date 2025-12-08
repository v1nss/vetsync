import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { getAppointmentsByOwner } from '../../global/api/appointment.jsx';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaPhone } from "react-icons/fa";
import ViewDetailsModal from "../../components/appointments/ViewDetailsModal";
import RescheduleModal from "../../components/appointments/RescheduleModal";
import RebookModal from "../../components/appointments/RebookModal";
import NotificationModal from "../../components/NotificationModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import { deleteAppointment } from "../../global/api/appointment.jsx";

export default function AppointmentPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [confirmation, setConfirmation] = useState({ isOpen: false, appointmentId: null });
  const [viewDetailsModal, setViewDetailsModal] = useState({ isOpen: false, appointment: null });
  const [rescheduleModal, setRescheduleModal] = useState({ isOpen: false, appointment: null });
  const [rebookModal, setRebookModal] = useState({ isOpen: false, appointment: null });
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const appointments = await getAppointmentsByOwner();
      // console.log("APPOINTMENTS DATA:", appointments);
      
      // Ensure we always set an array
      if (Array.isArray(appointments)) {
        setAppointmentsData(appointments);
      } else if (appointments?.data && Array.isArray(appointments.data)) {
        setAppointmentsData(appointments.data);
      } else if (appointments?.appointments && Array.isArray(appointments.appointments)) {
        setAppointmentsData(appointments.appointments);
      } else {
        setAppointmentsData([]);
        console.warn("API returned non-array data:", appointments);
      }
    } catch (err) {
      setError("Failed to load appointments. Please try again later.");
      console.error("Error fetching appointments:", err);
      setAppointmentsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments based on date and status
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointmentsData.filter(apt => {
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    const status = apt.status?.toLowerCase();
    return aptDate >= today && status !== "completed" && status !== "canceled";
  });

  const pastAppointments = appointmentsData.filter(apt => {
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    const status = apt.status?.toLowerCase();
    return aptDate < today || status === "completed" || status === "canceled";
  });

  const appointments = activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

  const handleViewDetails = (appointment) => {
    setViewDetailsModal({ isOpen: true, appointment });
  };

  const handleRescheduleClick = (appointment) => {
    setRescheduleModal({ isOpen: true, appointment });
  };

  const handleReschedule = (date, time) => {
    setRescheduleModal({ isOpen: false, appointment: null });
    setNotification({
      isOpen: true,
      type: 'success',
      title: 'Appointment Rescheduled!',
      message: `Your appointment has been rescheduled to ${date} at ${time}.`
    });
  };

  const handleRebook = (appointmentId) => {
    setRebookModal({ isOpen: false, appointment: null });
    setNotification({
      isOpen: true,
      type: 'success',
      title: 'Appointment Rebooked!',
      message: `Your appointment has been successfully rebooked.`
    });
  }

  const handleCancel = (appointment) => {
    setConfirmation({
      isOpen: true,
      title: 'Appointment Cancellation',
      message: `Are you sure you want to cancel the appointment for ${appointment.pet.name} on ${appointment.date}?`,
      type: 'warning',
      action: 'cancel',
      appointmentId: appointment.appointment_id
    });
  };

  const handleConfirmCancel = async (appointmentId) => {
    try {
      const res = await deleteAppointment(appointmentId);
      console.log("Appointment deleted successfully:", res.data);
      setConfirmation({ isOpen: false, appointmentId: null });
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Appointment Canceled',
        message: 'Your appointment has been successfully canceled.'
      });
      fetchAppointments();
    } catch (err) {
      console.error("Error deleting appointment:", err.message);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Cancellation Failed',
        message: 'There was an error canceling your appointment. Please try again later.'
      });
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "canceled":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    // If time is already formatted (e.g., "10:00 AM"), return as is
    if (timeString && (timeString.includes('AM') || timeString.includes('PM'))) {
      return timeString;
    }
    
    // Otherwise, parse and format
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    }
    
    return "Time not set";
  };

  const formatAddress = (address) => {
  if (!address) return "Address not available";

  const {
    street,
    barangay,
    city,
    province,
    zipcode,
    landmark
  } = address;

  // Build parts and remove null/undefined/empty values
  const parts = [
    street,
    barangay,
    city,
    province,
    zipcode ? ` ${zipcode}` : null
  ].filter(Boolean);

  return parts.join(", ");
};

  // Helper function to safely get nested data
  const getPetName = (appointment) => {
    return appointment.pet?.name || "Pet";
  };

  const getPetType = (appointment) => {
    return appointment.pet?.species || "Unknown";
  };

  const getClinicName = (appointment) => {
    return appointment.clinic?.name || "Veterinary Clinic";
  };

  const getClinicAddress = (appointment) => {
    return formatAddress(appointment?.clinic?.address);
  };

  const getClinicPhone = (appointment) => {
    return appointment.clinic?.contact_number || "N/A";
  };

  const getVeterinarianName = (appointment) => {
    // Handle vet from VetProfessional model
    const vet = appointment.vet;
    if (vet) {
      const firstName = vet.User?.first_name || '';
      const lastName = vet.User?.last_name || '';
      return `Dr. ${firstName} ${lastName}`.trim();
    }
    return appointment.vet_name || appointment.veterinarian || "Veterinarian";
  };

  const getAppointmentType = (appointment) => {
    return appointment.type || appointment.appointment_type || appointment.notes || "General Checkup";
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto pb-8 pt-4 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-2 text-gray-600">View and manage your pet appointments</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "upcoming"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Upcoming Appointments ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "past"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Past Appointments ({pastAppointments.length})
            </button>
          </nav>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">Loading appointments...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Appointments List */}
        {!loading && !error && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === "upcoming"
                    ? "You don't have any upcoming appointments."
                    : "You don't have any past appointments."}
                </p>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.appointment_id}
                  className="bg-white border border-gray-200 rounded-2xl hover:border-primary transition-shadow p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {getPetName(appointment)}
                            <span className="text-gray-500 font-normal text-base ml-2">
                              ({getPetType(appointment)})
                            </span>
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {getAppointmentType(appointment)}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center text-gray-700">
                          <FaCalendarAlt className="h-5 w-5 mr-2 text-primary" />
                          <span className="text-sm">{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FaClock className="h-5 w-5 mr-2 text-primary" />
                          <span className="text-sm">{formatTime(appointment.time)}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FaUser className="h-5 w-5 mr-2 text-primary" />
                          <span className="text-sm">
                            {getVeterinarianName(appointment)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FaPhone className="h-5 w-5 mr-2 text-primary" />
                          <span className="text-sm">
                            {getClinicPhone(appointment)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start text-gray-700 mt-3">
                        <FaMapMarkerAlt className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            {getClinicName(appointment)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {getClinicAddress(appointment)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    {activeTab === "upcoming" && (
                      <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                        <button 
                        onClick={() => handleViewDetails(appointment)}
                        className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors text-sm font-medium"
                      >
                          View Details
                        </button>
                        {/* <button 
                        onClick={() => handleRescheduleClick(appointment)}
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                          Reschedule
                        </button> */}
                        <button 
                          onClick={() => handleCancel(appointment)}
                          className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {activeTab === "past" && (
                      <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                        <button 
                        onClick={() => handleViewDetails(appointment)}
                        className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors text-sm font-medium"
                      >
                          View Details
                        </button>
                        {/* <button 
                        onClick={() => setRebookModal({ isOpen: true, appointment })}
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                          Book Again
                        </button> */}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewDetailsModal
        isOpen={viewDetailsModal.isOpen}
        onClose={() => setViewDetailsModal({ isOpen: false, appointment: null })}
        appointment={viewDetailsModal.appointment}
      />

      <RescheduleModal
        isOpen={rescheduleModal.isOpen}
        onClose={() => setRescheduleModal({ isOpen: false, appointment: null })}
        appointment={rescheduleModal.appointment}
        onReschedule={handleReschedule}
      />

      <RebookModal
        isOpen={rebookModal.isOpen}
        onClose={() => setRebookModal({ isOpen: false, appointment: null })}
        appointment={rebookModal.appointment}
        onRebook={handleRebook}
      />

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation({ ...confirmation, isOpen: false })}
        onConfirm={() => {handleConfirmCancel(confirmation.appointmentId)}}
        type={confirmation.type}
        title={confirmation.title}
        message={confirmation.message}
        confirmText="Yes, Cancel"
        cancelText="No, Keep"
      />
    </main>
  );
}