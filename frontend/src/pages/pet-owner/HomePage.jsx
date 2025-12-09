import { FaSearch, FaMapMarkerAlt, FaStar, FaClock } from "react-icons/fa";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ClinicCard from "../../components/ClinicCard";
import { fetchApprovedClinics } from "../../global/api/clinic";

export default function HomePage() {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [radius, setRadius] = useState(10);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [useDistanceFilter, setUseDistanceFilter] = useState(false);

    // Fetch clinics on component mount
    useEffect(() => {
        loadClinics();
    }, []);

    const loadClinics = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchApprovedClinics();
            // Transform API data to include ALL clinic fields
            const transformedClinics = data.map(clinic => ({
                // Keep all original fields
                ...clinic,
                // Ensure id is mapped correctly
                id: clinic.clinic_id || clinic.id,
                // Add liked property
                liked: false,
                // Ensure clinic_images is an array
                clinic_images: clinic.clinic_images || [],
                // Make sure services and schedules are included
                service: clinic.service,
                services: clinic.services,
                schedules: clinic.schedules,
                // Format address if needed
                address: clinic.address,
                address_string: clinic.address_string,
            }));
            
            setClinics(transformedClinics);
        } catch (err) {
            console.error("Failed to load clinics:", err);
            setError("Failed to load clinics. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = (id) => {
        setClinics(prevClinics =>
            prevClinics.map(clinic =>
                clinic.id === id ? { ...clinic, liked: !clinic.liked } : clinic
            )
        );
    };

    // Calculate distance between two coordinates using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    };

    // Format distance for display
    const formatDistance = (distanceInKm) => {
        if (distanceInKm < 1) {
            return `${Math.round(distanceInKm * 1000)}m`;
        }
        return `${distanceInKm.toFixed(1)}km`;
    };

    // Get clinic coordinates from address object
    const getClinicCoordinates = (clinic) => {
        if (clinic.address && typeof clinic.address === 'object') {
            if (clinic.address.latitude && clinic.address.longitude) {
                return {
                    lat: parseFloat(clinic.address.latitude),
                    lng: parseFloat(clinic.address.longitude)
                };
            }
        }
        return null;
    };

    function displayClinics() {
        const query = searchQuery.trim().toLowerCase();

        let filtered = clinics.map(clinic => {
            // Calculate distance if user location is available and clinic has coordinates
            let distance = null;
            let distanceInKm = null;
            
            if (userLocation && useDistanceFilter) {
                const clinicCoords = getClinicCoordinates(clinic);
                if (clinicCoords) {
                    distanceInKm = calculateDistance(
                        userLocation.lat,
                        userLocation.lng,
                        clinicCoords.lat,
                        clinicCoords.lng
                    );
                    distance = formatDistance(distanceInKm);
                }
            }

            return {
                ...clinic,
                distance,
                distanceInKm: distanceInKm || Infinity // Use Infinity for clinics without coordinates
            };
        });

        // Apply search filter
        if (query) {
            filtered = filtered.filter((clinic) => {
                const searchableText = [
                    clinic.name,
                    typeof clinic.address === 'string' ? clinic.address : '',
                    clinic.address_string || '',
                    clinic.description || ''
                ].join(' ').toLowerCase();
                
                return searchableText.includes(query);
            });
        }

        // Apply distance filter if enabled
        if (useDistanceFilter && userLocation) {
            filtered = filtered.filter((clinic) => {
                // Include clinics without coordinates or within radius
                return clinic.distanceInKm === Infinity || clinic.distanceInKm <= radius;
            });
        }

        // Sort clinics
        if (useDistanceFilter && userLocation) {
            // Sort by distance (closest first)
            filtered = filtered.sort((a, b) => {
                if (a.distanceInKm === Infinity && b.distanceInKm === Infinity) return 0;
                if (a.distanceInKm === Infinity) return 1;
                if (b.distanceInKm === Infinity) return -1;
                return a.distanceInKm - b.distanceInKm;
            });
        } else if (activeFilter === "Popular") {
            // Sort by number of likes
            filtered = filtered.sort((a, b) => (b.liked ? 1 : 0) - (a.liked ? 1 : 0));
        }

        if (filtered.length === 0) {
            return (
                <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">
                        {useDistanceFilter && userLocation 
                            ? `No clinics found within ${radius}km of your location.`
                            : "No clinics found matching your criteria."}
                    </p>
                    <button 
                        onClick={() => {
                            setSearchQuery("");
                            setActiveFilter("All");
                            setUseDistanceFilter(false);
                        }}
                        className="mt-4 text-primary hover:underline font-semibold"
                    >
                        Clear filters
                    </button>
                </div>
            );
        }

        return filtered.map((clinic) => (
            <ClinicCard
                key={clinic.id}
                clinic={clinic}
                onLike={() => toggleLike(clinic.id)}
            />
        ));
    }

    function handleDetectLocation() {
        if (!navigator.geolocation) {
            console.warn("Geolocation not supported");
            alert("Geolocation is not supported by your browser");
            return;
        }
        setIsDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ 
                    lat: pos.coords.latitude, 
                    lng: pos.coords.longitude 
                });
                setUseDistanceFilter(true);
                setIsDetectingLocation(false);
                console.log("Got location:", pos.coords.latitude, pos.coords.longitude);
            },
            (err) => {
                console.warn("Location error:", err.message);
                alert("Could not detect your location. Please enable location services.");
                setIsDetectingLocation(false);
            },
            { timeout: 8000, enableHighAccuracy: true }
        );
    }

    return (
        <div>
            <Navbar />
            <section className="min-h-screen pb-10">
                {/* Hero Section */}
                <div className="my-6">
                    <div className="bg-linear-to-r from-primary to-[#FFB49A] px-4 py-8 sm:px-6 sm:py-10 rounded-2xl shadow-lg">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                            <div className="text-white px-2 md:px-6">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                                    Your Pet's Health, Our Priority
                                </h1>
                                <p className="text-white/90 mb-6 max-w-xl">
                                    Find trusted veterinary clinics nearby. Book appointments, view services, and get care for your pet — all in one place.
                                </p>

                                <form 
                                    className="flex items-center gap-3 mb-4" 
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    <div className="flex items-center bg-white rounded-xl overflow-hidden flex-1">
                                        <input
                                            id="search"
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search clinics or addresses"
                                            className="text-black px-4 py-3 w-full focus:outline-none"
                                            aria-label="Search clinics"
                                        />
                                        <button 
                                            aria-label="Search" 
                                            className="group px-4 py-3 rounded-full" 
                                            type="submit"
                                        >
                                            <FaSearch className="text-gray-400 group-hover:text-gray-500" />
                                        </button>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={handleDetectLocation}
                                            className={`inline-flex items-center px-4 py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed ${
                                                userLocation && useDistanceFilter
                                                    ? 'bg-primary text-white hover:bg-[#FEA08E]'
                                                    : 'bg-white text-primary hover:bg-gray-100'
                                            }`}
                                            disabled={isDetectingLocation}
                                        >
                                            <FaMapMarkerAlt className={`my-1 lg:my-0 lg:mr-2 ${isDetectingLocation ? 'animate-pulse' : ''}`} />
                                            <span className="hidden lg:flex">
                                                {isDetectingLocation ? 'Detecting...' : userLocation && useDistanceFilter ? 'Location Active' : 'Use My Location'}
                                            </span>
                                        </button>
                                        {userLocation && useDistanceFilter && (
                                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl">
                                                <span className="text-xs text-gray-600">Within</span>
                                                <select
                                                    value={radius}
                                                    onChange={(e) => setRadius(Number(e.target.value))}
                                                    className="text-sm font-medium text-primary border-0 focus:outline-none cursor-pointer"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value={5}>5km</option>
                                                    <option value={10}>10km</option>
                                                    <option value={25}>25km</option>
                                                    <option value={50}>50km</option>
                                                    <option value={100}>100km</option>
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setUseDistanceFilter(false);
                                                        setUserLocation(null);
                                                    }}
                                                    className="text-xs text-gray-500 hover:text-gray-700"
                                                    title="Clear location filter"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </form>

                                <div className="flex justify-center sm:justify-start mt-6 gap-4">
                                    <button 
                                        onClick={() => {
                                            setActiveFilter("All");
                                            window.scrollTo({ top: 600, behavior: 'smooth' });
                                        }}
                                        className="w-full sm:w-fit bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition"
                                    >
                                        Find Clinics
                                    </button>
                                    <button 
                                        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                                        className="w-full sm:w-fit bg-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/30 transition"
                                    >
                                        Learn More
                                    </button>
                                </div>
                            </div>

                            <div className="hidden order-first lg:order-last md:flex justify-center lg:justify-end">
                                <img 
                                    src="/pets-hero-section.png" 
                                    alt="Happy pets and their owners" 
                                    className="w-full max-w-md md:max-w-lg object-cover" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tab buttons */}
                <div className="mt-8 mb-2">
                    <div className="flex gap-3 overflow-x-auto pb-2" role="tablist" aria-label="Clinic filters">
                        {[
                            { key: 'All', icon: FaStar },
                            { key: 'Popular', icon: FaStar },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeFilter === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => setActiveFilter(tab.key)}
                                    className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition focus:outline-none ${
                                        isActive 
                                            ? 'bg-primary text-white shadow-md' 
                                            : 'border border-gray-200 bg-white/80 text-black hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className={`${isActive ? 'text-white' : 'text-primary'}`} />
                                    <span className="whitespace-nowrap">{tab.key}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading approved clinics...</p>
                        <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h3 className="text-xl font-semibold text-red-900 mb-2">Unable to Load Clinics</h3>
                        <p className="text-red-700 mb-6">{error}</p>
                        <button 
                            onClick={loadClinics}
                            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Clinics Container */}
                {!loading && !error && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mb-14">
                        {displayClinics()}
                    </div>
                )}
            </section>
            <Footer />
        </div>
    );
}