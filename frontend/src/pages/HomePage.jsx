import { FaSearch, FaRegHeart, FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";

export default function HomePage() {
    const [clinics, setClinics] = useState([
        {
            id: 1,
            name: "Happy Paws Veterinary Clinic",
            distance: "1km away",
            hours: "Open 24/7",
            address: "64 Doña Soledad Avenue, Better Living Subdivision, Don Bosco, Parañaque City",
            image: "/clinic-image.jpg",
            liked: false,
        },
        {
            id: 2,
            name: "Healthy Tails Vet Center",
            distance: "2km away",
            hours: "Open 24/7",
            address: "123 Pet Street, Animal City",
            image: "/clinic-image2.jpg",
            liked: false,
        },
        {
            id: 3,
            name: "Purrfect Care Animal Hospital",
            distance: "3km away",
            hours: "Open 24/7",
            address: "456 Feline Avenue, Cat Town",
            image: "/clinic-image3.jpg",
            liked: false,
        },
        {
            id: 4,
            name: "Furry Friends Vet Clinic",
            distance: "4km away",
            hours: "Open 24/7",
            address: "789 Canine Road, Dog City",
            image: "/clinic-image4.jpg",
            liked: false,
        }
    ]);

    // UI + search state
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
    console.log("Toggled like for clinic with id:", id);
    };

    function displayClinics() {
        const query = searchQuery.trim().toLowerCase();
        // basic client-side filtering by query and simple activeFilter
        const filtered = clinics.filter((clinic) => {
            if (!query) return true;
            return (
                clinic.name.toLowerCase().includes(query) ||
                clinic.address.toLowerCase().includes(query) ||
                clinic.distance.toLowerCase().includes(query)
            );
        });

        return filtered.map((clinic) => (
            <div key={clinic.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col h-full">
                <div className="overflow-hidden rounded-md">
                    <img src={clinic.image} alt="Vet Clinic" className="w-full bg-gray-300 h-52 object-cover rounded-lg mb-4" />
                </div>

                <div className="mb-2">
                    <h3 className="text-lg font-semibold mb-2">{clinic.name}</h3>
                    <span className="text-gray-600">{clinic.distance}</span>
                    <p className="text-gray-600">{clinic.address}</p>
                    <span className="text-gray-600 mb-4"><strong>{clinic.hours}</strong></span>
                </div>

                {/* Always at the bottom */}
                <div className="flex justify-end items-center mt-auto">
                    <button className="flex-1 bg-primary text-white px-4 py-2 rounded-xl hover:bg-[#FEA08E] transition">
                        Book Appointment
                    </button>
                    <button 
                        className="ml-2 border border-gray-300 bg-white text-black px-4 py-3 rounded-xl hover:bg-gray-100 transition"
                        onClick={() => toggleLike(clinic.id)}>
                        {clinic.liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    </button>
                </div>
            </div>
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
        <div className="min-h-screen pb-10">
            {/* Home Header */}
            <nav className="sticky flex items-center justify-between py-4">
                <div>
                    <img src="/vetsync-logo-wname.png" className="flex h-10 w-auto" alt="Vetsync Logo" />
                </div>
                <div></div>
            </nav>
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
            <div className="flex space-x-4 mt-8 mb-2">
                <button className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-[#FEA08E] transition">Near You</button>
                <button className="bg-background-dark text-black px-4 py-2 rounded-xl hover:bg-gray-300 transition">Popular</button>
                <button className="bg-background-dark text-black px-4 py-2 rounded-xl hover:bg-gray-300 transition">24/7 Open</button>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {/* Vet Clinic Card */}
                {displayClinics()}
            </div>
        </div>
    );
}