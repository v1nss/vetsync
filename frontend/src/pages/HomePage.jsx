import { FaSearch, FaRegHeart, FaHeart } from "react-icons/fa";
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

    const toggleLike = (id) => {
    setClinics(prevClinics =>
        prevClinics.map(clinic =>
        clinic.id === id ? { ...clinic, liked: !clinic.liked } : clinic
        )
    );
    console.log("Toggled like for clinic with id:", id);
    };

    function displayClinics() {
        return clinics.map((clinic) => (
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

    return (
        <div className="min-h-screen pb-10">
            {/* Home Header */}
            <div className="flex items-center justify-between py-4">
                <div>
                    <img src="/vetsync-logo-wname.png" className="hidden sm:flex h-10 w-auto" alt="Vetsync Logo" />
                    <img src="/vetsync.png" className="sm:hidden h-10 w-auto" alt="Vetsync Logo" />
                </div>
                {/* Search Bar with icon */}
                <div className="flex items-center bg-white rounded-full px-4 py-4 sm:py-2 w-2/3 sm:w-1/2 lg:w-1/3 shadow-md">
                    <input
                        type="text"
                        placeholder="Search for clinics, services, or specialties"
                        className="w-full outline-none text-xs sm:text-sm"
                    />
                    <FaSearch className="text-gray-400 hover:text-gray-500 cursor-pointer" />
                </div>
                <div></div>
            </div>

            <div className="mt-10 mb-4">
                <h1 className="text-black text-4xl font-bold">Find The <br></br>Perfect Clinic</h1>
                <p className="text-black">Find the right vet. Fast. Reliable. Local.</p>
            </div>

            {/* Filter Tab buttons eg.Near You, Popular, 24/7 Open */}
            <div className="flex space-x-4 mt-8 mb-2">
                <button className="bg-primary text-white px-4 py-2 rounded-full hover:bg-[#FEA08E] transition">Near You</button>
                <button className="bg-background-dark text-black px-4 py-2 rounded-full hover:bg-gray-300 transition">Popular</button>
                <button className="bg-background-dark text-black px-4 py-2 rounded-full hover:bg-gray-300 transition">24/7 Open</button>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {/* Vet Clinic Card */}
                {displayClinics()}
            </div>
        </div>
    );
}