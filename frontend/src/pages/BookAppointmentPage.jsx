import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaLocationDot, FaClock, FaChevronLeft } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import Navbar from "../components/Navbar.jsx";

export default function BookAppointmentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const clinic = location.state?.clinic ?? null;

  const [selectedPet, setSelectedPet] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [otherService, setOtherService] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  if (!clinic) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No clinic data found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-primary text-white px-4 py-2 rounded-xl font-semibold"
        >
          Go back
        </button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const appointmentData = {
      clinic: clinic.name,
      pet: selectedPet,
      service: selectedService === "others" ? otherService : selectedService,
      appointmentDate,
      appointmentTime,
      reason,
    };

    console.log("APPOINTMENT BOOKED:", appointmentData);
  };

  return (
    <main>
        <div className="hidden sm:block">
        <Navbar />
        </div>

        <div className="max-w-5xl mx-auto px-4 pt-24 pb-10 sm:pt-8">
            <div className="top-0 sm:hidden fixed left-0 p-4 z-50 flex items-center gap-2 bg-white w-full border-b border-gray-300">
                <button
                    onClick={() => navigate(-1)}
                    className="rounded-full p-3 hover:bg-gray-300 transition"
                >
                    <FaChevronLeft className="text-gray-500" />
                </button>
                <h1 className="text-xl font-medium">Book Appointment</h1>
            </div>

            <div className="border border-gray-300 rounded-2xl p-6 mb-8">
                <h1 className="text-xl font-semibold mb-3">{clinic.name}</h1>

                <div className="space-y-2 text-gray-700 text-sm">
                <p className="flex items-start gap-2">
                    <FaLocationDot className="mt-[3px]" />
                    {clinic.address}
                </p>

                {clinic.contact && (
                    <p className="flex items-center gap-2">
                    <FaPhoneAlt />
                    {clinic.contact}
                    </p>
                )}

                {clinic.openingHours && (
                    <p className="flex items-center gap-2">
                    <FaClock />
                    {clinic.openingHours}
                    </p>
                )}
                </div>
            </div>

            {/* Booking Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6 border border-gray-300 rounded-2xl p-6"
            >
                <h2 className="font-semibold text-lg">Book Appointment</h2>

                {/* Pet */}
                <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Select Pet</label>
                <input
                    type="text"
                    placeholder="Enter pet name"
                    onChange={(e) => setSelectedPet(e.target.value)}
                    required
                    className="border border-gray-300 p-3 rounded-xl"
                />
                </div>

                {/* Service */}
                <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Select Service</label>
                <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="border border-gray-300 p-3 rounded-xl"
                    required
                >
                    <option value="">-- Select --</option>
                    <option value="checkup">Check-up</option>
                    <option value="grooming">Grooming</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="others">Others</option>
                </select>

                {selectedService === "others" && (
                    <input
                    type="text"
                    placeholder="Specify other service"
                    onChange={(e) => setOtherService(e.target.value)}
                    className="border border-gray-300 p-3 rounded-xl"
                    />
                )}
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Date</label>
                <input
                    type="date"
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                    className="border border-gray-300 p-3 rounded-xl"
                />
                </div>

                {/* Time */}
                <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Time</label>
                <input
                    type="time"
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                    className="border border-gray-300 p-3 rounded-xl"
                />
                </div>

                {/* Reason */}
                <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Reason (optional)</label>
                <textarea
                    placeholder="Enter reason"
                    onChange={(e) => setReason(e.target.value)}
                    className="border border-gray-300 p-3 rounded-xl min-h-20 resize-none"
                />
                </div>

                {/* Submit */}
                <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold"
                >
                Confirm appointment
                </button>
                
            </form>
        </div>
    </main>
  );
}
