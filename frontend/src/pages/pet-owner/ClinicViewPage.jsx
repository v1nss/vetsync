import { RiPinDistanceFill } from "react-icons/ri";
import { FaLocationDot, FaClock, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FaRegHeart, FaHeart, FaPhoneAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BsGrid3X3Gap } from "react-icons/bs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { slugify } from "../../utils/slugify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import React, {useEffect, useState} from "react";
import { fetchClinicById } from "../../global/api/clinic";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon for clinic
const createClinicIcon = () => {
  return L.divIcon({
    className: 'clinic-marker',
    html: `<div style="background-color: #FF6B6B; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 4px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

// Component to handle map initialization
function MapController({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 15);
    }
  }, [map, center]);

  return null;
}

export default function ClinicViewPage({ onLike }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [clinic, setClinic] = React.useState(location.state?.clinic);
  const [loading, setLoading] = React.useState(false);
  const [liked, setLiked] = React.useState(clinic?.liked || false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const [showAllPhotos, setShowAllPhotos] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const descRef = React.useRef(null);

  const clinicImages = clinic?.clinic_images || [];
  const hasMultipleImages = clinicImages.length > 1;

  useEffect(() => {
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

  useEffect(() => {
    if (showAllPhotos) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAllPhotos]);

  useEffect(() => {
    const loadClinicData = async () => {
      let currentClinic = location.state?.clinic;
      const clinicId = currentClinic.clinic_id || currentClinic.id;
      
      const hasSchedules = currentClinic?.schedules && Array.isArray(currentClinic.schedules) && currentClinic.schedules.length > 0;
      const hasService = (currentClinic?.service && (Array.isArray(currentClinic.service) ? currentClinic.service.length > 0 : true)) ||
                         (currentClinic?.services && (Array.isArray(currentClinic.services) ? currentClinic.services.length > 0 : true));
      
      if (clinicId && (!hasSchedules || !hasService)) {
        try {
          setLoading(true);
          const fullClinicData = await fetchClinicById(clinicId);
          if (fullClinicData) {
            setClinic(fullClinicData);
          } else {
            setClinic(currentClinic);
          }
        } catch (error) {
          console.error("Failed to fetch full clinic details:", error);
          setClinic(currentClinic);
        } finally {
          setLoading(false);
        }
      } else {
        setClinic(currentClinic);
      }
    };

    loadClinicData();
  }, [slug]);

  useEffect(() => {
    if (clinic) {
      setLiked(clinic.liked || false);
    }
  }, [clinic]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading clinic details...</p>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-500 mb-4">Clinic details not available.</p>
        <button onClick={() => navigate(-1)} className="px-4 py-3 rounded-xl bg-primary text-white font-medium">
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

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatAddress = (address, addressString) => {
    if (typeof address === 'string') return address;
    if (address && typeof address === 'object') {
      const parts = [address.street, address.barangay, address.city, address.province, address.zipcode].filter(Boolean);
      let formattedAddress = parts.join(', ');
      if (address.landmark) formattedAddress += ` (${address.landmark})`;
      return formattedAddress || addressString || 'Address not available';
    }
    return addressString || 'Address not available';
  };

  const displayAddress = clinic ? formatAddress(clinic.address, clinic.address_string) : 'Address not available';
  const displayNumber = clinic?.contact_number || 'Contact number not available';

  // Get clinic coordinates
  const getClinicCoordinates = () => {
    if (!clinic) return null;
    
    // Check if latitude/longitude are in clinic.address object
    if (clinic.address && typeof clinic.address === 'object') {
      if (clinic.address.latitude && clinic.address.longitude) {
        return [parseFloat(clinic.address.latitude), parseFloat(clinic.address.longitude)];
      }
    }
    
    // Check if latitude/longitude are directly on clinic object
    if (clinic.latitude && clinic.longitude) {
      return [parseFloat(clinic.latitude), parseFloat(clinic.longitude)];
    }
    
    return null;
  };

  const clinicCoordinates = getClinicCoordinates();
  const defaultCenter = [14.5995, 120.9842]; // Default to Manila, Philippines
  const mapCenter = clinicCoordinates || defaultCenter;

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

      {showAllPhotos && (
        <div className="fixed inset-0 bg-white z-9999 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center sm:justify-between">
            <button onClick={() => setShowAllPhotos(false)} className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition">
              <IoClose className="text-2xl" />
              <span className="hidden sm:inline">Close</span>
            </button>
            <h2 className="text-lg font-semibold">All photos</h2>
            <div className="hidden sm:inline sm:w-20"></div>
          </div>
          
          <div className="max-w-5xl mx-auto px-4 py-4 sm:py-8 grid grid-cols-1 gap-4">
            {clinicImages.map((image, index) => (
              <img key={index} src={getImageUrl(image)} alt={`${clinic.name} - Photo ${index + 1}`}
                className="w-full rounded-lg object-cover max-h-[80vh]" />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-[1120px] mx-auto px-4 md:px-10">
        <div className="z-100 py-4 bg-white sticky top-0 md:hidden flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <FaChevronLeft className="text-gray-700" />
          </button>
          <div className="flex items-center gap-3">
            <button onClick={toggleLike} className="p-2 hover:bg-gray-100 rounded-full transition">
              {liked ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-gray-700 text-xl" />}
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-start justify-between mb-6 pt-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 p-2 hover:gap-4 rounded-full transition">
            <FaChevronLeft className="text-gray-700" />
            <span className="text-2xl font-semibold text-gray-900">{clinic.name}</span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={toggleLike} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition underline font-semibold">
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              <span className="text-sm">Like</span>
            </button>
          </div>
        </div>

        {clinicImages.length > 0 && (
          <div className="hidden md:block mb-8">
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[480px] rounded-xl overflow-hidden">
              <div className="col-span-2 row-span-2 relative group cursor-pointer">
                <img src={getImageUrl(clinicImages[0])} alt={`${clinic.name} - Main`}
                  className="w-full h-full object-cover" onClick={() => setShowAllPhotos(true)} />
              </div>
              
              {clinicImages.slice(1, 5).map((image, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <img src={getImageUrl(image)} alt={`${clinic.name} - Photo ${index + 2}`}
                    className="w-full h-full object-cover" onClick={() => setShowAllPhotos(true)} />
                  {index === 3 && clinicImages.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">+{clinicImages.length - 5} more</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {clinicImages.length > 1 && (
              <button onClick={() => setShowAllPhotos(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2 border text-gray-500 border-gray-200 hover:border-primary hover:text-primary rounded-lg hover:bg-gray-50 transition font-semibold">
                <BsGrid3X3Gap />
                <span>Show all photos</span>
              </button>
            )}
          </div>
        )}

        {clinicImages.length > 0 && (
          <div className="md:hidden relative mb-6">
            <div className="relative w-full h-72 rounded-xl overflow-hidden">
              <img src={getImageUrl(clinicImages[currentImageIndex])} alt={`${clinic.name} - Photo ${currentImageIndex + 1}`}
                className="w-full h-full object-cover" />
              
              {hasMultipleImages && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition">
                    <FaChevronLeft className="text-gray-800" />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition">
                    <FaChevronRight className="text-gray-800" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {clinicImages.length}
                  </div>
                </>
              )}
            </div>
            
            {hasMultipleImages && (
              <button onClick={() => setShowAllPhotos(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2 border text-gray-500 border-gray-200 hover:border-primary hover:text-primary rounded-lg hover:bg-gray-50 transition font-semibold w-full justify-center">
                <BsGrid3X3Gap />
                <span>Show all {clinicImages.length} photos</span>
              </button>
            )}
          </div>
        )}

        <h1 className="md:hidden text-2xl font-semibold text-gray-900 mb-4">{clinic.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
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
                  <span className="text-gray-700">{displayAddress}</span>
                </div>
                <div className="flex items-start gap-3">
                  <FaPhoneAlt className="text-gray-700 text-xl mt-1 shrink-0" />
                  <span className="text-gray-700">{displayNumber}</span>
                </div>
                {/* Note */}
                <div className="flex lg:hidden p-4 rounded-xl border border-blue-300 bg-blue-100 text-xs text-blue-900">
                  <p><strong>Note:</strong> Prices may vary per clinic. The displayed price range may change after the pet’s consultation, depending on the pet’s condition and the services required.</p>
                </div>  
              </div>
            </div>



            {/* Mobile Operating Hours - Only shown on mobile */}
            {clinic.schedules && Array.isArray(clinic.schedules) && clinic.schedules.length > 0 && (
              <div className="lg:hidden pb-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Operating Hours</h2>
                <div className="space-y-2">
                  {clinic.schedules.map((schedule, idx) => {
                    const dayName = schedule.day_of_week.charAt(0).toUpperCase() + schedule.day_of_week.slice(1);
                    const isClosed = schedule.is_closed || false;
                    const openTime = schedule.open_time ? formatTime(schedule.open_time) : '';
                    const closeTime = schedule.close_time ? formatTime(schedule.close_time) : '';
                    
                    return (
                      <div key={idx} className="flex items-center justify-between text-gray-700 py-2">
                        <span className="font-medium">{dayName}</span>
                        {isClosed ? (
                          <span className="text-gray-500">Closed</span>
                        ) : openTime && closeTime ? (
                          <span>{openTime} - {closeTime}</span>
                        ) : (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {(() => {
              let services = [];
              if (clinic.service && Array.isArray(clinic.service)) {
                services = clinic.service;
              } else if (clinic.services && Array.isArray(clinic.services)) {
                services = clinic.services;
              } else if (clinic.service && typeof clinic.service === 'string') {
                try { services = JSON.parse(clinic.service); } catch { services = []; }
              } else if (clinic.services && typeof clinic.services === 'string') {
                try { services = JSON.parse(clinic.services); } catch { services = []; }
              }
              
              return services.length > 0 ? (
                <div className="pb-8 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Services Offered</h2>
                  <div className="flex flex-wrap gap-2">
                    {services.map((service, index) => (
                      <span key={index} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-200">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* Veterinarians Section */}
            {clinic.vets && Array.isArray(clinic.vets) && clinic.vets.length > 0 && (
              <div className="pb-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Veterinarians</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {clinic.vets.map((vet, index) => {
                    const vetName = vet.User 
                      ? `${vet.User.first_name || ''} ${vet.User.last_name || ''}`.trim()
                      : 'Veterinarian';
                    const profileImage = vet.User?.profile_image_url;
                    
                    return (
                      <div key={vet.user_id || index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
                          {profileImage ? (
                            <img 
                              src={getImageUrl(profileImage)} 
                              alt={vetName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center text-gray-400 text-xl font-semibold ${profileImage ? 'hidden' : ''}`}>
                            {vetName.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {vet.specialization ? `Dr. ${vetName}` : vetName}
                          </h3>
                          {vet.specialization && (
                            <p className="text-sm text-gray-600 truncate">{vet.specialization}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pb-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this clinic</h2>
              <p ref={descRef} className={`text-gray-700 leading-relaxed ${!isExpanded && "line-clamp-4"}`}>
                {clinic.description || "No description available for this clinic."}
              </p>
              {isOverflowing && (
                <button onClick={() => setIsExpanded(!isExpanded)} className="mt-3 font-semibold underline hover:text-gray-900 transition">
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>

            <div className="pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Where you'll find us</h2>
              <div className="rounded-xl overflow-hidden h-[400px] border border-gray-200">
                {clinicCoordinates ? (
                  <MapContainer
                    center={mapCenter}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                      attribution="© CartoDB & OSM contributors"
                    />
                    <MapController center={mapCenter} />
                    <Marker
                      position={clinicCoordinates}
                      icon={createClinicIcon()}
                    />
                  </MapContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center p-6">
                      <FaLocationDot className="text-gray-400 text-4xl mx-auto mb-2" />
                      <p className="text-gray-600">Map location not available</p>
                      <p className="text-sm text-gray-500 mt-2">{displayAddress}</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-gray-700 mt-4">{displayAddress}</p>
            </div>
          </div>

          {/* Booking Card - Desktop with Schedule */}
          <div className="hidden lg:block">
            <div className="sticky top-24 border border-gray-200 rounded-xl p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Book an appointment</h3>
                <p className="text-gray-600 text-sm">Schedule a visit for your pet</p>
              </div>

              {/* Operating Hours in Booking Card */}
              {clinic.schedules && Array.isArray(clinic.schedules) && clinic.schedules.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FaClock className="text-gray-700 text-lg" />
                    <h4 className="font-semibold text-gray-900">Operating Hours</h4>
                  </div>
                  <div className="space-y-2">
                    {clinic.schedules.map((schedule, idx) => {
                      const dayName = schedule.day_of_week.charAt(0).toUpperCase() + schedule.day_of_week.slice(1);
                      const isClosed = schedule.is_closed || false;
                      const openTime = schedule.open_time ? formatTime(schedule.open_time) : '';
                      const closeTime = schedule.close_time ? formatTime(schedule.close_time) : '';
                      
                      return (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{dayName}</span>
                          {isClosed ? (
                            <span className="text-gray-500">Closed</span>
                          ) : openTime && closeTime ? (
                            <span className="text-gray-600">{openTime} - {closeTime}</span>
                          ) : (
                            <span className="text-gray-400 italic">Not set</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <button onClick={() => navigate(`/pet-owner/clinics/${slugify(clinic.name)}/book`, { state: { clinic } })}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-[#FEA08E] transition">
                Book appointment
              </button>
              
              {/* Note */}
              <div className="p-4 rounded-xl border border-blue-300 bg-blue-100 text-xs text-blue-900">
                <p><strong>Note:</strong> Prices may vary per clinic. The displayed price range may change after the pet’s consultation, depending on the pet’s condition and the services required.</p>
              </div>  
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-9999">
        <button onClick={() => navigate(`/pet-owner/clinics/${slugify(clinic.name)}/book`, { state: { clinic } })}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-[#FEA08E] transition">
          Book appointment
        </button>
      </div>

      <div className="lg:hidden h-20"></div>
      
    </main>
  );
}