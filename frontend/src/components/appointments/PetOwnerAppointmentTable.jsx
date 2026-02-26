import { useState } from "react";
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaMapMarkerAlt, FaFileAlt, FaTimesCircle } from "react-icons/fa";
import Pagination from "../Pagination";

const PAGE_SIZE = 10;

// ─── Table Row ────────────────────────────────────────────────────────────────
function AppointmentRow({ appointment, activeTab, onViewDetails, onCancel, getPetName, getPetType, getAppointmentType, getStatusColor, formatDate, formatTime, getVeterinarianName, getClinicPhone, getClinicName, getClinicAddress }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Pet & Service */}
      <td className="px-4 py-3">
        <p className="font-semibold text-gray-900 leading-tight">
          {getPetName(appointment)}
          <span className="text-gray-400 font-normal text-xs ml-1">
            ({getPetType(appointment)})
          </span>
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{getAppointmentType(appointment)}</p>
      </td>

      {/* Date & Time */}
      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <FaCalendarAlt className="text-primary text-xs shrink-0" />
          <span>{formatDate(appointment.date)}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <FaClock className="text-primary text-xs shrink-0" />
          <span className="text-xs text-gray-400">{formatTime(appointment.time)}</span>
        </div>
      </td>

      {/* Veterinarian */}
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <FaUser className="text-primary text-xs shrink-0" />
          <span>{getVeterinarianName(appointment)}</span>
        </div>
      </td>

      {/* Clinic */}
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-primary text-xs shrink-0" />
          <div>
            <p className="font-medium text-gray-700">{getClinicName(appointment)}</p>
            <p className="text-xs text-gray-400">{getClinicAddress(appointment)}</p>
          </div>
        </div>
      </td>

      {/* Phone */}
      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <FaPhone className="text-primary text-xs shrink-0" />
          <span>{getClinicPhone(appointment)}</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
          {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onViewDetails(appointment)}
            title="View Details"
            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition"
          >
            <FaFileAlt className="text-sm" />
          </button>

          {activeTab === "upcoming" && (
            <button
              onClick={() => onCancel(appointment)}
              title="Cancel"
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <FaTimesCircle className="text-sm" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
export default function PetOwnerAppointmentTable({
  appointments = [],
  activeTab,
  onViewDetails,
  onCancel,
  getPetName,
  getPetType,
  getAppointmentType,
  getStatusColor,
  formatDate,
  formatTime,
  getVeterinarianName,
  getClinicPhone,
  getClinicName,
  getClinicAddress,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(appointments.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginated = appointments.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 font-semibold">Pet / Service</th>
              <th className="px-4 py-3 font-semibold">Date & Time</th>
              <th className="px-4 py-3 font-semibold">Veterinarian</th>
              <th className="px-4 py-3 font-semibold">Clinic</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((appointment) => (
              <AppointmentRow
                key={appointment.appointment_id}
                appointment={appointment}
                activeTab={activeTab}
                onViewDetails={onViewDetails}
                onCancel={onCancel}
                getPetName={getPetName}
                getPetType={getPetType}
                getAppointmentType={getAppointmentType}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
                formatTime={formatTime}
                getVeterinarianName={getVeterinarianName}
                getClinicPhone={getClinicPhone}
                getClinicName={getClinicName}
                getClinicAddress={getClinicAddress}
              />
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination + result count */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-3 px-1">
        <p className="text-xs text-gray-400">
          Showing {appointments.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, appointments.length)} of {appointments.length} appointments
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}