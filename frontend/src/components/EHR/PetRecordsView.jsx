import React, { useState, useMemo } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { RiMicroscopeLine, RiSyringeLine } from "react-icons/ri";
import { FaPills } from "react-icons/fa";
import HealthRecordsTable from "./HealthRecordsTable";
import HealthRecordModal from "./HealthRecordModal.jsx";

// Mock data - Each health record can contain multiple document types
const mockHealthRecords = [
  {
    id: "hr_1",
    appointmentDate: "2024-11-15",
    veterinarian: "Dr. Sarah Johnson",
    reason: "Annual Wellness Check",
    clinic_name: "Happy Tails Veterinary Clinic",
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
    clinic_name: "Happy Tails Veterinary Clinic",
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
    clinic_name: "Happy Tails Veterinary Clinic",
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
    clinic_name: "Happy Tails Veterinary Clinic",
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
    clinic_name: "Happy Tails Veterinary Clinic",
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

export default function PetRecordsView({ pet, onBack, healthRecords, loading = false }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Use actual data if provided, otherwise use mock data as fallback
  const displayHealthRecords = healthRecords !== null ? healthRecords : mockHealthRecords;
  
  // Filter records by category
  const filteredRecords = useMemo(() => {
    if (activeTab === 'all') return displayHealthRecords;
    
    return displayHealthRecords.filter(record => {
      const docs = record.documents || {};
      switch (activeTab) {
        case 'lab':
          return docs.labResults && docs.labResults.length > 0;
        case 'prescriptions':
          return docs.prescriptions && docs.prescriptions.length > 0;
        case 'vaccinations':
          return docs.vaccineRecords && docs.vaccineRecords.length > 0;
        case 'deworming':
          return docs.deworming && docs.deworming.length > 0;
        default:
          return true;
      }
    });
  }, [displayHealthRecords, activeTab]);
  
  // Count records by category
  const categoryCounts = useMemo(() => {
    const counts = {
      all: displayHealthRecords.length,
      lab: 0,
      vaccinations: 0,
      deworming: 0
    };
    
    displayHealthRecords.forEach(record => {
      const docs = record.documents || {};
      if (docs.labResults && docs.labResults.length > 0) counts.lab++;
      if (docs.vaccineRecords && docs.vaccineRecords.length > 0) counts.vaccinations++;
      if (docs.deworming && docs.deworming.length > 0) counts.deworming++;
    });
    
    return counts;
  }, [displayHealthRecords]);

  // Get tab colors based on category
  const getTabColors = (tab) => {
    switch (tab) {
      case 'lab':
        return {
          active: 'bg-blue-600 text-white',
          inactive: 'text-blue-700 hover:text-blue-800 hover:bg-blue-50'
        };
      case 'vaccinations':
        return {
          active: 'bg-green-600 text-white',
          inactive: 'text-green-700 hover:text-green-800 hover:bg-green-50'
        };
      case 'deworming':
        return {
          active: 'bg-orange-600 text-white',
          inactive: 'text-orange-700 hover:text-orange-800 hover:bg-orange-50'
        };
      default:
        return {
          active: 'bg-primary text-white',
          inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        };
    }
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
    <>
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition"
        >
          <FiChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back to Pets</span>
        </button>

        {/* Pet Info Header */}
        <div className="bg-linear-to-r from-primary to-[#FEA08E] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              {pet.profileURL?.link ? (
                <img
                  src={pet.profileURL.link}
                  alt={pet.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {pet.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-1">{pet.name}</h2>
              <p className="text-white/90">
                {pet.species} • {pet.breed} • {calculateAge(pet.birthdate)}
              </p>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Health Records
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {displayHealthRecords.length} appointment{displayHealthRecords.length !== 1 ? 's' : ''} on record
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-4 border-b border-gray-200">
          <div className="flex gap-1 overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                activeTab === 'all'
                  ? getTabColors('all').active
                  : getTabColors('all').inactive
              }`}
            >
              All Records ({categoryCounts.all})
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                activeTab === 'lab'
                  ? getTabColors('lab').active
                  : getTabColors('lab').inactive
              }`}
            >
              <RiMicroscopeLine className="text-base" />
              Lab Results ({categoryCounts.lab})
            </button>
            <button
              onClick={() => setActiveTab('vaccinations')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                activeTab === 'vaccinations'
                  ? getTabColors('vaccinations').active
                  : getTabColors('vaccinations').inactive
              }`}
            >
              <RiSyringeLine className="text-base" />
              Vaccinations ({categoryCounts.vaccinations})
            </button>
            <button
              onClick={() => setActiveTab('deworming')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                activeTab === 'deworming'
                  ? getTabColors('deworming').active
                  : getTabColors('deworming').inactive
              }`}
            >
              <FaPills className="text-base" />
              Deworming ({categoryCounts.deworming})
            </button>
          </div>
        </div>

        {/* Health Records Table */}
        {loading ? (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="text-center py-12">
              <p className="text-gray-600">Loading health records...</p>
            </div>
          </div>
        ) : filteredRecords.length > 0 ? (
          <HealthRecordsTable 
            healthRecords={filteredRecords} 
            onRecordClick={setSelectedRecord}
          />
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="text-center py-12">
              <p className="text-gray-600">No {activeTab !== 'all' ? activeTab : ''} records found</p>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <HealthRecordModal
          healthRecord={selectedRecord}
          pet={pet}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </>
  );
}