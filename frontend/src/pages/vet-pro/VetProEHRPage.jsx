import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import PatientList from "../../components/EHR/PatientList";
import PatientProfile from "../../components/EHR/PatientProfile";
import { getVetClinicPatients, getVetClinicEHRs } from "../../global/api/clinicPatient";
import { getEHRsByPet } from "../../global/api/ehr";

export default function VetProEHRPage() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
                id: owner?.id,
                name: owner ? `${owner.first_name} ${owner.last_name}` : "Unknown",
                email: owner?.email || "",
                phone: owner?.phone_number || "",
                address: petOwner?.address || "",
              },
              clinic_id: cp.clinic_id,
              appointmentCount: cp.appointmentCount || 0,
              age: pet?.birthdate ? calculateAge(pet.birthdate) : "Unknown",
              weight: "N/A",
              lastVisit: "N/A",
              registration: cp.createdAt ? new Date(cp.createdAt).toLocaleDateString() : "N/A",
              nextAppointment: "N/A",
              primaryVet: "N/A",
              status: "Active",
            };
          });

          transformedPatients.sort((a, b) => b.appointmentCount - a.appointmentCount);
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
    
  useEffect(() => {
    fetchPatients();
  }, []);

  const handleRefresh = () => {
    fetchPatients();
  };

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
      <Navbar />
      
      <div className="min-h-screen mx-auto max-w-7xl bg-gray-50 p-4 sm:p-6 pb-24 sm:pb-8">
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
            onRefresh={handleRefresh}
          />
        ) : (
          <PatientProfile 
            patient={selectedPatient} 
            onBack={() => setSelectedPatient(null)} 
          />
        )}
      </div>
    </main>
  );
}