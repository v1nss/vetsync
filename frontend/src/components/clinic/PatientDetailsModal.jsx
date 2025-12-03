import { FaTimes, FaPaw, FaBirthdayCake, FaWeight, FaVenusMars, FaCalendarAlt, FaPhone, FaEnvelope, FaNotesMedical, FaExclamationTriangle, FaPills } from "react-icons/fa";

export default function PatientDetailsModal({ patient, isOpen, onClose }) {
  if (!isOpen || !patient) return null;

  const calculateExactAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-linear-to-r from-primary to-[#FEA08E] text-white p-6 rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <FaPaw className="text-3xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{patient.pet_name}</h2>
                <p className="text-blue-100 mt-1">
                  {patient.breed} • {patient.species}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FaCalendarAlt className="text-sm" />
                  <span className="text-xs font-medium">AGE</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {calculateExactAge(patient.birthday)}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FaWeight className="text-sm" />
                  <span className="text-xs font-medium">WEIGHT</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {patient.weight}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FaVenusMars className="text-sm" />
                  <span className="text-xs font-medium">GENDER</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {patient.gender}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FaCalendarAlt className="text-sm" />
                  <span className="text-xs font-medium">VISITS</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {patient.total_visits}
                </p>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="space-y-6">
              {/* Pet Information */}
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaPaw className="text-primary" />
                  Pet Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Color</label>
                    <p className="text-gray-900 mt-1">{patient.color}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Birthday</label>
                    <p className="text-gray-900 mt-1 flex items-center gap-2">
                      <FaBirthdayCake className="text-pink-500" />
                      {new Date(patient.birthday).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Visit</label>
                    <p className="text-gray-900 mt-1">
                      {new Date(patient.last_visit).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Owner Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900 mt-1">{patient.owner_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900 mt-1 flex items-center gap-2">
                      <FaPhone className="text-green-600" />
                      {patient.owner_phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 mt-1 flex items-center gap-2">
                      <FaEnvelope className="text-primary" />
                      {patient.owner_email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaNotesMedical className="text-red-600" />
                  Medical Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <FaExclamationTriangle className="text-orange-500" />
                      Allergies
                    </label>
                    <p className="text-gray-900 mt-1 bg-orange-50 p-3 rounded-lg">
                      {patient.allergies}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <FaPills className="text-purple-600" />
                      Current Medications
                    </label>
                    <p className="text-gray-900 mt-1 bg-purple-50 p-3 rounded-lg">
                      {patient.medications}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Medical Notes</label>
                    <p className="text-gray-900 mt-1 bg-blue-50 p-3 rounded-lg">
                      {patient.medical_notes}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors font-medium">
                Edit Patient
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}