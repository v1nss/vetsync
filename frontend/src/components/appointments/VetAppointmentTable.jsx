import { useState } from "react";
import { FaPaw, FaClock, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFileAlt, FaCheck } from "react-icons/fa";
import Pagination from "../Pagination";

const PAGE_SIZE = 10;

// ─── Table Row ────────────────────────────────────────────────────────────────
function VetAppointmentRow({ appointment, onMarkComplete, onViewDetails }) {
  const statusStyles = {
    pending:   "bg-yellow-100 text-yellow-700",
    approved:  "bg-green-100 text-green-700",
    rejected:  "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
    completed: "bg-blue-100 text-blue-700",
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Pet & Owner */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <FaPaw className="text-primary shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 leading-tight">
              {appointment.pet_name}
              {appointment.pet_type && (
                <span className="text-gray-400 font-normal text-xs ml-1 capitalize">
                  ({appointment.pet_type})
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500">{appointment.owner_name}</p>
            {appointment.pet_breed && (
              <p className="text-xs text-gray-400">{appointment.pet_breed}</p>
            )}
          </div>
        </div>
      </td>

      {/* Date & Time */}
      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <FaClock className="text-primary text-xs shrink-0" />
          <span>{appointment.date}</span>
        </div>
        <p className="text-xs text-gray-400 ml-4">{appointment.time}</p>
      </td>

      {/* Service */}
      <td className="px-4 py-3 text-sm text-gray-700">
        {appointment.service}
      </td>

      {/* Contact */}
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <FaPhone className="text-primary text-xs shrink-0" />
          <span>{appointment.owner_phone}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <FaEnvelope className="text-primary text-xs shrink-0" />
          <span className="text-xs text-gray-400 truncate max-w-[160px]">{appointment.owner_email}</span>
        </div>
      </td>

      {/* Clinic */}
      <td className="px-4 py-3 text-sm text-gray-600">
        {appointment.clinic_name ? (
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-primary text-xs shrink-0" />
            <span>{appointment.clinic_name}</span>
          </div>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>

      {/* Notes */}
      {appointment.notes && (
        <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px]">
          <span className="line-clamp-2 text-xs">{appointment.notes}</span>
        </td>
      )}

      {/* Status */}
      <td className="px-4 py-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[appointment.status]}`}>
          {appointment.status}
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

          {appointment.status === "approved" && (
            <button
              onClick={() => onMarkComplete(appointment)}
              title="Mark Complete"
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <FaCheck className="text-sm" />
            </button>
          )}

          {appointment.status === "completed" && (
            <span title="Completed" className="p-1.5 text-green-500">
              <FaCheck className="text-sm" />
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
export default function VetAppointmentTable({ appointments = [], onMarkComplete, onViewDetails }) {
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
              <th className="px-4 py-3 font-semibold">Pet / Owner</th>
              <th className="px-4 py-3 font-semibold">Date & Time</th>
              <th className="px-4 py-3 font-semibold">Service</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Clinic</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((appt) => (
              <VetAppointmentRow
                key={appt.id}
                appointment={appt}
                onMarkComplete={onMarkComplete}
                onViewDetails={onViewDetails}
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