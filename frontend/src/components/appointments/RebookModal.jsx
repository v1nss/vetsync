import { useState } from "react";
import { FaTimes, FaCalendarAlt, FaClock } from "react-icons/fa";

export default function RebookModal({ isOpen, onClose, appointment, onRebook }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
    "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", 
    "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const getMinDate = () => new Date().toISOString().split('T')[0];
  
  const getMaxDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      onRebook({
        appointmentId: appointment.id,
        newDate: selectedDate,
        newTime: selectedTime,
        reason: reason
      });
      // Reset form
      setSelectedDate("");
      setSelectedTime("");
      setReason("");
    }
  };

  const canSubmit = selectedDate && selectedTime;

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full relative animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes className="text-xl" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Rebook Appointment</h2>
          <p className="text-sm text-gray-600 mt-1">Choose a new date and time for your appointment</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Appointment Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Current Appointment</h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-700">
                <span className="font-medium">Pet:</span> {appointment.petName}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Service:</span> {appointment.type}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Date & Time:</span> {appointment.date} at {appointment.time}
              </p>
            </div>
          </div>

          {/* Select New Date */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-primary" /> 
              Select new date
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime(""); // Reset time when date changes
              }}
              min={getMinDate()}
              max={getMaxDate()}
              className="w-full border border-gray-200 p-4 rounded-xl text-lg focus:border-primary focus:outline-none"
            />
            <p className="text-sm text-gray-500 mt-2">Select a date within the next 3 months</p>
          </div>

          {/* Select New Time */}
          {selectedDate && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaClock className="text-primary" /> 
                Select new time
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      selectedTime === time
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {selectedDate && selectedTime && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-lg font-semibold mb-4">Reason for rescheduling (optional)</h3>
              <textarea
                placeholder="Let the clinic know why you need to reschedule..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-200 p-4 rounded-xl min-h-24 resize-none focus:border-primary focus:outline-none"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-[#FEA08E] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Rebooking
            </button>
          </div>
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