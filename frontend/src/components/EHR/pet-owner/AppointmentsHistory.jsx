import { FiCalendar } from "react-icons/fi";

export default function AppointmentHistory({ pet }) {
  const appointments = pet.appointmentHistory || [];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Appointment History
      </h3>
      
      {appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((appointment, index) => (
            <div
              key={index}
              className="p-5 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-primary w-5 h-5" />
                  <span className="font-semibold text-gray-900">
                    {appointment.date}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  appointment.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {appointment.status}
                </span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">
                {appointment.reason}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Veterinarian: Dr. {appointment.veterinarian}
              </p>
              {appointment.notes && (
                <p className="text-sm text-gray-700 mt-3 pt-3 border-t border-gray-200">
                  {appointment.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No appointment history available</p>
        </div>
      )}
    </div>
  );
}