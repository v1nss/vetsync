import React, { useState, useEffect } from "react";
import { FiSearch, FiChevronRight, FiCalendar } from "react-icons/fi";
import { RiMicroscopeLine, RiSyringeLine } from "react-icons/ri";
import { FaPrescription } from "react-icons/fa";
import petsData from "../../components/EHR/petsData";
import Navbar from "../../components/Navbar";
import PetsList from "../../components/EHR/PetsList";
import AppointmentHistory from "../../components/EHR/pet-owner/AppointmentsHistory";
import LabResults from "../../components/EHR/pet-owner/LabResults";
import VaccineRecords from "../../components/EHR/pet-owner/VaccineRecords";
import Prescriptions from "../../components/EHR/pet-owner/Prescriptions";
import { useAuth } from "../../context/AuthContext";
import { fetchAllPetsById } from "../../global/api/pet";

export default function PetOwnerEHR() {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [activeTab, setActiveTab] = useState("appointments");
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([])

  useEffect(() => {
    const fetchAllPets = async () => {
      setLoading(true);
      // setSelected(null);
      try {
        const res = await fetchAllPetsById(token);
        console.log(res)
        if (!res) {
          console.log("no pets exist");
          setPets(null);
          setIsPending(false);
        } else {
          setPets(res);
        }
      } catch (err) {
        console.error("Unable to get pets by ID:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPets()
  }, [token])

  const filteredPets = pets.filter((pet) => {
    const query = searchTerm.toLowerCase();
    return (
      pet.name.toLowerCase().includes(query) ||
      pet.species.toLowerCase().includes(query) ||
      pet.breed.toLowerCase().includes(query) ||
      pet.id.toLowerCase().includes(query)
    );
  });

  const handlePetSelect = (pet) => {
    setSelectedPet(pet);
    setActiveTab("appointments");
  };

  const handleBackToPets = () => {
    setSelectedPet(null);
    setActiveTab("appointments");
  };

  const tabs = [
    { id: "appointments", label: "Appointment History", icon: FiCalendar },
    { id: "labs", label: "Lab Results", icon: RiMicroscopeLine },
    { id: "vaccines", label: "Vaccine Records", icon: RiSyringeLine },
    { id: "prescriptions", label: "Prescriptions", icon: FaPrescription },
  ];

  return (
    <main>
      <Navbar />
      <div className="min-h-screen pb-24 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
                Health Records
            </h1>
            <p className="mt-2 text-gray-600">
              Access comprehensive medical records and appointment history
            </p>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={handleBackToPets}
                className={`${
                  !selectedPet ? "text-primary font-medium" : "text-gray-600 hover:text-primary"
                }`}
              >
                My Pets
              </button>
              {selectedPet && (
                <>
                  <FiChevronRight className="text-gray-400" />
                  <span className="text-primary font-medium">
                    {selectedPet.name} - Health Records
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {!selectedPet ? (
              <PetsList
                pets={filteredPets}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSelect={handlePetSelect}
              />
            ) : (
              <div className="p-6">
                {/* Pet Info Header */}
                <div className="bg-linear-to-r from-primary to-[#FEA08E] rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                      {selectedPet.profileURL?.link ? (
                        <img
                          src={selectedPet.profileURL.link}
                          alt={selectedPet.name}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          {selectedPet.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold mb-1">{selectedPet.name}</h2>
                      <p className="text-white/90">
                        {selectedPet.species} • {selectedPet.breed} • {selectedPet.age}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                          activeTab === tab.id
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div>
                  {activeTab === "appointments" && <AppointmentHistory pet={selectedPet} />}
                  {activeTab === "labs" && <LabResults pet={selectedPet} />}
                  {activeTab === "vaccines" && <VaccineRecords pet={selectedPet} />}
                  {activeTab === "prescriptions" && <Prescriptions pet={selectedPet} />}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


