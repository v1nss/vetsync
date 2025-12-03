import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import PatientList from "../../components/EHR/PatientList";
import PatientProfile from "../../components/EHR/PatientProfile";
import patientsData from "../../components/EHR/patientsData";

export default function VetProEHRPage() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <main>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 pb-24 sm:pb-8">
        {!selectedPatient ? (
          <PatientList 
            patients={patientsData} 
            onSelect={setSelectedPatient} 
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