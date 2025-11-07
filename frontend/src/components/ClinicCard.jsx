import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify";

export default function ClinicCard({ clinic, onLike }) {
  const navigate = useNavigate();

  const goToClinic = () => {
    const slug = slugify(clinic.name);
    navigate(`/${slug}`, { state: { clinic } });
  };

  return (
    <div
      onClick={goToClinic}
      className="bg-white border border-gray-200 p-4 rounded-xl hover:bg-gray-50 flex flex-col h-full transition ease-in duration-300 cursor-pointer"
    >
      <div className="overflow-hidden rounded-md">
        <img
          src={clinic.image}
          alt="Vet Clinic"
          className="w-full bg-gray-300 h-52 object-cover rounded-lg mb-4"
        />
      </div>

      <h3 className="text-lg font-semibold mb-1">{clinic.name}</h3>
      <p className="text-gray-600">{clinic.distance}</p>
      <p className="text-gray-600">{clinic.address}</p>
      <p className="text-gray-600 font-semibold">{clinic.hours}</p>

      <div className="flex flex-wrap gap-2 my-3">
        {clinic.services?.map((service, index) => (
          <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
            {service}
          </span>
        ))}
      </div>

      {/* Prevent button click from triggering card navigation */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex justify-end items-center mt-auto"
      >
        <button
          className="w-full bg-primary text-white px-4 py-2 rounded-xl hover:bg-[#FEA08E] transition"
          onClick={() => navigate(`/${slugify(clinic.name)}/book`, { state: { clinic } })}
        >
          Book Appointment
        </button>

        <button
          className="ml-2 border border-gray-300 bg-white text-black px-4 py-3 rounded-xl hover:bg-gray-100 transition"
          onClick={onLike}
        >
          {clinic.liked ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-500" />}
        </button>
      </div>
    </div>
  );
}
