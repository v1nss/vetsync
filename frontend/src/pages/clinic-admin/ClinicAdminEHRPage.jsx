import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import PatientList from "../../components/EHR/PatientList";
import PatientProfile from "../../components/EHR/PatientProfile";
import { getVetClinicPatients } from "../../global/api/clinicPatient";

export default function ClinicAdminEHRPage() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const res = await getVetClinicPatients();
        
        if (res && res.patients) {
          // Transform backend data to frontend format
          const transformedPatients = res.patients.map(cp => {
            const pet = cp.pet;
            const owner = pet?.owner;
            const petOwner = owner?.petOwner;
            
            return {
              id: pet?.pet_id?.toString() || cp.id?.toString(),
              pet_id: pet?.pet_id,
              name: pet?.name || "Unknown",
              species: pet?.species || "Unknown",
              breed: pet?.breed || "Unknown",
              gender: pet?.gender || "Unknown",
              birthdate: pet?.birthdate || null,
              dateOfBirth: pet?.birthdate || null,
              profileURL: pet?.profileURL || null,
              owner: {
                name: owner ? `${owner.first_name} ${owner.last_name}` : "Unknown",
                email: owner?.email || "",
                phone: owner?.phone_number || "",
                address: petOwner?.address || "",
              },
              // Calculate age
              age: pet?.birthdate ? calculateAge(pet.birthdate) : "Unknown",
              weight: "N/A", // Not available in current data
              lastVisit: "N/A", // Can be calculated from EHR records
              registration: cp.createdAt ? new Date(cp.createdAt).toLocaleDateString() : "N/A",
              nextAppointment: "N/A",
              primaryVet: "N/A",
              status: "Active",
            };
          });
          
          setPatients(transformedPatients);
        } else {
          setPatients([]);
        }
      } catch (err) {
        console.error("Error fetching clinic patients:", err);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const calculateAge = (birthdate) => {
    if (!birthdate) return "Age unknown";
    
    const birth = new Date(birthdate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }
    
    if (today.getDate() < birth.getDate()) {
      months--;
    }
    
    if (years === 0 && months === 0) {
      return "Less than 1 month";
    } else if (years === 0) {
      return `${months} ${months === 1 ? 'month' : 'months'} old`;
    } else if (months === 0) {
      return `${years} ${years === 1 ? 'year' : 'years'} old`;
    } else {
      return `${years} ${years === 1 ? 'yr' : 'yrs'}, ${months} ${months === 1 ? 'mo' : 'mos'}`;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-600">Loading patients...</p>
          </div>
        ) : !selectedPatient ? (
          <PatientList 
            patients={patients} 
            onSelect={setSelectedPatient}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        ) : (
          <PatientProfile 
            patient={selectedPatient} 
            onBack={() => setSelectedPatient(null)} 
          />
        )}
    </main>
  );
}
