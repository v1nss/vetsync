import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaLocationDot, FaClock, FaChevronLeft } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import Navbar from "../../components/Navbar.jsx";

export default function BookAppointmentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedPet, setSelectedPet] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [otherService, setOtherService] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const clinic = location.state?.clinic;

  const [pets] = useState([
    {
      id: 1,
      name: "Brownie",
      age: "8 years old",
      weight: "12 kilos",
      breed: "Aspin",
      gender: "Male",
    },
    {
      id: 2,
      name: "Cici",
      age: "3 years old",
      weight: "25 kilos",
      breed: "Golden Retriever",
      gender: "Female",
    },
    {
      id: 3,
      name: "Dynamo",
      age: "3 years old",
      weight: "28 kilos",
      breed: "Golden Retriever",
      gender: "Male",
    },
  ]);

  if (!clinic) {
    return (
      <div className="p-6 text-center flex flex-col justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">No clinic data found.</p>
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

      <div className="max-w-5xl mx-auto px-4 pt-20 pb-10 sm:pt-8">
        <button
          onClick={() => navigate(-1)}
          className="hidden rounded-full sm:flex items-center gap-2 mb-8"
        >
          <FaChevronLeft className="text-gray-500" />
          <h1 className="text-2xl font-medium">Book Appointment</h1>
        </button>
        <div className="top-0 sm:hidden fixed left-0 p-4 z-50 flex items-center gap-2 bg-white w-full border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-gray-300 transition"
          >
            <FaChevronLeft className="text-gray-500" />
          </button>
          <h1 className="text-xl font-medium">Book Appointment</h1>
        </div>

        <div className="border border-gray-300 rounded-2xl p-6 mb-4 m:mb-8">
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

          {/* Select Pet */}
          <div className="flex flex-col gap-2">
            <label className="label-required text-sm font-medium">
              Select Pet
            </label>

            <div className="flex flex-wrap gap-3">
              {pets.map((pet) => (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => setSelectedPet(pet.name)}
                  className={`flex flex-col items-center p-3 rounded-xl border w-[90px]
                          transition ${
                            selectedPet === pet.name
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300 text-gray-700"
                          }`}
                >
                  <img
                    src={pet.photo}
                    alt={pet.name}
                    className="w-14 h-14 object-cover rounded-full"
                  />
                  <span className="text-xs font-medium mt-2">{pet.name}</span>
                </button>
              ))}
            </div>

            {/* Hidden input for form submission */}
            <input type="hidden" required value={selectedPet} />
          </div>

          {/* Service */}
          <div className="flex flex-col gap-2">
            <label className="label-required text-sm font-medium">
              Select Service
            </label>

            {/* Buttons container */}
            <div className="flex flex-wrap gap-2">
              {clinic.services?.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className={`px-4 py-2 rounded-xl border text-sm
                          ${
                            selectedService === service
                              ? "bg-primary text-white border-primary"
                              : "border-gray-300 text-gray-700"
                          }`}
                >
                  {service}
                </button>
              ))}

              {/* "Others" button */}
              <button
                type="button"
                onClick={() => setSelectedService("others")}
                className={`px-4 py-2 rounded-xl border text-sm
                        ${
                          selectedService === "others"
                            ? "bg-primary text-white border-primary"
                            : "border-gray-300 text-gray-700"
                        }`}
              >
                Others
              </button>
            </div>

            {/* Show input field only when selecting "Others" */}
            {selectedService === "others" && (
              <input
                type="text"
                placeholder="Specify other service"
                onChange={(e) => setOtherService(e.target.value)}
                className="border p-3 rounded-xl mt-2"
                required
              />
            )}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label className="label-required text-sm font-medium">Date</label>
            <input
              type="date"
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded-xl"
            />
          </div>

          {/* Time */}
          <div className="flex flex-col gap-1">
            <label className="label-required text-sm font-medium">Time</label>
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
