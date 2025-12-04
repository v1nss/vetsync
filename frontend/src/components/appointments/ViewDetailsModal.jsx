// AppointmentDetailsModal.jsx (FOR VET PROFESSIONALS)
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaPhone, FaTimes } from "react-icons/fa";

export default function ViewDetailsModal({ isOpen, onClose, appointment }) {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full relative animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes className="text-xl" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Pet Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pet Information</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Pet Name:</span>
                <span className="font-medium text-gray-900">
                  {appointment.pet?.name || appointment.petName || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pet Type:</span>
                <span className="font-medium text-gray-900">
                  {appointment.pet?.species || appointment.petType || 'N/A'}
                </span>
              </div>
              {appointment.service && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium text-gray-900">{appointment.service}</span>
                </div>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Date & Time</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center text-gray-700">
                <FaCalendarAlt className="h-5 w-5 mr-3 text-primary" />
                <span className="font-medium">{appointment.date}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaClock className="h-5 w-5 mr-3 text-primary" />
                <span className="font-medium">{appointment.time}</span>
              </div>
            </div>
          </div>

          {/* Veterinarian Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Veterinarian</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center text-gray-700">
                <FaUser className="h-5 w-5 mr-3 text-primary" />
                <span className="font-medium">{appointment.veterinarian}</span>
              </div>
            </div>
          </div>

          {/* Clinic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Clinic Information</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div>
                <p className="font-medium text-gray-900">
                  {typeof appointment.clinic === 'string' 
                    ? appointment.clinic 
                    : appointment.clinic?.name || 'N/A'}
                </p>
              </div>
              <div className="flex items-start text-gray-700">
                <FaMapMarkerAlt className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                <span>
                  {typeof appointment.clinic === 'object' && appointment.clinic?.address
                    ? appointment.clinic.address
                    : appointment.address || 'N/A'}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaPhone className="h-5 w-5 mr-3 text-primary" />
                <span>
                  {typeof appointment.clinic === 'object' && appointment.clinic?.contact_number
                    ? appointment.clinic.contact_number
                    : appointment.phone || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Status</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {appointment.status}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <button 
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/80 text-white py-3 rounded-xl transition font-medium"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}