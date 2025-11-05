import { FaTimes } from "react-icons/fa";
import { RiPinDistanceFill } from "react-icons/ri";
import { FaLocationDot, FaClock } from "react-icons/fa6";
import { useEffect, useState } from "react";

export default function ClinicViewModal({ clinic, onClose }) {
  const [closing, setClosing] = useState(false);

  if (!clinic && !closing) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 350);
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "overlay") handleClose();
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      id="overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center sm:p-4 backdrop-blur-sm"
    >
      <div className="relative bg-white h-full sm:h-auto sm:rounded-2xl w-full sm:max-w-2xl sm:max-h-[90vh] overflow-y-auto shadow-xl animate-slide-down">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
        >
          <FaTimes />
        </button>

        {/* Clinic image */}
        <img
          src={clinic.image}
          alt={clinic.name}
          className="w-full h-72 object-cover rounded-t-2xl bg-gray-200"
        />

        <div className="flex flex-col h-auto ">
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            <h2 className="text-2xl font-semibold">{clinic.name}</h2>
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <div className="flex items-center gap-2">
                <RiPinDistanceFill />
                <span>{clinic.distance}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <div className="flex items-center gap-2">
                <FaLocationDot />
                <span>{clinic.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <div className="flex items-center gap-2">
                <FaClock />
                <span>{clinic.hours}</span>
              </div>
            </div>

            <h3 className="font-semibold mt-4 mb-2">Available Services</h3>
            <div className="flex flex-wrap gap-2">
              {clinic.services?.map((service, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
                >
                  {service}
                </span>
              ))}
            </div>

            {/* Map preview */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Location</h3>
              <div className="rounded-xl overflow-hidden border border-gray-300 h-60">
                <iframe
                  title="clinic-map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    clinic.address
                  )}&output=embed`}
                ></iframe>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 left-0 w-full bg-white p-4 border-t border-gray-200 sm:rounded-b-2xl">
            <button className="w-full bg-primary text-white py-3 rounded-xl hover:bg-[#FEA08E] transition font-semibold">
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
