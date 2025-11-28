import { RiPinDistanceFill } from "react-icons/ri";
import { FaLocationDot, FaClock, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BsGrid3X3Gap } from "react-icons/bs";
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
  const [showAllPhotos, setShowAllPhotos] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const descRef = React.useRef(null);

  // Get clinic images array
  const clinicImages = clinic?.clinic_images || [];
  const hasMultipleImages = clinicImages.length > 1;

  React.useEffect(() => {
    const checkOverflow = () => {
      const el = descRef.current;
      if (el) {
        const clampLines = window.innerWidth >= 768 ? 4 : 3;
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
        const maxHeight = clampLines * lineHeight;
        setIsOverflowing(el.scrollHeight > maxHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  React.useEffect(() => {
    if (showAllPhotos) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAllPhotos]);

  if (!clinic) {
    const clinics = JSON.parse(localStorage.getItem("clinics") || "[]");
    clinic = clinics?.find(c => slugify(c.name) === slug);
  }

  if (!clinic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-500 mb-4">Clinic details not available.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-3 rounded-xl bg-primary text-white font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  const toggleLike = () => {
    setLiked((prev) => !prev);
    if (onLike) onLike(clinic.id);
  };

  const getImageUrl = (imageObj) => {
    if (typeof imageObj === 'string') return imageObj;
    return imageObj?.link || imageObj?.directLink || imageObj?.viewLink || '/placeholder-clinic.jpg';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % clinicImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + clinicImages.length) % clinicImages.length);
  };

  return (
    <main className="bg-white">
      <div className="sticky top-0 hidden md:block z-9999">
        <Navbar />
      </div>

      {/* Photo Gallery Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-white z-9999 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center sm:justify-between">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
            >
              <IoClose className="text-2xl" />
              <span className="hidden sm:inline">Close</span>
            </button>
            <h2 className="text-lg font-semibold">All photos</h2>
            <div className="hidden sm:inline sm:w-20"></div>
          </div>
          
          <div className="max-w-5xl mx-auto px-4 py-4 sm:py-8 grid grid-cols-1 gap-4">
            {clinicImages.map((image, index) => (
              <img
                key={index}
                src={getImageUrl(image)}
                alt={`${clinic.name} - Photo ${index + 1}`}
                className="w-full rounded-lg object-cover"
                style={{ maxHeight: '80vh' }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-[1120px] mx-auto px-4 md:px-10">
        {/* Mobile Header */}
        <div className="z-100 py-4 bg-white sticky top-0 md:hidden flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaChevronLeft className="text-gray-700" />
          </button>
          <div className="flex items-center gap-3">
            <button onClick={toggleLike} className="p-2 hover:bg-gray-100 rounded-full transition">
              {liked ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-gray-700 text-xl" />}
            </button>
          </div>
        </div>

        {/* Desktop Header with Actions */}
        <div className="hidden md:flex items-start justify-between mb-6 pt-6">
          <h1 className="text-2xl font-semibold text-gray-900">{clinic.name}</h1>
          <div className="flex items-center gap-3">
            <button onClick={toggleLike} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition underline font-semibold">
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              <span className="text-sm">Like</span>
            </button>
          </div>
        </div>

        {/* Image Gallery Grid - Desktop */}
        {clinicImages.length > 0 && (
          <div className="hidden md:block mb-8">
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[480px] rounded-xl overflow-hidden">
              {/* Main large image */}
              <div className="col-span-2 row-span-2 relative group cursor-pointer">
                <img
                  src={getImageUrl(clinicImages[0])}
                  alt={`${clinic.name} - Main`}
                  className="w-full h-full object-cover"
                  onClick={() => setShowAllPhotos(true)}
                />
              </div>
              
              {/* Grid of smaller images */}
              {clinicImages.slice(1, 5).map((image, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <img
                    src={getImageUrl(image)}
                    alt={`${clinic.name} - Photo ${index + 2}`}
                    className="w-full h-full object-cover"
                    onClick={() => setShowAllPhotos(true)}
                  />
                  {index === 3 && clinicImages.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">+{clinicImages.length - 5} more</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {clinicImages.length > 1 && (
              <button
                onClick={() => setShowAllPhotos(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2 border text-gray-500 border-gray-200 hover:border-primary hover:text-primary rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                <BsGrid3X3Gap />
                <span>Show all photos</span>
              </button>
            )}
          </div>
        )}

        {/* Image Gallery Carousel - Mobile */}
        {clinicImages.length > 0 && (
          <div className="md:hidden relative mb-6">
            <div className="relative w-full h-72 rounded-xl overflow-hidden">
              <img
                src={getImageUrl(clinicImages[currentImageIndex])}
                alt={`${clinic.name} - Photo ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition"
                  >
                    <FaChevronLeft className="text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition"
                  >
                    <FaChevronRight className="text-gray-800" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {clinicImages.length}
                  </div>
                </>
              )}
            </div>
            
            {hasMultipleImages && (
              <button
                onClick={() => setShowAllPhotos(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2 border text-gray-500 border-gray-200 hover:border-primary hover:text-primary rounded-lg hover:bg-gray-50 transition font-semibold w-full justify-center"
              >
                <BsGrid3X3Gap />
                <span>Show all {clinicImages.length} photos</span>
              </button>
            )}
          </div>
        )}

        {/* Mobile Title */}
        <h1 className="md:hidden text-2xl font-semibold text-gray-900 mb-4">{clinic.name}</h1>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="pb-8 border-b border-gray-200">
              <div className="space-y-4">
                {clinic.distance && (
                  <div className="flex items-center gap-3">
                    <RiPinDistanceFill className="text-gray-700 text-xl" />
                    <span className="text-gray-700">{clinic.distance}</span>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <FaLocationDot className="text-gray-700 text-xl mt-1 shrink-0" />
                  <span className="text-gray-700">{clinic.address}</span>
                </div>
                
                {clinic.hours && (
                  <div className="flex items-center gap-3">
                    <FaClock className="text-gray-700 text-xl" />
                    <span className="text-gray-700 font-medium">{clinic.hours}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            {clinic.services && clinic.services.length > 0 && (
              <div className="pb-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Services Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {clinic.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-200"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* { Services placeholders } */}
            <div className="pb-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Services Offered</h2>
              <div className="flex flex-wrap gap-2">
                {["General Checkup", "Vaccinations", "Emergency Services", "Grooming", "Diagnostics"].map((service, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-200"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="pb-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this clinic</h2>
              <p
                ref={descRef}
                className={`text-gray-700 leading-relaxed ${!isExpanded && "line-clamp-4"}`}
              >
                {clinic.description || "No description available for this clinic."}
              </p>
              {isOverflowing && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-3 font-semibold underline hover:text-gray-900 transition"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>

            {/* Map */}
            <div className="pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Where you'll find us</h2>
              <div className="rounded-xl overflow-hidden h-[400px] border border-gray-200">
                <iframe
                  title="clinic-map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(clinic.address)}&output=embed`}
                ></iframe>
              </div>
              <p className="text-gray-700 mt-4">{clinic.address}</p>
            </div>
          </div>

          {/* Booking Card - Desktop Sticky */}
          <div className="hidden lg:block">
            <div className="sticky top-24 border border-gray-200 rounded-xl p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Book an appointment</h3>
                <p className="text-gray-600 text-sm">Schedule a visit for your pet</p>
              </div>
              
              <button
                onClick={() => navigate(`/pet-owner/clinics/${slugify(clinic.name)}/book`, { state: { clinic } })}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-[#FEA08E] transition"
              >
                Book appointment
              </button>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                You won't be charged yet
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-50">
        <button
          onClick={() => navigate(`/pet-owner/clinics/${slugify(clinic.name)}/book`, { state: { clinic } })}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-[#FEA08E] transition"
        >
          Book appointment
        </button>
      </div>

      {/* Mobile spacing for fixed button */}
      <div className="lg:hidden h-20"></div>
    </main>
  );
}