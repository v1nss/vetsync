import React, { useState } from "react";
import { FiChevronLeft, FiEdit2 } from "react-icons/fi";
import { RiMicroscopeLine, RiSyringeLine } from "react-icons/ri";
import { FaPrescription } from "react-icons/fa";
import HealthRecordsTable from "./HealthRecordsTable";
import HealthRecordModal from "./HealthRecordModal.jsx";

// Mock health records data
const mockHealthRecords = [
  {
    id: "hr_1",
    appointmentDate: "2024-11-15",
    veterinarian: "Dr. Sarah Johnson",
    reason: "Annual Wellness Check",
    documents: {
      labResults: [
        {
          id: "lab_1",
          documentName: "Complete Blood Count (CBC)",
          details: "Complete blood count shows all values within normal range. Red blood cells: 6.5 M/µL, White blood cells: 8.2 K/µL, Platelets: 250 K/µL.",
          fileUrl: null
        },
        {
          id: "lab_2",
          documentName: "Kidney Function Panel",
          details: "Kidney function tests are excellent. BUN: 18 mg/dL (normal: 7-27), Creatinine: 1.2 mg/dL (normal: 0.5-1.8).",
          fileUrl: null
        }
      ],
      prescriptions: [
        {
          id: "rx_1",
          documentName: "Multivitamin Supplement",
          details: "Daily multivitamin for senior dogs. One tablet daily with food.",
          fileUrl: null
        }
      ],
      vaccineRecords: null
    }
  },
  {
    id: "hr_2",
    appointmentDate: "2024-11-10",
    veterinarian: "Dr. Sarah Johnson",
    reason: "Skin Infection Treatment",
    documents: {
      labResults: null,
      prescriptions: [
        {
          id: "rx_2",
          documentName: "Antibiotics - Amoxicillin",
          details: "Amoxicillin 250mg capsules. Dosage: 1 capsule twice daily for 10 days. Take with food.",
          fileUrl: null
        }
      ],
      vaccineRecords: null
    }
  },
  {
    id: "hr_3",
    appointmentDate: "2024-11-01",
    veterinarian: "Dr. Sarah Johnson",
    reason: "Vaccination Appointment",
    documents: {
      labResults: null,
      prescriptions: null,
      vaccineRecords: [
        {
          id: "vax_1",
          documentName: "Rabies Vaccination",
          details: "Rabies vaccine (Imrab 3) administered subcutaneously. Lot #: RV-2024-1156. Next dose due: November 2027.",
          fileUrl: null
        }
      ]
    }
  },
  {
    id: "hr_4",
    appointmentDate: "2024-10-20",
    veterinarian: "Dr. Michael Chen",
    reason: "Follow-up Examination",
    documents: {
      labResults: [
        {
          id: "lab_3",
          documentName: "Urinalysis",
          details: "Urinalysis results normal. No signs of infection or crystals. Specific gravity: 1.025 (normal), pH: 6.5.",
          fileUrl: null
        }
      ],
      prescriptions: null,
      vaccineRecords: null
    }
  },
  {
    id: "hr_5",
    appointmentDate: "2024-08-15",
    veterinarian: "Dr. Emily Rodriguez",
    reason: "Vaccination & Health Check",
    documents: {
      labResults: null,
      prescriptions: null,
      vaccineRecords: [
        {
          id: "vax_2",
          documentName: "DHPP Vaccination",
          details: "Distemper, Hepatitis, Parvovirus, Parainfluenza vaccine. Lot #: DHPP-2024-0892. Booster due in August 2025.",
          fileUrl: null
        },
        {
          id: "vax_3",
          documentName: "Bordetella Vaccination",
          details: "Bordetella bronchiseptica (kennel cough) vaccine administered intranasally. Provides protection for 12 months.",
          fileUrl: null
        }
      ]
    }
  }
];

export default function PatientProfile({ patient, onBack, healthRecords }) {
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Use mock data if no data provided
  const displayHealthRecords = healthRecords || mockHealthRecords;

  // Create pet object for modal (converting patient to pet format)
  const petForModal = {
    name: patient.name,
    species: patient.species,
    breed: patient.breed,
    pet_id: patient.id
  };

  return (
    <>
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
                    <span className="text-3xl font-bold text-gray-500">
                      {patient.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                    <p className="text-gray-600">
                      {patient.species} • {patient.breed} • {patient.gender}
                    </p>
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
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patient ID:</span>
                      <span className="text-gray-900">{patient.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="text-gray-900">{patient.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration:</span>
                      <span className="text-gray-900">{patient.registration}</span>
                    </div>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="bg-gray-100 p-4 rounded-xl space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">Owner Information</h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="text-gray-900">{patient.owner.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900 text-xs">{patient.owner.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="text-gray-900">{patient.owner.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="text-gray-900">{patient.owner.address}</span>
                    </div>
                  </div>
                </div>

                {/* Medical Summary */}
                <div className="bg-gray-100 p-4 rounded-xl space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">Medical Summary</h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Visit:</span>
                      <span className="text-gray-900">{patient.lastVisit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Appointment:</span>
                      <span className="text-gray-900">{patient.nextAppointment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Primary Vet:</span>
                      <span className="text-gray-900">{patient.primaryVet}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {patient.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Records Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Health Records
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {displayHealthRecords.length} appointment{displayHealthRecords.length !== 1 ? 's' : ''} on record
            </p>
          </div>

          {/* Health Records Table */}
          <HealthRecordsTable 
            healthRecords={displayHealthRecords} 
            onRecordClick={setSelectedRecord}
          />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <HealthRecordModal
          healthRecord={selectedRecord}
          pet={petForModal}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </>
  );
}