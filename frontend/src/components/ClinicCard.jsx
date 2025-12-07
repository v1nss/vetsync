import { useState } from "react";
import { FaRegHeart, FaHeart, FaChevronLeft, FaChevronRight, FaClock, FaPhone } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify";
import DriveImage from "./DriveImage";
import { fetchClinicById } from "../global/api/clinic";

export default function ClinicCard({ clinic, onLike }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Get all clinic images or use placeholder
  const images = clinic.clinic_images?.length > 0 
    ? clinic.clinic_images 
    : [{ link: clinic.image || "/clinic-placeholder.jpg", name: "Clinic" }];

  // Format address
  const formatAddress = (address, addressString) => {
    if (typeof address === 'string') return address;
    if (address && typeof address === 'object') {
      const parts = [address.street, address.barangay, address.city, address.province].filter(Boolean);
      return parts.join(', ') || addressString || 'Address not available';
    }
    return addressString || 'Address not available';
  };

  const displayAddress = formatAddress(clinic.address, clinic.address_string);

  // Get services array - same logic as ClinicViewPage
  const getServices = () => {
    let services = [];
    if (clinic.service && Array.isArray(clinic.service)) {
      services = clinic.service;
    } else if (clinic.services && Array.isArray(clinic.services)) {
      services = clinic.services;
    } else if (clinic.service && typeof clinic.service === 'string') {
      try {
        services = JSON.parse(clinic.service);
      } catch {
        services = [];
      }
    } else if (clinic.services && typeof clinic.services === 'string') {
      try {
        services = JSON.parse(clinic.services);
      } catch {
        services = [];
      }
    }
    return services;
  };

  const services = getServices();

  // Get today's schedule
  const getTodaySchedule = () => {
    if (!clinic.schedules || !Array.isArray(clinic.schedules)) return null;
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    const schedule = clinic.schedules.find(s => s.day_of_week === today);
    
    if (!schedule) return null;
    if (schedule.is_closed) return 'Closed today';
    if (schedule.open_time && schedule.close_time) {
      const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      };
      return `${formatTime(schedule.open_time)} - ${formatTime(schedule.close_time)}`;
    }
    return clinic.hours || 'Hours not available';
  };

  const todaySchedule = getTodaySchedule();

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

  const handleBookAppointment = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      const clinicId = clinic.clinic_id || clinic.id;
      const fullClinicData = await fetchClinicById(clinicId);
      
      navigate(`/pet-owner/clinics/${slugify(clinic.name)}/book`, { 
        state: { clinic: fullClinicData || clinic } 
      });
    } catch (error) {
      console.error("Failed to fetch clinic details:", error);
      navigate(`/pet-owner/clinics/${slugify(clinic.name)}/book`, { 
        state: { clinic } 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={goToClinic}
      className="bg-white border border-gray-200 p-4 rounded-xl hover:border-primary flex flex-col h-full transition-all duration-300 cursor-pointer"
    >
      {/* Image Carousel */}
      <div className="overflow-hidden rounded-xl mb-4 relative group">
        <div className="relative w-full h-52 bg-gray-300 rounded-xl">
          {images[currentImageIndex]?.link ? (
            images[currentImageIndex].link.startsWith('http') ? (
              <DriveImage
                image={images[currentImageIndex]}
                alt={clinic.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <img
                src={images[currentImageIndex].link}
                alt={clinic.name}
                className="w-full h-full object-cover rounded-xl"
              />
            )
          ) : (
            <img
              src="/clinic-placeholder.jpg"
              alt={clinic.name}
              className="w-full h-full object-cover rounded-xl"
            />
          )}

          {/* Carousel Navigation - Only show if multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition opacity-0 group-hover:opacity-100 shadow-lg"
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition opacity-0 group-hover:opacity-100 shadow-lg"
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex
                        ? "bg-white w-6"
                        : "bg-white/60 hover:bg-white/80 w-1.5"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Clinic Info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{clinic.name}</h3>
          {clinic.distance && (
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
              {clinic.distance}
            </span>
          )}
        </div>

        {/* Address with icon */}
        <div className="flex items-start gap-2">
          <FaLocationDot className="text-gray-400 text-sm mt-0.5 shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-1" title={displayAddress}>
            {displayAddress}
          </p>
        </div>

        {/* Phone Number */}
        {clinic.contact_number && (
          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-400 text-xs" />
            <p className="text-sm text-gray-600">{clinic.contact_number}</p>
          </div>
        )}

        {/* Today's Schedule */}
        {todaySchedule && (
          <div className="flex items-center gap-2">
            <FaClock className="text-gray-400 text-sm" />
            <p className={`text-sm font-medium ${todaySchedule === 'Closed today' ? 'text-red-500' : 'text-gray-700'}`}>
              {todaySchedule}
            </p>
          </div>
        )}

        {/* Services Tags */}
        {services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {services.slice(0, 3).map((service, index) => (
              <span key={index} className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {service}
              </span>
            ))}
            {services.length > 3 && (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                +{services.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex gap-2 mt-2 pt-4"
      >
        <button
          className="flex-1 bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-[#FEA08E] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleBookAppointment}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Book Now"}
        </button>

        <button
          className="border border-gray-300 bg-white text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition"
          onClick={onLike}
          aria-label={clinic.liked ? "Unlike clinic" : "Like clinic"}
        >
          {clinic.liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>
      </div>
    </div>
  );
}