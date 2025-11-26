import { FaPaw, FaClock, FaPhone, FaEnvelope, FaUserMd, FaCheckCircle, FaTimesCircle, FaBan } from "react-icons/fa";

export default function AppointmentCard({ appointment, onStatusChange, onAssignVet }) {
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
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
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary transition">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Section - Appointment Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaPaw className="text-primary text-xl" />
                <h3 className="text-xl font-semibold text-gray-900">{appointment.pet_name}</h3>
                <span className="text-gray-500">({appointment.pet_type})</span>
                {getStatusBadge(appointment.status)}
              </div>
              <p className="text-gray-600 font-medium">{appointment.owner_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <FaClock className="text-primary" />
              <span>{appointment.date} at {appointment.time}</span>
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
              <span className="font-medium">Service:</span>
              <span>{appointment.service}</span>
            </div>
          </div>

          {appointment.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Notes:</span> {appointment.notes}
              </p>
            </div>
          )}

          {appointment.assigned_vet && (
            <div className="flex items-center gap-2 text-sm">
              <FaUserMd className="text-green-600" />
              <span className="text-gray-600">
                Assigned to: <span className="font-medium text-gray-900">{appointment.assigned_vet}</span>
              </span>
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col gap-2 lg:min-w-[200px]">
          {appointment.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusChange(appointment.id, 'approved', appointment)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
              >
                <FaCheckCircle /> Approve
              </button>
              <button
                onClick={() => onStatusChange(appointment.id, 'rejected', appointment)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
              >
                <FaTimesCircle /> Reject
              </button>
            </>
          )}

          {(appointment.status === 'approved' || appointment.status === 'pending') && (
            <button
              onClick={() => onStatusChange(appointment.id, 'cancelled', appointment)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
            >
              <FaBan /> Cancel
            </button>
          )}

          <button
            onClick={() => onAssignVet(appointment)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium"
          >
            <FaUserMd /> {appointment.assigned_vet ? 'Reassign' : 'Assign'} Vet
          </button>
        </div>
      </div>
    </div>
  );
}