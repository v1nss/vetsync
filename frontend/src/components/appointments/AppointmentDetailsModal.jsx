// AppointmentDetailsModal.jsx (FOR VET PROFESSIONALS)
import { FaTimes, FaPaw, FaUser, FaClock, FaPhone, FaEnvelope, FaMapMarkerAlt, FaNotesMedical } from "react-icons/fa";

export default function AppointmentDetailsModal({ isOpen, onClose, appointment }) {
  if (!isOpen || !appointment) return null;
  
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Appointment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              {getStatusBadge(appointment.status)}
            </div>

            {/* Pet Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaPaw className="text-primary" />
                Pet Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900 font-medium">{appointment.pet?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <p className="text-gray-900">{appointment.pet?.species || 'N/A'}</p>
                  </div>
                  {appointment.pet?.breed && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Breed</label>
                      <p className="text-gray-900">{appointment.pet?.breed}</p>
                    </div>
                  )}
                  {/* {appointment.pet_age && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Age</label>
                      <p className="text-gray-900">{appointment.pet_age}</p>
                    </div>
                  )} */}
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaUser className="text-primary" />
                Owner Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-900 font-medium">{appointment.owner?.User?.full_name || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-900">
                  <FaPhone className="text-primary text-sm" />
                  <span>{appointment.owner?.User?.phone_number || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-900">
                  <FaEnvelope className="text-primary text-sm" />
                  <span>{appointment.owner?.User?.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Appointment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaClock className="text-primary" />
                Appointment Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <p className="text-gray-900 font-medium">{appointment.date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Time</label>
                    <p className="text-gray-900 font-medium">{appointment.time}</p>
                  </div>
                </div>
                {/* <div>
                  <label className="text-sm font-medium text-gray-600">Service</label>
                  <p className="text-gray-900">{appointment.service}</p>
                </div> */}
                {appointment.clinic && (
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary text-sm" />
                    <span className="text-gray-900">
                      {typeof appointment.clinic === 'string' 
                        ? appointment.clinic 
                        : appointment.clinic?.name || 'N/A'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaNotesMedical className="text-primary" />
                  Appointment Notes
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-gray-700">{appointment.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}