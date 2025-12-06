import { useState, useEffect, useMemo, useContext } from "react";
import { FaCalendarAlt, FaClipboardList, FaClock, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import ConfirmationModal from "../../components/ConfirmationModal";
import NotificationModal from "../../components/NotificationModal";
import CalendarModal from "../../components/appointments/CalendarModal";
import AssignVetModal from "../../components/appointments/AssignVetModal";
import AppointmentDetailsModal from "../../components/appointments/AppointmentDetailsModal";
import AppointmentCard from "../../components/appointments/AppointmentCard";
import AppointmentsFilters from "../../components/appointments/AppointmentsFilters";
import AddHealthRecordModal from "../../components/EHR/AddHealthRecordModal";
import { fetchAppointmentsByClinic, updateAppointmentStatus, assignVetToAppointment } from "../../global/api/appointment";
import { fetchMyClinic } from "../../global/api/clinicAdmin";
import { fetchClinicVets } from "../../global/api/clinicAdmin";
import {ClinicStatusContext} from "../../context/ClinicStatusContext";

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
  },
  completed: {
    title: 'Complete Appointment?',
    message: (apt) => `Complete this appointment for ${apt.pet_name}? This will finalize the visit and save the health record.`,
    type: 'info'
  }
};

export default function ClinicAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [vets, setVets] = useState([]);
  const [clinicId, setClinicId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAssignVetModal, setShowAssignVetModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showHealthRecordModal, setShowHealthRecordModal] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const {clinic} = useContext(ClinicStatusContext);
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

  // Calculate stats from appointments
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return {
      total: appointments.length,
      pending: appointments.filter(apt => apt.status === 'pending').length,
      approved: appointments.filter(apt => apt.status === 'approved').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      today: appointments.filter(apt => apt.date === today).length
    };
  }, [appointments]);

  // Fetch clinic and appointments on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // const clinic = await fetchMyClinic();
        if (clinic && clinic.clinic_id) {
          setClinicId(clinic.clinic_id);
          
          const [appointmentsData, vetsData] = await Promise.all([
            fetchAppointmentsByClinic(clinic.clinic_id),
            fetchClinicVets()
          ]);
          
          const transformedAppointments = (appointmentsData.appointments || []).map(apt => ({
            id: apt.appointment_id,
            pet_name: apt.pet?.name || 'N/A',
            pet_type: apt.pet?.species || 'N/A',
            pet_breed: apt.pet?.breed || apt.pet?.species || 'N/A',
            pet_birthdate: apt.pet?.birthdate || null,
            pet_gender: apt.pet?.gender || null,
            pet_id: apt.pet_id,
            owner_name: apt.owner?.User?.full_name || 'N/A',
            owner_email: apt.owner?.User?.email || 'N/A',
            owner_phone: apt.owner?.User?.phone_number || 'N/A',
            date: apt.date,
            time: apt.time,
            service: apt.service || 'General Checkup',
            status: apt.status,
            notes: apt.notes || '',
            assigned_vet: apt.vet_professional_id ? 
              vetsData.find(v => v.user_id === apt.vet_professional_id)?.User?.full_name: null,
            vet_id: apt.vet_professional_id
          }));
          
          setAppointments(transformedAppointments);
          setVets(vetsData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setNotification({
          isOpen: true,
          type: 'error',
          title: 'Error',
          message: 'Failed to load appointments. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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

  const handleStatusChange = (appointmentId, newStatus, appointmentDetails) => {
    if (newStatus === 'approved' && !appointmentDetails.assigned_vet) {
      setSelectedAppointment(appointmentDetails);
      setShowAssignVetModal(true);
      setPendingApproval(true);
      return;
    }

    const config = STATUS_MESSAGES[newStatus];
    setConfirmation({
      isOpen: true,
      title: config.title,
      message: config.message(appointmentDetails),
      type: config.type,
      action: newStatus,
      appointmentId,
      vetId: appointmentDetails?.vet_id || null
    });
  };

  const confirmStatusChange = async () => {
    const { action, appointmentId, vetId: confirmationVetId } = confirmation;
    try {
      const currentAppointment = appointments.find(apt => apt.id === appointmentId);
      const vetId = confirmationVetId || currentAppointment?.vet_id || null;
      
      await updateAppointmentStatus(appointmentId, action, vetId);
      
      if (clinicId) {
        const appointmentsData = await fetchAppointmentsByClinic(clinicId);
        const transformedAppointments = (appointmentsData.appointments || []).map(apt => ({
          id: apt.appointment_id,
          pet_name: apt.pet?.name || 'N/A',
          pet_type: apt.pet?.species || 'N/A',
          pet_breed: apt.pet?.breed || apt.pet?.species || 'N/A',
          pet_birthdate: apt.pet?.birthdate || null,
          pet_gender: apt.pet?.gender || null,
          pet_id: apt.pet_id,
          owner_name: apt.owner?.User?.full_name || 'N/A',
          owner_email: apt.owner?.User?.email || 'N/A',
          owner_phone: apt.owner?.User?.phone_number || 'N/A',
          date: apt.date,
          time: apt.time,
          service: apt.service || 'General Checkup',
          status: apt.status,
          notes: apt.notes || '',
          assigned_vet: apt.vet_professional_id ? 
            vets.find(v => v.user_id === apt.vet_professional_id)?.User?.full_name: null,
          vet_id: apt.vet_professional_id
        }));
        setAppointments(transformedAppointments);
      }
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Success!',
        message: `Appointment for ${currentAppointment?.pet_name || 'pet'} has been ${action}.`
      });
      
      setConfirmation({ ...confirmation, isOpen: false });
    } catch (err) {
      console.error("Error updating appointment status:", err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to update appointment status. Please try again.'
      });
      setConfirmation({ ...confirmation, isOpen: false });
    }
  };

  const handleAssignVet = async (selectedVetId) => {
    if (!selectedVetId) {
      setNotification({
        isOpen: true,
        type: 'warning',
        title: 'No Vet Selected',
        message: 'Please select a veterinarian to assign.'
      });
      return;
    }

    try {
      const vetId = parseInt(selectedVetId, 10);

      await assignVetToAppointment(selectedAppointment.id, vetId);
      
      if (clinicId) {
        const appointmentsData = await fetchAppointmentsByClinic(clinicId);
        
        const transformedAppointments = (appointmentsData.appointments || []).map(apt => ({
          id: apt.appointment_id,
          pet_name: apt.pet?.name || 'N/A',
          pet_type: apt.pet?.species || 'N/A',
          pet_breed: apt.pet?.breed || apt.pet?.species || 'N/A',
          pet_birthdate: apt.pet?.birthdate || null,
          pet_gender: apt.pet?.gender || null,
          pet_id: apt.pet_id,
          owner_name: apt.owner?.User?.full_name || 'N/A',
          owner_email: apt.owner?.User?.email || 'N/A',
          owner_phone: apt.owner?.User?.phone_number || 'N/A',
          date: apt.date,
          time: apt.time,
          service: apt.service || 'General Checkup',
          status: apt.status,
          notes: apt.notes || '',
          assigned_vet: apt.vet_professional_id ? 
            vets.find(v => v.user_id === apt.vet_professional_id)?.User?.full_name || 'Assigned' : null,
          vet_id: apt.vet_professional_id
        }));
        setAppointments(transformedAppointments);
      }
      
      setShowAssignVetModal(false);
      setSelectedAppointment(prev => ({
        ...prev,
        vet_id: vetId,
        assigned_vet: vets.find(v => (v.user_id || v.id) === vetId)?.name || 'Assigned'
      }));
      
      if (pendingApproval) {
        setPendingApproval(false);
        
        const config = STATUS_MESSAGES.approved;
        setConfirmation({
          isOpen: true,
          title: config.title,
          message: config.message(selectedAppointment),
          type: config.type,
          action: 'approved',
          appointmentId: selectedAppointment.id,
          vetId: vetId
        });
      } else {
        const assignedVet = vets.find(v => (v.user_id || v.id) === vetId);
        const vetName = assignedVet?.name || assignedVet?.User?.full_name || 'Veterinarian';
        setNotification({
          isOpen: true,
          type: 'success',
          title: 'Vet Assigned!',
          message: `${vetName} has been assigned to ${selectedAppointment.pet_name}'s appointment.`
        });
      }
    } catch (err) {
      console.error("Error assigning vet:", err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to assign veterinarian. Please try again.'
      });
    }
  };

  const handleCompleteAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowHealthRecordModal(true);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleHealthRecordSave = async (healthRecord) => {
    console.log('Health record saved:', healthRecord);
    
    try {
      await updateAppointmentStatus(selectedAppointment.id, 'completed');
      
      if (clinicId) {
        const appointmentsData = await fetchAppointmentsByClinic(clinicId);
        const transformedAppointments = (appointmentsData.appointments || []).map(apt => ({
          id: apt.appointment_id,
          pet_name: apt.pet?.name || 'N/A',
          pet_type: apt.pet?.species || 'N/A',
          pet_breed: apt.pet?.breed || apt.pet?.species || 'N/A',
          pet_birthdate: apt.pet?.birthdate || null,
          pet_gender: apt.pet?.gender || null,
          pet_id: apt.pet_id,
          owner_name: apt.owner?.User?.full_name || 'N/A',
          owner_email: apt.owner?.User?.email || 'N/A',
          owner_phone: apt.owner?.User?.phone_number || 'N/A',
          date: apt.date,
          time: apt.time,
          service: apt.service || 'General Checkup',
          status: apt.status,
          notes: apt.notes || '',
          assigned_vet: apt.vet_professional_id ? 
            vets.find(v => v.user_id === apt.vet_professional_id || v.id === apt.vet_professional_id)?.name || 'Assigned' : null,
          vet_id: apt.vet_professional_id
        }));
        setAppointments(transformedAppointments);
      }
      
      setShowHealthRecordModal(false);
      
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
        message: 'Failed to complete appointment. Please try again.'
      });
    }
  };

  const statsCards = [
    { label: "Total", value: stats.total, icon: FaClipboardList, bgColor: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Pending", value: stats.pending, icon: FaHourglassHalf, bgColor: "bg-yellow-100", iconColor: "text-yellow-600" },
    { label: "Approved", value: stats.approved, icon: FaClock, bgColor: "bg-green-100", iconColor: "text-green-600" },
    { label: "Completed", value: stats.completed, icon: FaCheckCircle, bgColor: "bg-blue-100", iconColor: "text-blue-600" }
  ];

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
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
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
                onComplete={handleCompleteAppointment}
                onViewDetails={handleViewDetails}
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
        onClose={() => {
          setShowAssignVetModal(false);
          setPendingApproval(false);
        }}
        appointment={selectedAppointment}
        vets={vets}
        onAssign={handleAssignVet}
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
            assigned_vet: selectedAppointment.assigned_vet,
            vet_id: selectedAppointment.vet_id,
            service: selectedAppointment.service
          }}
          onClose={() => setShowHealthRecordModal(false)}
          onSave={handleHealthRecordSave}
        />
      )}

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