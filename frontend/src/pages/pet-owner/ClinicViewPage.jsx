import { RiPinDistanceFill } from "react-icons/ri";
import { FaLocationDot, FaClock } from "react-icons/fa6";
import { FaRegHeart, FaHeart, FaChevronLeft } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { slugify } from "../../utils/slugify";
import Navbar from "../../components/Navbar.jsx";
import React from "react";

export default function ClinicViewPage({ onLike }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  let clinic = location.state?.clinic;

  const [liked, setLiked] = React.useState(clinic?.liked || false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const descRef = React.useRef(null);

  React.useEffect(() => {
    const checkOverflow = () => {
      const el = descRef.current;
      if (el) {
        const clampLines = window.innerWidth >= 768 ? 4 : 3; // md breakpoint
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight);

        const maxHeight = clampLines * lineHeight;
        setIsOverflowing(el.scrollHeight > maxHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  if (!clinic) {
    const clinics = JSON.parse(localStorage.getItem("clinics"));
    clinic = clinics?.find(c => slugify(c.name) === slug);
  }

  if (!clinic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-500 mb-4">Clinic details not available.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-xl bg-primary text-white font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  const toggleLike = () => {
    setLiked((prev) => !prev);

    if (onLike) onLike(clinic.id);
    console.log("Liked clinic with ID:", clinic.id);
  };

  return (
    <main>
      <div className="hidden sm:block">
        <Navbar />
      </div>

      <div className="min-h-screen bg-white flex flex-col">
        {/* Back Button (For Mobile Only) */}
        <button
          onClick={() => navigate(-1)}
          className="top-4 sm:hidden fixed left-4 z-50 flex items-center gap-2 bg-white/90 border border-gray-300 p-3 rounded-full backdrop-blur-sm hover:bg-gray-200 transition"
        >
          <FaChevronLeft className="text-gray-500" />
        </button>

        {/* Like Button (For Mobile Only) */}
        <button
          onClick={toggleLike}
          className="top-4 sm:hidden fixed right-4 z-50 flex items-center gap-2 bg-white/90 border border-gray-300 p-3 rounded-full backdrop-blur-sm hover:bg-gray-200 transition"
        >
          {liked ? (<FaHeart className="text-red-500" />) : (<FaRegHeart className="text-gray-500" />)}
        </button>

        {/* Image */}
        <img
          src={clinic.image}
          alt={clinic.name}
          className="w-full h-72 object-cover bg-gray-200 rounded-b-2xl md:rounded-xl md:mt-6 md:max-w-[1100px] md:mx-auto"
        />

        {/* Content */}
        <div className="flex-1 w-full max-w-[1100px] mx-auto px-6 py-8 space-y-10 pb-28 md:pb-14">

          {/* Header + Desktop CTA */}
          <div className="flex justify-between w-full flex-col md:flex-row gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
              {clinic.name}
            </h1>

            <button 
              className="hidden md:inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#FEA08E] transition"
              onClick={() => navigate(`/pet-owner/clinics/${slugify(clinic.name)}/book`, { state: { clinic } })}
            >
              Book appointment
            </button>
          </div>

          {/* Info Card */}
          <div className="rounded-2xl bg-gray-50 p-6 space-y-4 border border-gray-300">

            {/* Distance */}
            <div className="flex items-start gap-3">
              <RiPinDistanceFill className="text-primary h-5 w-5 shrink-0" />
              <p className="text-gray-700">{clinic.distance}</p>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <FaLocationDot className="text-primary h-5 w-5 shrink-0 mt-1" />
              <p className="text-gray-700 leading-snug">{clinic.address}</p>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3">
              <FaClock className="text-primary h-5 w-5 shrink-0" />
              <p className="text-gray-700 font-medium">{clinic.hours}</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-4 text-lg">Services Offered</h2>
            <div className="flex flex-wrap gap-3">
              {clinic.services?.map((service, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-4 text-lg">About this clinic</h2>

            <p
              ref={descRef}
              className={`text-gray-700 leading-relaxed tracking-wide transition-all duration-300 ${isExpanded ? "line-clamp-none" : "line-clamp-3"}`}>
              {clinic.description || "No description available for this clinic."}
            </p>

            {isOverflowing && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-primary font-medium hover:underline"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Map */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-4 text-lg">Location Map</h2>
            <div className="rounded-2xl overflow-hidden h-64 border border-gray-300">
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

        {/* Mobile CTA */}
        <div className="md:hidden fixed bottom-0 w-full bg-white p-4 border-t border-gray-300">
          <button 
            className="w-full bg-primary text-white py-2 rounded-xl font-semibold"
              onClick={() => navigate(`/pet-owner/clinics/${slugify(clinic.name)}/book`, { state: { clinic } })}
            >
            Book appointment
          </button>
        </div>
      </div>
    </main>
  );
}
