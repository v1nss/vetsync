import { FaPaw, FaClock, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaFileAlt } from "react-icons/fa";

export default function VetAppointmentCard({ appointment, onMarkComplete, onViewDetails }) {
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      cancelled: "bg-gray-100 text-gray-700",
      completed: "bg-blue-100 text-blue-700"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getUrgencyBadge = (urgency) => {
    if (!urgency) return null;
    
    const styles = {
      routine: "bg-gray-100 text-gray-700",
      urgent: "bg-orange-100 text-orange-700",
      emergency: "bg-red-100 text-red-700"
    };

    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${styles[urgency]}`}>
        {urgency}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        {/* Left Section - Appointment Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <FaPaw className="text-primary text-xl" />
                <h3 className="text-xl font-semibold text-gray-900">{appointment.pet_name}</h3>
                <span className="text-gray-500">({appointment.pet_type})</span>
                {getStatusBadge(appointment.status)}
                {getUrgencyBadge(appointment.urgency)}
              </div>
              <p className="text-gray-600 font-medium">Owner: {appointment.owner_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <FaClock className="text-primary" />
              <span className="font-medium">{appointment.date} at {appointment.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaPhone className="text-primary" />
              <span>{appointment.owner_phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaEnvelope className="text-primary" />
              <span>{appointment.owner_email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaMapMarkerAlt className="text-primary" />
              <span>{appointment.clinic_name || 'Main Clinic'}</span>
            </div>
          </div>

          {/* Service Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900 mb-1">Service: {appointment.service}</p>
            {appointment.notes && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Notes:</span> {appointment.notes}
              </p>
            )}
          </div>

          {/* Pet Details (if available) */}
          {(appointment.pet_age || appointment.pet_breed) && (
            <div className="flex gap-4 text-sm text-gray-600">
              {appointment.pet_breed && (
                <span><span className="font-medium">Breed:</span> {appointment.pet_breed}</span>
              )}
              {appointment.pet_age && (
                <span><span className="font-medium">Age:</span> {appointment.pet_age}</span>
              )}
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col gap-2 lg:min-w-[200px]">
          <button
            onClick={() => onViewDetails(appointment)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium"
          >
            <FaFileAlt /> View Details
          </button>

          {appointment.status === 'approved' && (
            <button
              onClick={() => onMarkComplete(appointment)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
            >
              <FaCheckCircle /> Mark Complete
            </button>
          )}

          {appointment.status === 'completed' && (
            <div className="text-center py-2 text-sm text-gray-500 italic">
              Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}