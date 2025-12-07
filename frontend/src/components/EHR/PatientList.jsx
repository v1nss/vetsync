import React, { useState } from "react";
import { FiSearch, FiChevronRight, FiPlus } from "react-icons/fi";
import AddPatientModal from "./AddPatientModal";

export default function PatientList({ patients, onSelect, searchTerm, setSearchTerm, onRefresh }) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [showAddModal, setShowAddModal] = useState(false);

  // Use local search if parent doesn't provide it
  const search = searchTerm !== undefined ? searchTerm : localSearchTerm;
  const setSearch = setSearchTerm || setLocalSearchTerm;

  // Calculate age from birthdate
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

  // Filter patients by search
  const filteredPatients = patients.filter((patient) => {
    const query = search.toLowerCase();
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.species.toLowerCase().includes(query) ||
      patient.breed.toLowerCase().includes(query) ||
      patient.id.toLowerCase().includes(query) ||
      patient.pet_id?.toLowerCase().includes(query) ||
      patient.owner?.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="mx-auto pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
        <p className="mt-2 text-gray-600">
          Manage and view patient medical health records
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Select a Patient to View Records
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Patient</span>
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, species, breed, ID, or owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <button
              key={patient.pet_id || patient.id}
              onClick={() => onSelect(patient)}
              className="text-left p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-linear-to-br from-primary to-[#FEA08E] rounded-2xl flex items-center justify-center shrink-0">
                  {patient.profileURL?.link ? (
                    <img
                      src={patient.profileURL.link}
                      alt={patient.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {patient.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate group-hover:text-primary transition">
                    {patient.name}
                  </h3>
                  <p className="text-sm capitalize text-gray-600 mb-2">
                    {patient.species} • {patient.breed}
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <span>ID: {patient.pet_id || patient.id}</span>
                      <span>•</span>
                      <span>{calculateAge(patient.birthdate || patient.dateOfBirth)}</span>
                    </div>
                    {patient.owner?.name && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Owner:</span>
                        <span className="truncate">{patient.owner.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <FiChevronRight className="text-gray-400 mt-2 group-hover:text-primary transition" />
              </div>
            </button>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No patients found matching your search</p>
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onPatientAdded={onRefresh}
      />
    </div>
  );
}