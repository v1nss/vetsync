import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function RescheduleModal({ isOpen, onClose, appointment, onReschedule }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  if (!isOpen || !appointment) return null;

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      onReschedule(selectedDate, selectedTime);
      setSelectedDate('');
      setSelectedTime('');
    }
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full relative animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes className="text-xl" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Reschedule Appointment</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Appointment Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Current Appointment</h3>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{appointment.petName}</span> - {appointment.type}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {appointment.date} at {appointment.time}
            </p>
          </div>

          {/* New Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* New Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Choose a time slot</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirm Reschedule
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