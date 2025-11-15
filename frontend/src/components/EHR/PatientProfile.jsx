import React, { useState } from "react";
import { FiChevronLeft, FiEdit2 } from "react-icons/fi";
import PatientTabs from "./PatientTabs";

export default function PatientProfile({ patient, onBack }) {
  const [activeTab, setActiveTab] = useState("prescriptions");

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <button
            onClick={onBack}
            className="text-primary hover:text-[#FEA08E] mb-2 flex items-center gap-1 transition"
          >
            <FiChevronLeft /> Back to Records
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Patient Record</h1>
        </div>
      </div>

      {/* Patient Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-start gap-4">

          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-500">{patient.name.charAt(0)}</span>
                </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                <p className="text-gray-600">{patient.species} • {patient.breed} • {patient.gender}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>🎂 {patient.age} old</span>
                  <span>⚖️ {patient.weight}</span>
                </div>
              </div>
              </div>

              <button className="p-2 hover:bg-gray-100 rounded-xl transition">
                <FiEdit2 size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Patient Details */}
              <div className="bg-gray-100 p-4 rounded-xl space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">Patient Details</h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Patient ID:</span><span className="text-gray-900">{patient.id}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Date of Birth:</span><span className="text-gray-900">{patient.dateOfBirth}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Registration:</span><span className="text-gray-900">{patient.registration}</span></div>
                </div>
              </div>

              {/* Owner Info */}
              <div className="bg-gray-100 p-4 rounded-xl space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">Owner Information</h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Name:</span><span className="text-gray-900">{patient.owner.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Email:</span><span className="text-gray-900 text-xs">{patient.owner.email}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Phone:</span><span className="text-gray-900">{patient.owner.phone}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Address:</span><span className="text-gray-900">{patient.owner.address}</span></div>
                </div>
              </div>

              {/* Medical Summary */}
              <div className="bg-gray-100 p-4 rounded-xl space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">Medical Summary</h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Last Visit:</span><span className="text-gray-900">{patient.lastVisit}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Next Appointment:</span><span className="text-gray-900">{patient.nextAppointment}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Primary Vet:</span><span className="text-gray-900">{patient.primaryVet}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Status:</span><span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">{patient.status}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <PatientTabs patient={patient} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
