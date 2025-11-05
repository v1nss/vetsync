import { FaSearch, FaRegHeart, FaHeart, FaMapMarkerAlt, FaStar, FaClock } from "react-icons/fa";
import { useState } from "react";
import Navbar from "../components/Navbar";
import ClinicViewModal from "../components/ClinicViewModal";
import ClinicCard from "../components/ClinicCard";

export default function HomePage() {
    const [selectedClinic, setSelectedClinic] = useState(null);

    const [clinics, setClinics] = useState([
        {
            id: 1,
            name: "Happy Paws Veterinary Clinic",
            distance: "1km away",
            hours: "Open 24/7",
            address: "64 Doña Soledad Avenue, Better Living Subdivision, Don Bosco, Parañaque City",
            image: "/clinic-image.jpg",
            liked: false,
            services: ["Grooming", "Vaccine", "Consultation"],
        },
        {
            id: 2,
            name: "Healthy Tails Vet Center",
            distance: "2km away",
            hours: "Open 24/7",
            address: "123 Pet Street, Animal City",
            image: "/clinic-image2.jpg",
            liked: false,
            services: ["Surgery", "Dental Care", "Emergency Care"],
        },
        {
            id: 3,
            name: "Purrfect Care Animal Hospital",
            distance: "3km away",
            hours: "Open 24/7",
            address: "456 Feline Avenue, Cat Town",
            image: "/clinic-image3.jpg",
            liked: false,
            services: ["Wellness Exams", "Spaying/Neutering", "Microchipping"],
        },
        {
            id: 4,
            name: "Furry Friends Vet Clinic",
            distance: "4km away",
            hours: "Open 24/7",
            address: "789 Canine Road, Dog City",
            image: "/clinic-image4.jpg",
            liked: false,
            services: ["Vaccinations", "Parasite Control", "Nutritional Counseling"],
        }
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [radius, setRadius] = useState(10); // km
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [activeFilter, setActiveFilter] = useState("Near You");

    const toggleLike = (id) => {
    setClinics(prevClinics =>
        prevClinics.map(clinic =>
        clinic.id === id ? { ...clinic, liked: !clinic.liked } : clinic
        )
    );
    };

    function displayClinics() {
        const query = searchQuery.trim().toLowerCase();

        const parseDistance = (d) => {
            const m = String(d).match(/\d+(?:\.\d+)?/);
            return m ? Number(m[0]) : Infinity;
        };

        let filtered = clinics.filter((clinic) => {
            if (!query) return true;
            return (
            clinic.name.toLowerCase().includes(query) ||
            clinic.address.toLowerCase().includes(query) ||
            clinic.distance.toLowerCase().includes(query)
            );
        });

        if (activeFilter === "Near You") {
            filtered = filtered.filter((c) => parseDistance(c.distance) <= radius)
            filtered = filtered.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));
        } else if (activeFilter === "24/7 Open") {
            filtered = filtered.filter((c) =>
            c.hours.toLowerCase().includes("24/7")
            );
        } else if (activeFilter === "Popular") {
            filtered = filtered.sort((a, b) => b.liked - a.liked);
        }

        return filtered.map((clinic) => (
            <ClinicCard
            key={clinic.id}
            clinic={clinic}
            onOpen={() => setSelectedClinic(clinic)} 
            onLike={() => toggleLike(clinic.id)}
            />
        ));
    }


    function handleDetectLocation() {
        if (!navigator.geolocation) {
            console.warn("Geolocation not supported");
            return;
        }
        setIsDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setIsDetectingLocation(false);
                console.log("Got location:", pos.coords.latitude, pos.coords.longitude);
            },
            (err) => {
                console.warn("Location error:", err.message);
                setIsDetectingLocation(false);
            },
            { timeout: 8000 }
        );
    }

    return (
        <div>
            <Navbar />
            <section className="min-h-screen pb-10"> 
                <div className="mt-10 mb-6">
                    <div className="bg-linear-to-r from-primary to-[#FFB49A] px-6 py-10 rounded-2xl shadow-lg">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="text-white px-2 md:px-6">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">Your Pet's Health, Our Priority</h1>
                                <p className="text-white/90 mb-6 max-w-xl">Find trusted veterinary clinics nearby. Book appointments, view services, and get care for your pet — all in one place.</p>

                                <form className="flex items-center gap-3 mb-4" onSubmit={(e)=>{e.preventDefault(); console.log('Search:', searchQuery, radius, activeFilter);}}>
                                    <div className="flex items-center bg-white rounded-xl shadow-md overflow-hidden flex-1">
                                        <input
                                            id="search"
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e)=>setSearchQuery(e.target.value)}
                                            placeholder="Search clinics, services, or addresses"
                                            className="text-black px-4 py-3 w-full focus:outline-none"
                                            aria-label="Search clinics"
                                        />
                                        <button aria-label="Search" className="group px-4 py-3 rounded-full" type="submit">
                                            <FaSearch className="text-gray-400 group-hover:text-gray-500" />
                                        </button>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={handleDetectLocation}
                                            className="inline-flex items-center px-4 py-3 rounded-xl bg-white text-primary hover:bg-gray-100 shadow-sm"
                                            aria-pressed={isDetectingLocation}
                                        >
                                            <FaMapMarkerAlt className="my-1 sm:my-0 sm:mr-2" />
                                            <span className="hidden sm:flex">{isDetectingLocation ? 'Detecting...' : 'Use My Location'}</span>
                                        </button>
                                    </div>
                                </form>

                                <div className="flex justify-center sm:justify-start mt-6">
                                    <button className="w-full sm:w-fit bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 shadow">Find Clinics</button>
                                    <button className="w-full sm:w-fit ml-4 bg-white/20 text-white px-5 py-3 rounded-xl hover:bg-white/30 transition">Learn More</button>
                                </div>
                            </div>

                            <div className="order-first md:order-last flex justify-center md:justify-end">
                                <img src="/pets-hero-section.png" alt="Happy pets and their owners" className="w-full max-w-md md:max-w-lg object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tab buttons eg.Near You, Popular, 24/7 Open */}
                <div className="mt-8 mb-2">
                    <div className="flex gap-3 overflow-x-auto pb-2" role="tablist" aria-label="Clinic filters">
                        {[
                            { key: 'Near You', icon: FaMapMarkerAlt },
                            { key: 'Popular', icon: FaStar },
                            { key: '24/7 Open', icon: FaClock },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeFilter === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => setActiveFilter(tab.key)}
                                    className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition focus:outline-none ${isActive ? 'bg-primary text-white shadow-md' : 'border border-gray-200 bg-white/80 text-black hover:bg-gray-100'}`}
                                >
                                    <Icon className={`${isActive ? 'text-white' : 'text-primary'}`} />
                                    <span className="whitespace-nowrap">{tab.key}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {/* Vet Clinic Card */}
                    {displayClinics()}
                </div>
                {selectedClinic && (
                    <ClinicViewModal
                        clinic={selectedClinic}
                        onClose={() => setSelectedClinic(null)}
                        isOpen={!!selectedClinic}
                    />
                )}
            </section>
        </div>
    );
}