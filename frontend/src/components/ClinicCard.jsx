import { FaRegHeart, FaHeart } from "react-icons/fa";

export default function ClinicCard({ clinic, onLike, onOpen }) {
  return (
    <div
      onClick={onOpen}
      className="bg-white border border-gray-200 hover:scale-105 p-4 rounded-xl shadow-md flex flex-col h-full transition ease-in duration-300 cursor-pointer"
    >
      <div className="overflow-hidden rounded-md">
        <img
          src={clinic.image}
          alt="Vet Clinic"
          className="w-full bg-gray-300 h-52 object-cover rounded-lg mb-4"
        />
      </div>

      <div className="mb-2">
        <h3 className="text-lg font-semibold mb-2">{clinic.name}</h3>
        <span className="text-gray-600">{clinic.distance}</span>
        <p className="text-gray-600">{clinic.address}</p>
        <span className="text-gray-600 mb-4 block">
          <strong>{clinic.hours}</strong>
        </span>

        <div className="flex flex-wrap gap-2 mt-2">
          {clinic.services?.map((service, index) => (
              <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
              >
                  {service}
              </span>
          ))}
        </div>
      </div>

      <div
        className="flex justify-end items-center mt-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="flex-1 bg-primary text-white px-4 py-2 rounded-xl hover:bg-[#FEA08E] transition">
          Book Appointment
        </button>

        <button
          className="ml-2 border border-gray-300 bg-white text-black px-4 py-3 rounded-xl hover:bg-gray-100 transition"
          onClick={onLike}
        >
          {clinic.liked ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
}