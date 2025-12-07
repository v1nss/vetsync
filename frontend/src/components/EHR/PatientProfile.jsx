import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiPlus } from "react-icons/fi";
import HealthRecordsTable from "./HealthRecordsTable";
import HealthRecordModal from "./HealthRecordModal.jsx";
import AddHealthRecordModal from "./AddHealthRecordModal.jsx";
import NotificationModal from "../NotificationModal";
import { getVetClinicEHRs } from "../../global/api/clinicPatient";
import { useAuth } from "../../context/AuthContext";

export default function PatientProfile({ patient, onBack, healthRecords }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [displayHealthRecords, setDisplayHealthRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Fetch EHR records for this pet from the clinic (using clinic_patients as reference)
  useEffect(() => {
    const fetchEHRRecords = async () => {
      if (patient && patient.pet_id) {
        setLoadingRecords(true);
        try {
          // Fetch all EHRs for the clinic
          const res = await getVetClinicEHRs();
          
          if (res && res.ehrs) {
            // Filter EHRs for this specific pet
            const petEHRs = res.ehrs.filter(ehr => ehr.pet_id === patient.pet_id);
            
            // Transform backend data to frontend format
            const transformedRecords = petEHRs.map(ehr => {
              // Get owner data from petOwner or pet.owner
              const ownerData = ehr.petOwner?.User || ehr.pet?.owner;
              const ownerAddress = ehr.petOwner?.address || "";
              return {
                id: ehr.id,
                appointmentDate: ehr.visit_date,
                veterinarian: ehr.vetProfessional?.User 
                  ? `Dr. ${ehr.vetProfessional.User.first_name} ${ehr.vetProfessional.User.last_name}`
                  : "Veterinarian",
                reason: ehr.appointment?.service || "General Checkup",
                clinic_name: ehr.clinic?.name || "Veterinary Clinic",
                owner: ownerData ? {
                  name: `${ownerData.first_name || ""} ${ownerData.last_name || ""}`.trim() || "Unknown",
                  email: ownerData.email || "",
                  phone: ownerData.phone_number || "",
                  address: ownerAddress || "",
                } : null,
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
              };
            });
            
            setDisplayHealthRecords(transformedRecords);
          } else {
            setDisplayHealthRecords([]);
          }
        } catch (err) {
          console.error("Error fetching EHR records:", err);
          setDisplayHealthRecords([]);
        } finally {
          setLoadingRecords(false);
        }
      } else {
        // Fallback to mock data if no pet_id
        setDisplayHealthRecords(healthRecords);
        setLoadingRecords(false);
      }
    };

    fetchEHRRecords();
  }, [patient, healthRecords]);
  // Handle saving new health record
  const handleSaveHealthRecord = async (newRecord) => {
    try {
      // TODO: Replace with actual API call
      // const savedRecord = await saveHealthRecord(newRecord);
      
      console.log("Saving health record:", newRecord);
      
      // Update local state
      setDisplayHealthRecords(prev => [newRecord, ...prev]);
      
      // Close modal
      setShowAddModal(false);
      
      // Show success notification
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Success!',
        message: 'Health record has been added successfully.'
      });
      
    } catch (error) {
      console.error("Error saving health record:", error);
      
      // Show error notification
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to save health record. Please try again.'
      });
    }
  };

  const petForModal = {
    name: patient.name,
    species: patient.species,
    breed: patient.breed,
    pet_id: patient.id
  };

  return (
    <>
      <div className="mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button
              onClick={onBack}
              className="text-2xl mb-2 flex items-center gap-1 transition"
            >
              <FiChevronLeft />
              <span className="text-2xl font-bold capitalize text-gray-900">{patient.name}'s Health Record</span>
            </button>
          </div>
        </div>

        {/* Patient Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
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

                {/* Add Health Record Button */}
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex w-full mt-4 sm:mt-0 sm:w-fit items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
                >
                  <FiPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Health Record</span>
                  <span className="sm:hidden">Add Record</span>
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
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Health Records
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {loadingRecords 
                  ? "Loading records..." 
                  : `${displayHealthRecords.length} appointment${displayHealthRecords.length !== 1 ? 's' : ''} on record`}
              </p>
            </div>
          </div>

          {loadingRecords ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading health records...</p>
            </div>
          ) : (
            <HealthRecordsTable 
              healthRecords={displayHealthRecords} 
              onRecordClick={setSelectedRecord}
            />
          )}
        </div>
      </div>

      {/* View Detail Modal */}
      {selectedRecord && (
        <HealthRecordModal
          healthRecord={selectedRecord}
          pet={petForModal}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {/* Add Health Record Modal */}
      {showAddModal && (
        <AddHealthRecordModal
          patient={patient}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveHealthRecord}
        />
      )}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </>
  );
}