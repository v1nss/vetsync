import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaBuilding } from 'react-icons/fa';

export default function ClinicTable({ clinics, onReview, getStatusBadge }) {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Clinic</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Owner</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {clinics.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                No clinics found matching your criteria
              </td>
            </tr>
          ) : (
            clinics.map((clinic) => (
              <tr key={clinic.clinic_id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-start">
                    <FaBuilding className="text-gray-400 mt-1 mr-3 shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900">{clinic.name}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <FaMapMarkerAlt className="mr-1 text-xs" />
                        {clinic.address}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FaUser className="text-gray-400 mr-2 text-sm shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{clinic.owner.name}</div>
                      <div className="text-xs text-gray-500">{clinic.owner.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {clinic.contact_number && (
                      <div className="flex items-center mb-1">
                        <FaPhone className="text-gray-400 mr-2 text-xs" />
                        {clinic.contact_number}
                      </div>
                    )}
                    {clinic.email && (
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-400 mr-2 text-xs" />
                        {clinic.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(clinic.status)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onReview(clinic)}
                    className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/80 transition"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}