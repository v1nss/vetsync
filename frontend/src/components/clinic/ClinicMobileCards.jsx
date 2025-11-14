import { FaEye, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaBuilding } from 'react-icons/fa';

export default function ClinicMobileCards({ clinics, onReview, getStatusBadge }) {
  return (
    <div className="lg:hidden p-4 space-y-4">
      {clinics.length === 0 ? (
        <div className="px-6 py-12 text-center text-gray-500">
          No clinics found matching your criteria
        </div>
      ) : (
        clinics.map((clinic) => (
          <div key={clinic.clinic_id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start flex-1">
                <FaBuilding className="text-gray-400 mt-1 mr-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
                  <div className="text-sm text-gray-500 flex items-start mt-1">
                    <FaMapMarkerAlt className="mr-1 text-xs mt-1 shrink-0" />
                    <span className="line-clamp-2">{clinic.address}</span>
                  </div>
                </div>
              </div>
              <div className="ml-2">{getStatusBadge(clinic.status)}</div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm">
                <FaUser className="text-gray-400 mr-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 ">{clinic.owner.name}</div>
                  <div className="text-xs text-gray-500 ">{clinic.owner.email}</div>
                </div>
              </div>
              {clinic.contact_number && (
                <div className="flex items-center text-sm text-gray-700">
                  <FaPhone className="text-gray-400 mr-2 shrink-0" />
                  <span className="">{clinic.contact_number}</span>
                </div>
              )}
              {clinic.email && (
                <div className="flex items-center text-sm text-gray-700">
                  <FaEnvelope className="text-gray-400 mr-2 shrink-0" />
                  <span className="">{clinic.email}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => onReview(clinic)}
              className="w-full bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 font-medium flex items-center justify-center gap-2"
            >
              <FaEye />
              Review Clinic
            </button>
          </div>
        ))
      )}
    </div>
  );
}
