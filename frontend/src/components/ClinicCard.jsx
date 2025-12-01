import { useState } from "react";
import { FaRegHeart, FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify";
import DriveImage from "./DriveImage";

export default function ClinicCard({ clinic, onLike }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all clinic images or use placeholder
  const images = clinic.clinic_images?.length > 0 
    ? clinic.clinic_images 
    : [{ link: clinic.image || "/clinic-placeholder.jpg", name: "Clinic" }];

  const goToClinic = () => {
    const slug = slugify(clinic.name);
    navigate(`/clinics/${slug}`, { state: { clinic } });
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      onClick={goToClinic}
      className="bg-white border border-gray-200 p-4 rounded-xl hover:bg-gray-50 flex flex-col h-full transition ease-in duration-300 cursor-pointer"
    >
      {/* Image Carousel */}
      <div className="overflow-hidden rounded-md mb-4 relative group">
        <div className="relative w-full h-52 bg-gray-300 rounded-lg">
          {images[currentImageIndex]?.link ? (
            images[currentImageIndex].link.startsWith('http') ? (
              <DriveImage
                image={images[currentImageIndex]}
                alt={clinic.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <img
                src={images[currentImageIndex].link}
                alt={clinic.name}
                className="w-full h-full object-cover rounded-lg"
              />
            )
          ) : (
            <img
              src="/clinic-placeholder.jpg"
              alt={clinic.name}
              className="w-full h-full object-cover rounded-lg"
            />
          )}

          {/* Carousel Navigation - Only show if multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex
                        ? "bg-white w-4"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-1">{clinic.name}</h3>
      <p className="text-gray-600">{clinic.distance}</p>
      <p className="text-gray-600">{clinic.address}</p>
      <p className="text-gray-600 font-semibold">{clinic.hours}</p>

      <div className="flex flex-wrap gap-2 my-3">
        {clinic.services?.slice(0, 4).map((service, index) => (
          <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
            {service}
          </span>
        ))}
        {clinic.services?.length > 4 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            +{clinic.services.length - 4} more
          </span>
        )}
      </div>

      {/* Prevent button click from triggering card navigation */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex justify-end items-center mt-auto"
      >
        <button
          className="w-full bg-primary text-white px-4 py-2 rounded-xl hover:bg-[#FEA08E] transition"
          onClick={() => navigate(`/pet-owner/clinics/${slugify(clinic.name)}/book`, { state: { clinic } })}
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