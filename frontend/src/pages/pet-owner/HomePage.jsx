import { FaSearch, FaMapMarkerAlt, FaStar, FaClock } from "react-icons/fa";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
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

    function displayClinics() {
        const query = searchQuery.trim().toLowerCase();

        let filtered = clinics.filter((clinic) => {
            if (!query) return true;
            
            // Search in name, address, and description
            const searchableText = [
                clinic.name,
                typeof clinic.address === 'string' ? clinic.address : '',
                clinic.address_string || '',
                clinic.description || ''
            ].join(' ').toLowerCase();
            
            return searchableText.includes(query);
        });

        if (activeFilter === "Popular") {
            // Sort by number of likes (you might want to use actual popularity metrics later)
            filtered = filtered.sort((a, b) => (b.liked ? 1 : 0) - (a.liked ? 1 : 0));
        }

        if (filtered.length === 0) {
            return (
                <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No clinics found matching your criteria.</p>
                    <button 
                        onClick={() => {
                            setSearchQuery("");
                            setActiveFilter("All");
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
                setIsDetectingLocation(false);
                console.log("Got location:", pos.coords.latitude, pos.coords.longitude);
                alert("Location detected! Distance-based filtering will be available once clinic coordinates are added.");
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
                                            className="inline-flex items-center px-4 py-3 rounded-xl bg-white text-primary hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            disabled={isDetectingLocation}
                                            title="Location features coming soon"
                                        >
                                            <FaMapMarkerAlt className={`my-1 lg:my-0 lg:mr-2 ${isDetectingLocation ? 'animate-pulse' : ''}`} />
                                            <span className="hidden lg:flex">
                                                {isDetectingLocation ? 'Detecting...' : userLocation ? 'Location Set' : 'Use My Location'}
                                            </span>
                                        </button>
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
        </div>
    );
}