import { useState } from "react";
import { FaPaw, FaClock, FaPhone, FaEnvelope, FaUserMd, FaCheckCircle, FaTimesCircle, FaCheck, FaExclamationTriangle, FaFileAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Pagination from "../Pagination";

const PAGE_SIZE = 10;

// ─── Table Row ────────────────────────────────────────────────────────────────
export function AppointmentRow({ appointment, onStatusChange, onComplete, onViewDetails }) {
  const { role } = useAuth();

  const statusStyles = {
    pending:   "bg-yellow-100 text-yellow-700",
    approved:  "bg-green-100 text-green-700",
    rejected:  "bg-red-100 text-red-700",
    canceled:  "bg-red-100 text-red-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  const displayStatus =
    appointment.status === "canceled" || appointment.status === "cancelled"
      ? "rejected"
      : appointment.status;

  const needsVetAssignment = appointment.status === "pending" && !appointment.assigned_vet;

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
                <span className="text-gray-400 font-normal text-xs ml-1">
                  ({appointment.pet_type.charAt(0).toUpperCase() + appointment.pet_type.slice(1)})
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

      {/* Vet */}
      <td className="px-4 py-3 text-sm">
        {appointment.assigned_vet ? (
          <div className="flex items-center gap-1 text-gray-700">
            <FaUserMd className="text-green-500 shrink-0" />
            <span>Dr. {appointment.assigned_vet}</span>
          </div>
        ) : needsVetAssignment ? (
          <div className="flex items-center gap-1 text-orange-600 text-xs">
            <FaExclamationTriangle className="shrink-0" />
            <span>Unassigned</span>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[appointment.status]}`}>
          {displayStatus}
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

          {appointment.status === "pending" && (
            <>
              <button
                onClick={() => onStatusChange(appointment.id, "approved", appointment)}
                title="Approve"
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
              >
                <FaCheckCircle className="text-sm" />
              </button>
              <button
                onClick={() => onStatusChange(appointment.id, "rejected", appointment)}
                title="Reject"
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <FaTimesCircle className="text-sm" />
              </button>
            </>
          )}

          {appointment.status === "approved" && role !== "clinic_admin" && (
            <button
              onClick={() => onComplete(appointment)}
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

export default function AppointmentTable({ appointments = [], onStatusChange, onComplete, onViewDetails }) {
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
              <th className="px-4 py-3 font-semibold">Vet</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((appt) => (
              <AppointmentRow
                key={appt.id}
                appointment={appt}
                onStatusChange={onStatusChange}
                onComplete={onComplete}
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