import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaClock, FaCalendarAlt, FaChevronLeft, FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoCheckmarkCircle } from "react-icons/io5";
import Navbar from "../../components/Navbar.jsx";
import { fetchAllPetsById } from "../../global/api/pet";
import { useAuth } from "../../context/AuthContext";
import { createAppointment } from "../../global/api/appointment.jsx";

export default function BookAppointmentPage() {
  const navigate = useNavigate();
  const { state: { clinic } = {} } = useLocation();

  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [otherService, setOtherService] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
      pet_id: "",
      clinic_id: "",
      service: "",
      date: "",
      time: "",
      notes: "",
  });

  const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
  const defaultServices = ["General Checkup", "Vaccinations", "Emergency Services", "Grooming", "Diagnostics"];
  const services = clinic?.services || defaultServices;

  useEffect(() => {
    fetchAllPetsById()
      .then(res => setPets(res || []))
      .catch(err => console.error("Unable to get pets:", err))
      .finally(() => setLoading(false));
  }, []);

  const getMinDate = () => new Date().toISOString().split('T')[0];
  const getMaxDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date.toISOString().split('T')[0];
  };

  const getImageUrl = (imageObj) => {
    if (!imageObj) return null;
    if (typeof imageObj === 'string') return imageObj;
    return imageObj?.link || imageObj?.directLink || imageObj?.viewLink || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      const payload = {
        pet_id: selectedPet?.pet_id || null,
        clinic_id: clinic.id,
        service: selectedService === "others" ? otherService : selectedService,
        date: appointmentDate,
        time: appointmentTime,
        notes: reason,
      };

    try {
      const res = await createAppointment(payload);
      console.log("Appointment booked successfully:", res);
      navigate('/pet-owner/appointments');
    } catch (err) {
      console.error("Error booking appointment:", err);
      return;
    }
  };

  const canProceedToStep2 = selectedPet && selectedService && (selectedService !== "others" || otherService);
  const canProceedToStep3 = canProceedToStep2 && appointmentDate && appointmentTime;

  if (!clinic) {
    return (
      <div className="p-6 text-center flex flex-col justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">No clinic data found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 bg-primary text-white px-4 py-2 rounded-xl font-semibold">
          Go back
        </button>
      </div>
    );
  }

  const stepConfig = [
    { num: 1, label: "Select Pet & Service" },
    { num: 2, label: "Choose Date & Time" },
    { num: 3, label: "Review & Confirm" }
  ];

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="sticky top-0 hidden sm:block"><Navbar /></div>

      {/* Mobile Header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <FaChevronLeft className="text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold">Book Appointment</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-24 sm:pt-8 pb-32">
        {/* Desktop Header */}
        <button onClick={() => navigate(-1)} className="hidden sm:flex items-center gap-2 mb-6 hover:gap-3 transition-all">
          <FaChevronLeft className="text-gray-600" />
          <span className="text-sm text-gray-600">Back to clinic</span>
        </button>

        <h1 className="hidden sm:block text-3xl font-bold text-gray-900 mb-8">Book an appointment</h1>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center">
          {stepConfig.map(({ num, label }) => (
            <div key={num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${step >= num ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>
                  {step > num ? <IoCheckmarkCircle className="text-xl" /> : num}
                </div>
                <span className={`text-xs font-medium text-center max-w-[100px] ${step >= num ? "text-gray-900" : "text-gray-500"}`}>{label}</span>
              </div>
              {num < 3 && <div className={`flex-1 h-1 mx-3 rounded ${step > num ? "bg-primary" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1 */}
            {step === 1 && (
              <>
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4">Select your pet</h2>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-primary" />
                    </div>
                  ) : !pets?.length ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You don't have any pets registered yet.</p>
                      <button onClick={() => navigate('/pet-owner/pets')} className="text-primary font-semibold hover:underline">
                        Add a pet
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {pets.map((pet) => (
                        <button
                          key={pet.pet_id}
                          type="button"
                          onClick={() => setSelectedPet(pet)}
                          className={`flex flex-col items-center p-4 rounded-xl border transition-all ${selectedPet?.pet_id === pet.pet_id ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}
                        >
                          <div className="w-16 h-16 rounded-full bg-gray-100 mb-2 overflow-hidden flex items-center justify-center">
                            {getImageUrl(pet.profileURL) ? (
                              <img src={getImageUrl(pet.profileURL)} alt={pet.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-2xl font-bold text-primary">{pet.name.charAt(0)}</span>
                            )}
                          </div>
                          <span className="font-medium text-sm text-gray-900">{pet.name}</span>
                          <span className="text-xs text-gray-500">{pet.species}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold mb-4">Select service</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[...services, "Other Service"].map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => setSelectedService(service === "Other Service" ? "others" : service)}
                        className={`p-4 rounded-xl border text-left transition-all ${(selectedService === service || (service === "Other Service" && selectedService === "others")) ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <div className="font-medium text-gray-900">{service}</div>
                      </button>
                    ))}
                  </div>
                  {selectedService === "others" && (
                    <input
                      type="text"
                      placeholder="Specify the service you need"
                      value={otherService}
                      onChange={(e) => setOtherService(e.target.value)}
                      className="mt-4 w-full border border-gray-200 p-3 rounded-xl focus:border-primary focus:outline-none"
                    />
                  )}
                </div>

                <button onClick={() => setStep(2)} disabled={!canProceedToStep2} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-[#FEA08E] transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue
                </button>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-primary" /> Select date
                  </h2>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full border border-gray-200 p-4 rounded-xl text-lg focus:border-primary focus:outline-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">Select a date within the next 3 months</p>
                </div>

                {appointmentDate && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <FaClock className="text-primary" /> Select time
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setAppointmentTime(time)}
                          className={`p-3 rounded-lg border text-sm font-medium transition-all ${appointmentTime === time ? "border-primary bg-primary text-white" : "border-gray-200 hover:border-gray-300"}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">Back</button>
                  <button onClick={() => setStep(3)} disabled={!canProceedToStep3} className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-[#FEA08E] transition disabled:opacity-50 disabled:cursor-not-allowed">Continue</button>
                </div>
              </>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <>
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4">Review your appointment</h2>
                  <div className="space-y-4">
                    {[
                      { label: "Pet", value: selectedPet?.name },
                      { label: "Service", value: selectedService === "others" ? otherService : selectedService },
                      { label: "Date", value: new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                      { label: "Time", value: appointmentTime }
                    ].map((item, idx) => (
                      <div key={idx} className={`flex justify-between py-3 ${idx < 3 ? 'border-b border-gray-100' : ''}`}>
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4">Additional notes (optional)</h2>
                  <textarea
                    placeholder="Is there anything the clinic should know? (e.g., symptoms, concerns, special requirements)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border border-gray-200 p-4 rounded-xl min-h-32 resize-none focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">Back</button>
                  <button onClick={handleSubmit} className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-[#FEA08E] transition">Confirm Booking</button>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Clinic Details</h3>
              <h4 className="font-semibold text-gray-900 mb-3">{clinic.name}</h4>
              <div className="space-y-3 text-sm">
                {[
                  { icon: FaLocationDot, value: clinic.address },
                  { icon: FaPhoneAlt, value: clinic.contact_number },
                  { icon: FaClock, value: clinic.hours }
                ].filter(item => item.value).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-gray-700">
                    <item.icon className={`${idx === 0 ? 'mt-1' : ''} text-primary shrink-0`} />
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-900"><strong>Note:</strong> The clinic will confirm your appointment within 24 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}