import React, { useState } from "react";
import { FiX, FiSearch, FiLoader } from "react-icons/fi";
import { searchPetsByOwnerEmail, addPatientToClinic } from "../../global/api/clinicPatient";
import NotificationModal from "../NotificationModal";

export default function AddPatientModal({ isOpen, onClose, onPatientAdded }) {
  const [email, setEmail] = useState("");
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [adding, setAdding] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const handleSearch = async () => {
    if (!email.trim()) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Please enter an owner email address'
      });
      return;
    }

    setSearching(true);
    setPets([]);
    setSelectedPet(null);

    try {
      const res = await searchPetsByOwnerEmail(email.trim());
      if (res && res.pets) {
        setPets(res.pets);
        if (res.pets.length === 0) {
          setNotification({
            isOpen: true,
            type: 'info',
            title: 'No Pets Found',
            message: `No pets found for owner email: ${email}`
          });
        }
      } else {
        setPets([]);
      }
    } catch (err) {
      console.error("Error searching pets:", err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Search Failed',
        message: err.response?.data?.message || 'Failed to search for pets. Please try again.'
      });
      setPets([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddPatient = async (pet) => {
    setAdding(true);
    try {
      // Create a basic EHR entry with today's date
      const ehrData = {
        visit_date: new Date().toISOString().split('T')[0],
        prescriptions: [],
        vaccinations: [],
        dewormings: [],
        labResults: [],
        files: []
      };

      await addPatientToClinic(pet.pet_id, ehrData);
      
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: `${pet.name} has been added as a patient successfully!`
      });

      // Reset form
      setEmail("");
      setPets([]);
      setSelectedPet(null);

      // Notify parent to refresh patient list
      if (onPatientAdded) {
        onPatientAdded();
      }

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error adding patient:", err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err.response?.data?.message || 'Failed to add patient. Please try again.'
      });
    } finally {
      setAdding(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPets([]);
    setSelectedPet(null);
    onClose();
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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold text-gray-900">Add Patient</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition"
              disabled={adding}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Email Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Email *
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder="Enter owner email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  disabled={searching || adding}
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={searching || adding || !email.trim()}
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {searching ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <FiSearch className="w-4 h-4" />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter the pet owner's email to search for their pets
              </p>
            </div>

            {/* Pets List */}
            {pets.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                  Found {pets.length} {pets.length === 1 ? 'Pet' : 'Pets'}
                </h3>
                <div className="space-y-3">
                  {pets.map((pet) => (
                    <div
                      key={pet.pet_id}
                      className="p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-linear-to-br from-primary to-[#FEA08E] rounded-xl flex items-center justify-center shrink-0">
                          {pet.profileURL?.link ? (
                            <img
                              src={pet.profileURL.link}
                              alt={pet.name}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-white">
                              {pet.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-lg mb-1">
                            {pet.name}
                          </h4>
                          <p className="text-sm capitalize text-gray-600 mb-2">
                            {pet.species} • {pet.breed}
                          </p>
                          <div className="text-xs text-gray-500 space-y-1">
                            <div className="flex items-center gap-2">
                              <span>ID: {pet.pet_id}</span>
                              <span>•</span>
                              <span>{calculateAge(pet.birthdate)}</span>
                              <span>•</span>
                              <span className="capitalize">{pet.gender}</span>
                            </div>
                            {pet.owner && (
                              <div>
                                <span className="font-medium">Owner: </span>
                                <span>{pet.owner.first_name} {pet.owner.last_name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddPatient(pet)}
                          disabled={adding}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {adding && selectedPet?.pet_id === pet.pet_id ? (
                            <>
                              <FiLoader className="w-4 h-4 animate-spin" />
                              <span>Adding...</span>
                            </>
                          ) : (
                            <span>Add Patient</span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!searching && pets.length === 0 && email && (
              <div className="text-center py-8">
                <p className="text-gray-500">No pets found for this email address</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />
    </>
  );
}

