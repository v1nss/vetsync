import React, { useState, useEffect, useMemo } from "react";
import { FiChevronLeft, FiPlus, FiDownload} from "react-icons/fi";
import { RiMicroscopeLine, RiSyringeLine } from "react-icons/ri";
import { FaPrescription, FaPills } from "react-icons/fa";
import HealthRecordsTable from "./HealthRecordsTable";
import HealthRecordModal from "./HealthRecordModal.jsx";
import AddHealthRecordModal from "./AddHealthRecordModal.jsx";
import AddHealthRecordModalNoAppointment from "./AddHealthRecordModalNoAppointment.jsx";
import NotificationModal from "../NotificationModal";
import { getVetClinicEHRs, getVetClinicPatient } from "../../global/api/clinicPatient";
import { fetchAppointmentsByClinic } from "../../global/api/appointment";
import { downloadPatientReport } from "../../global/api/clinicAdmin.jsx";

export default function PatientProfile({ patient, onBack }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [displayHealthRecords, setDisplayHealthRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [petDetails, setPetDetails] = useState(null);
  const [petProfileURL, setPetProfileURL] = useState(null);
  const [medicalSummary, setMedicalSummary] = useState({
    lastVisit: "N/A",
    nextAppointment: "N/A",
    primaryVet: "N/A",
    status: "Active"
  });
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Fetch pet details and calculate medical summary
  useEffect(() => {
    const fetchPetDetailsAndSummary = async () => {
      if (patient && patient.id && patient.clinic_id) {
        try {
          // Fetch pet details including weight, color, and profileURL
          const petRes = await getVetClinicPatient(patient.id);
          if (petRes && petRes.patient && petRes.patient.pet) {
            const pet = petRes.patient.pet;
            setPetDetails({
              weight: pet.weight || "N/A",
              color: pet.color || "N/A"
            });
            if (pet.profileURL) {
              setPetProfileURL(pet.profileURL);
            }
          }

          // Fetch appointments to get next appointment
          try {
            const appointmentsRes = await fetchAppointmentsByClinic(patient.clinic_id);
            if (appointmentsRes && appointmentsRes.appointments) {
              const petAppointments = appointmentsRes.appointments.filter(
                apt => apt.pet_id === patient.id && 
                (apt.status === 'approved' || apt.status === 'pending' || apt.status === 'confirmed')
              );
              
              // Find next upcoming appointment
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              const upcomingAppointments = petAppointments
                .filter(apt => {
                  const aptDate = new Date(apt.date);
                  aptDate.setHours(0, 0, 0, 0);
                  return aptDate >= today;
                })
                .sort((a, b) => {
                  const dateA = new Date(`${a.date}T${a.time}`);
                  const dateB = new Date(`${b.date}T${b.time}`);
                  return dateA - dateB;
                });

              if (upcomingAppointments.length > 0) {
                const nextApt = upcomingAppointments[0];
                const aptDate = new Date(`${nextApt.date}T${nextApt.time}`);
                setMedicalSummary(prev => ({
                  ...prev,
                  nextAppointment: aptDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }) + ' at ' + aptDate.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                  })
                }));
              }
            }
          } catch (err) {
            console.error("Error fetching appointments:", err);
          }
        } catch (err) {
          console.error("Error fetching pet details:", err);
        }
      }
    };

    fetchPetDetailsAndSummary();
  }, [patient]);

  // Fetch EHR records for this pet from the clinic (using clinic_patients as reference)
  useEffect(() => {
    const fetchEHRRecords = async () => {
      // if (patient && patient.id) {
        setLoadingRecords(true);
        try {
          // Fetch all EHRs for the clinic
          const res = await getVetClinicEHRs();
          console.log(res)
          if (res && res.ehrs) {
            // Filter EHRs for this specific pet
            const petEHRs = res.ehrs.filter(ehr => ehr.pet_id === patient.id);
            
            // Calculate last visit and primary vet from EHR records
            // Also get weight and color from pet data in EHR if available
            if (petEHRs.length > 0) {
              // Sort by visit date to get most recent
              const sortedEHRs = [...petEHRs].sort((a, b) => {
                const dateA = new Date(a.visit_date);
                const dateB = new Date(b.visit_date);
                return dateB - dateA;
              });

              // Last visit
              const lastVisit = sortedEHRs[0];
              if (lastVisit && lastVisit.visit_date) {
                const visitDate = new Date(lastVisit.visit_date);
                setMedicalSummary(prev => ({
                  ...prev,
                  lastVisit: visitDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })
                }));
              }

              // Get weight, color, and profileURL from pet data in EHR (if not already fetched)
              const petData = sortedEHRs[0]?.pet;
              if (petData) {
                if (!petDetails || petDetails.weight === "N/A" || petDetails.color === "N/A") {
                  setPetDetails(prev => ({
                    weight: prev?.weight === "N/A" ? (petData.weight || "N/A") : prev?.weight,
                    color: prev?.color === "N/A" ? (petData.color || "N/A") : prev?.color
                  }));
                }
                if (petData.profileURL && !petProfileURL) {
                  setPetProfileURL(petData.profileURL);
                }
              }

              // Primary vet (most frequent vet)
              const vetCounts = {};
              petEHRs.forEach(ehr => {
                if (ehr.vetProfessional?.User) {
                  const vetName = `Dr. ${ehr.vetProfessional.User.first_name} ${ehr.vetProfessional.User.last_name}`;
                  vetCounts[vetName] = (vetCounts[vetName] || 0) + 1;
                }
              });

              const primaryVet = Object.entries(vetCounts)
                .sort((a, b) => b[1] - a[1])[0];
              
              if (primaryVet) {
                setMedicalSummary(prev => ({
                  ...prev,
                  primaryVet: primaryVet[0]
                }));
              }
            }
            
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
                reason: ehr.appointment?.service || ehr.service || "General Checkup",
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
    };

    fetchEHRRecords();
  }, [patient]);

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
      prescriptions: 0,
      vaccinations: 0,
      deworming: 0
    };
    
    displayHealthRecords.forEach(record => {
      const docs = record.documents || {};
      if (docs.labResults && docs.labResults.length > 0) counts.lab++;
      if (docs.prescriptions && docs.prescriptions.length > 0) counts.prescriptions++;
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
      case 'prescriptions':
        return {
          active: 'bg-purple-600 text-white',
          inactive: 'text-purple-700 hover:text-purple-800 hover:bg-purple-50'
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

  const payload = {
    clinicName: displayHealthRecords[0]?.clinic_name || "Veterinary Clinic",
    petId: patient.id,
    petName: patient.name,
    species: patient.species,
    breed: patient.breed,
    gender: patient.gender,
    birthdate: patient.dateOfBirth,
    weight: patient.weight,
    age: patient.age,
    owner: {
      name: patient.owner.name,
      email: patient.owner.email,
      phone: patient.owner.phone,
      address: patient.owner.address
    },
    registration: patient.registration,
    appointmentCount: patient.appointmentCount,
  }

  const handleDownload = async (patientData) => {
    try {
      const blob = await downloadPatientReport(patientData);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `patient-${patientData.petId || "report"}.pdf`;
      link.click();

      URL.revokeObjectURL(url); // clean up memory
    } catch (err) {
      console.error("Download failed", err);
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
            <button
              onClick={() => handleDownload(payload)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
            >
              <FiDownload className="w-4 h-4" />
              <span className="hidden sm:inline">Download Report</span>
            </button>
          </div>
        </div>

        {/* Patient Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                    {(patient.profileURL?.link || petProfileURL?.link) ? (
                      <img
                        src={patient.profileURL?.link || petProfileURL?.link}
                        alt={patient.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-gray-500">
                        {patient.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                    <p className="text-gray-600">
                      {patient.species} • {patient.breed} • {patient.gender}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>🎂 {patient.age} old</span>
                      <span>⚖️ {petDetails?.weight || patient.weight || "N/A"}</span>
                      {petDetails?.color && petDetails.color !== "N/A" && (
                        <span>🎨 {petDetails.color}</span>
                      )}
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
                      <span className="text-gray-900">{medicalSummary.lastVisit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Appointment:</span>
                      <span className="text-gray-900">{medicalSummary.nextAppointment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Primary Vet:</span>
                      <span className="text-gray-900">{medicalSummary.primaryVet}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {medicalSummary.status}
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
                onClick={() => setActiveTab('prescriptions')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                  activeTab === 'prescriptions'
                    ? getTabColors('prescriptions').active
                    : getTabColors('prescriptions').inactive
                }`}
              >
                <FaPrescription className="text-base" />
                Prescriptions ({categoryCounts.prescriptions})
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

          {loadingRecords ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading health records...</p>
            </div>
          ) : filteredRecords.length > 0 ? (
            <HealthRecordsTable 
              healthRecords={filteredRecords} 
              onRecordClick={setSelectedRecord}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No {activeTab !== 'all' ? activeTab : ''} records found</p>
            </div>
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
        <AddHealthRecordModalNoAppointment
          patient={{
            ...patient,
            pet_id: patient.id,
            clinic_id: patient.clinic_id,
            owner: patient.owner ? {
              id: patient.owner.id,
              name: patient.owner.name,
              email: patient.owner.email,
              phone: patient.owner.phone,
              address: patient.owner.address,
            } : null,
            owner_id: patient.owner?.id || patient.owner_id, // Also include owner_id at root level for easier access
          }}
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