import React, { useState } from "react";
import PatientList from "../../components/EHR/PatientList";
import PatientProfile from "../../components/EHR/PatientProfile";
import patientsData from "../../components/EHR/patientsData";

export default function ClinicAdminEHRPage() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {!selectedPatient ? (
        <PatientList patients={patientsData} onSelect={setSelectedPatient} />
      ) : (
        <PatientProfile patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
      )}
    </div>
  );
}
