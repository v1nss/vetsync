import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import PetsList from "../../components/EHR/PetsList";
import PetRecordsView from "../../components/EHR/PetRecordsView";
import { useAuth } from "../../context/AuthContext";
import { fetchAllPetsById } from "../../global/api/pet";
import { getEHRsByPet } from "../../global/api/ehr";
import { FiChevronRight } from "react-icons/fi";

export default function PetOwnerEHR() {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [healthRecords, setHealthRecords] = useState(null);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    const fetchAllPets = async () => {
      setLoading(true);
      try {
        const res = await fetchAllPetsById();
        console.log(res);
        if (!res) {
          console.log("no pets exist");
          setPets([]);
        } else {
          setPets(res);
        }
      } catch (err) {
        console.error("Unable to get pets by ID:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPets();
  }, [token]);

  // Fetch health records when a pet is selected
  useEffect(() => {
    const fetchHealthRecords = async () => {
      if (selectedPet && selectedPet.pet_id) {
        setLoadingRecords(true);
        try {
          const res = await getEHRsByPet(selectedPet.pet_id);
          console.log("EHR records fetched:", res);
          
          if (res && res.ehrs) {
            // Transform backend data to frontend format
            const transformedRecords = res.ehrs.map(ehr => ({
              id: ehr.id,
              appointmentDate: ehr.visit_date,
              veterinarian: ehr.vetProfessional?.User 
                ? `Dr. ${ehr.vetProfessional.User.first_name} ${ehr.vetProfessional.User.last_name}`
                : ehr.appointment?.assigned_vet || "Veterinarian",
              reason: ehr.appointment?.service || "General Checkup",
              clinic_name: ehr.clinic?.name || "Veterinary Clinic",
              documents: {
                labResults: ehr.labResults && ehr.labResults.length > 0
                  ? ehr.labResults.map(lab => ({
                      id: lab.id,
                      documentName: lab.name,
                      details: lab.description,
                      fileUrl: null
                    }))
                  : null,
                vaccineRecords: ehr.vaccinations && ehr.vaccinations.length > 0
                  ? ehr.vaccinations.map(vax => ({
                      id: vax.id,
                      documentName: vax.name,
                      details: vax.description + (vax.duration ? ` (Duration: ${vax.duration})` : ''),
                      fileUrl: null
                    }))
                  : null,
                prescriptions: ehr.prescriptions && ehr.prescriptions.length > 0
                  ? ehr.prescriptions.map(pres => ({
                      id: pres.id,
                      documentName: pres.name,
                      details: pres.description,
                      fileUrl: null
                    }))
                  : null,
                deworming: ehr.dewormings && ehr.dewormings.length > 0
                  ? ehr.dewormings.map(deworm => ({
                      id: deworm.id,
                      documentName: deworm.name,
                      details: deworm.description,
                      fileUrl: null
                    }))
                  : null
              },
              attachedFiles: ehr.attached_files || null
            }));
            
            setHealthRecords(transformedRecords);
          } else {
            setHealthRecords([]);
          }
        } catch (err) {
          console.error("Error fetching health records:", err);
          setHealthRecords([]);
        } finally {
          setLoadingRecords(false);
        }
      } else {
        setHealthRecords(null);
      }
    };

    fetchHealthRecords();
  }, [selectedPet]);

  const filteredPets = pets.filter((pet) => {
    const query = searchTerm.toLowerCase();
    return (
      pet.name.toLowerCase().includes(query) ||
      pet.species.toLowerCase().includes(query) ||
      pet.breed.toLowerCase().includes(query) ||
      pet.pet_id.toLowerCase().includes(query)
    );
  });

  return (
    <main>
      <Navbar />
      <div className="min-h-screen pb-24 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Health Records
            </h1>
            <p className="mt-2 text-gray-600">
              Access comprehensive medical records and appointment history
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setSelectedPet(null)}
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

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {!selectedPet ? (
              <PetsList
                pets={filteredPets}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSelect={setSelectedPet}
              />
            ) : (
              <PetRecordsView 
                pet={selectedPet} 
                onBack={() => setSelectedPet(null)}
                healthRecords={healthRecords}
                loading={loadingRecords}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}