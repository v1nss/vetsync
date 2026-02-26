import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaCalendarAlt, FaCalendarCheck, FaClock, FaCheckCircle, FaClipboardList } from "react-icons/fa";
import NotificationModal from "../../components/NotificationModal";
import CalendarModal from "../../components/appointments/CalendarModal";
import AppointmentDetailsModal from "../../components/appointments/AppointmentDetailsModal";
import AppointmentsFilters from "../../components/appointments/AppointmentsFilters";
import AddHealthRecordModal from "../../components/EHR/AddHealthRecordModal";
import { useVetAppointments } from "../../hooks/useVetAppointments";
import { updateAppointmentStatus } from "../../global/api/appointment";
import { createEHR } from "../../global/api/ehr";
import Navbar from "../../components/Navbar";
import VetAppointmentTable from "../../components/appointments/VetAppointmentTable";

export default function VetAppointmentsPage() {
  const { user } = useAuth();
  const { appointments, stats, refetchAppointments } = useVetAppointments();
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showHealthRecordModal, setShowHealthRecordModal] = useState(false);

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
    let filtered = appointments || [];

    if (statusFilter !== "all") {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(apt =>
        (apt.pet_name && apt.pet_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (apt.owner_name && apt.owner_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (apt.service && apt.service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleMarkComplete = (appointment) => {
    setSelectedAppointment(appointment);
    setShowHealthRecordModal(true);
  };

  const handleHealthRecordSave = async (healthRecord) => {
    try {
      // Prepare EHR data
      const ehrData = {
        pet_owner_id: selectedAppointment.owner_id,
        pet_id: selectedAppointment.pet_id,
        clinic_id: selectedAppointment.clinic_id,
        appointment_id: selectedAppointment.id,
        service: healthRecord.reason,
        visit_date: healthRecord.appointmentDate,
        prescriptions: healthRecord.documents?.prescriptions?.map(p => ({
          name: p.name,
          description: p.description
        })) || [],
        vaccinations: healthRecord.documents?.vaccineRecords?.map(v => ({
          name: v.name,
          description: v.description,
          duration: v.duration ? `${v.duration} ${v.durationUnit || 'months'}` : null
        })) || [],
        dewormings: healthRecord.documents?.deworming?.map(d => ({
          name: d.name,
          description: d.description
        })) || [],
        labResults: healthRecord.documents?.labResults?.map(l => ({
          name: l.name,
          description: l.description
        })) || [],
      };

      // Prepare files for upload
      const files = [];
      if (healthRecord.attachedFile) {
        // Check if it's a File object directly
        if (healthRecord.attachedFile instanceof File) {
          files.push(healthRecord.attachedFile);
        } 
        // Check if it has a file property
        else if (healthRecord.attachedFile.file && healthRecord.attachedFile.file instanceof File) {
          files.push(healthRecord.attachedFile.file);
        } else {
          console.warn('Attached file is not a File object, skipping file upload');
        }
      }

      // Create EHR record
      await createEHR(ehrData, files);
      
      // Update appointment status to completed
      await updateAppointmentStatus(selectedAppointment.id, 'completed');
      
      // Refresh appointments list
      await refetchAppointments();
      
      // Close modal
      setShowHealthRecordModal(false);
      
      // Show success notification
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Appointment Completed!',
        message: `Health record saved and appointment for ${selectedAppointment.pet_name} has been completed.`
      });
    } catch (err) {
      console.error("Error completing appointment:", err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err.response?.data?.error || err.message || 'Failed to complete appointment. Please try again.'
      });
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const statsCards = [
    { label: "Total", value: stats.total, icon: FaClipboardList, bgColor: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Today's", value: stats.today, icon: FaCalendarCheck, bgColor: "bg-orange-100", iconColor: "text-orange-600" },
    { label: "Upcoming", value: stats.upcoming, icon: FaClock, bgColor: "bg-yellow-100", iconColor: "text-yellow-600" },
    { label: "Completed", value: stats.completed, icon: FaCheckCircle, bgColor: "bg-green-100", iconColor: "text-green-600" }
  ];

  return (
    <main className="min-h-screen pb-26 sm:pb-10 bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`text-2xl ${stat.iconColor}`} />
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
            <VetAppointmentTable
              appointments={filteredAppointments}
              onMarkComplete={handleMarkComplete}
              onViewDetails={handleViewDetails}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CalendarModal
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        appointments={appointments}
      />

      <AppointmentDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        appointment={selectedAppointment}
      />

      {showHealthRecordModal && selectedAppointment && (
        <AddHealthRecordModal
          patient={{
            id: selectedAppointment.pet_id,
            name: selectedAppointment.pet_name,
            species: selectedAppointment.pet_type,
            breed: selectedAppointment.pet_breed || selectedAppointment.pet_type
          }}
          appointment={{
            id: selectedAppointment.id,
            date: selectedAppointment.date,
            assigned_vet: user?.first_name || selectedAppointment.assigned_vet,
            vet_id: user?.id || selectedAppointment.vet_id,
            service: selectedAppointment.service
          }}
          onClose={() => setShowHealthRecordModal(false)}
          onSave={handleHealthRecordSave}
        />
      )}

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