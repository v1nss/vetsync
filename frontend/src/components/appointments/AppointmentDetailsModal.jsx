// AppointmentDetailsModal.jsx (FOR CLINIC ADMIN)
import { FaTimes, FaPaw, FaUser, FaClock, FaPhone, FaEnvelope, FaMapMarkerAlt, FaNotesMedical, FaMars, FaVenus } from "react-icons/fa";

export default function AppointmentDetailsModal({ isOpen, onClose, appointment }) {
  if (!isOpen || !appointment) return null;
  console.log("Appointment Details:", appointment);
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

  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    
    const birth = new Date(birthdate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}${months > 0 ? ` ${months} month${months > 1 ? 's' : ''}` : ''}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
      return `${days} day${days > 1 ? 's' : ''}`;
    }
  };

  // Get gender icon
  const getGenderIcon = (gender) => {
    if (!gender) return null;
    const genderLower = gender.toLowerCase();

    if (genderLower === 'male' || genderLower === 'm') {
      return <FaMars className="text-blue-500" title="Male" />;
    } else if (genderLower === 'female' || genderLower === 'f') {
      return <FaVenus className="text-pink-500" title="Female" />;
    }
    return null;
  };

  const petBirthdate = appointment.pet_birthdate || appointment.pet?.birthdate;
  const petAge = calculateAge(petBirthdate);
  const petGender = appointment.pet_gender || appointment.pet?.gender;

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
                    <p className="text-gray-900 font-medium flex items-center gap-2">
                      {appointment.pet_name || appointment.pet?.name || 'N/A'}
                      {petGender && (
                        <span className="inline-flex items-center">
                          {getGenderIcon(petGender)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <p className="text-gray-900 capitalize">{appointment.pet_type || appointment.pet?.species || 'N/A'}</p>
                  </div>
                  {(appointment.pet_breed || appointment.pet?.breed) && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Breed</label>
                      <p className="text-gray-900">{appointment.pet_breed || appointment.pet?.breed}</p>
                    </div>
                  )}
                  {petAge && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Age</label>
                      <p className="text-gray-900">{petAge}</p>
                    </div>
                  )}
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
                  <p className="text-gray-900 font-medium">{appointment.owner_name || appointment.owner?.User?.full_name || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-900">
                  <FaPhone className="text-primary text-sm" />
                  <span>{appointment.owner_phone || appointment.owner?.User?.phone_number || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-900">
                  <FaEnvelope className="text-primary text-sm" />
                  <span>{appointment.owner_email || appointment.owner?.User?.email || 'N/A'}</span>
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
                <div className="grid grid-cols-2 gap-4">
                  {appointment.service && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Service</label>
                      <p className="text-gray-900">{appointment.service}</p>
                    </div>
                  )}
                  {appointment.assigned_vet && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Assigned Veterinarian</label>
                      <p className="text-gray-900 font-medium">Dr. {appointment.assigned_vet}</p>
                    </div>
                  )}
                </div>
                {(appointment.clinic || appointment.clinic_name) && (
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary text-sm" />
                    <span className="text-gray-900">
                      {typeof appointment.clinic === 'string' 
                        ? appointment.clinic 
                        : appointment.clinic?.name || appointment.clinic_name || 'N/A'}
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