import { FaTimes } from "react-icons/fa";

export default function ClinicView({ clinic, onClose }) {
    if (!clinic) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
                >
                    <FaTimes />
                </button>

                {/* Clinic image */}
                <img
                    src={clinic.image}
                    alt={clinic.name}
                    className="w-full h-56 object-cover rounded-t-2xl"
                />

                <div className="p-6 space-y-3">
                    <h2 className="text-2xl font-bold">{clinic.name}</h2>
                    <p className="text-gray-600">{clinic.address}</p>
                    <p className="font-semibold text-green-600">{clinic.hours}</p>

                    <h3 className="font-semibold mt-4">Available Services</h3>
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
                    <div className="mt-6 rounded-xl overflow-hidden border h-60">
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

                    <button className="w-full bg-primary hover:bg-[#FEA08E] text-white py-3 rounded-xl font-semibold mt-6">
                        Book Appointment
                    </button>
                </div>
            </div>
        </div>
    );
}
