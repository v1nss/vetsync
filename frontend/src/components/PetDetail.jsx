import { useState, useEffect, useMemo, memo } from "react";
import { getEHRsByPet } from "../global/api/ehr";
import { updatePet } from "../global/api/pet";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

// Move these components outside to prevent recreation on every render
const InfoCard = memo(({ label, value }) => (
  <div className="text-center md:p-4 md:bg-gray-50 md:rounded-2xl">
    <p className="font-medium mb-1 text-xl md:text-2xl">
      {value || '-'}
    </p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
));

const InfoSection = memo(({ title, children }) => (
  <div className="mb-6">
    <h3 className="font-medium mb-3 md:text-xl">{title}</h3>
    {children}
  </div>
));

const InfoRow = memo(({ label, value }) => (
  <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-medium text-right max-w-[60%]">{value || '-'}</span>
  </div>
));

export default function PetDetail({ pet, onUpdate }) {
  const [recentEHRs, setRecentEHRs] = useState([]);
  const [loadingEHRs, setLoadingEHRs] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedPet, setEditedPet] = useState(pet);
  const [errors, setErrors] = useState({});
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);

  // Initialize editedPet when pet changes (only when not editing)
  useEffect(() => {
    if (!isEditing) {
      setEditedPet(pet);
      setProfileImagePreview(null);
      setSelectedProfileImage(null);
    }
  }, [pet.pet_id]); // Only depend on pet_id to avoid unnecessary resets
  
  // Reset editing state and errors when switching pets
  useEffect(() => {
    setIsEditing(false);
    setErrors({});
    setProfileImagePreview(null);
    setSelectedProfileImage(null);
  }, [pet.pet_id]);

  useEffect(() => {
    const fetchRecentEHRs = async () => {
      if (pet && pet.pet_id) {
        setLoadingEHRs(true);
        try {
          const res = await getEHRsByPet(pet.pet_id);
          if (res && res.ehrs && res.ehrs.length > 0) {
            // Get the 2 most recent EHR records
            const recent = res.ehrs.slice(0, 2).map(ehr => ({
              id: ehr.id,
              date: ehr.visit_date,
              reason: ehr.appointment?.service || "General Checkup",
              clinic: ehr.clinic?.name || "Veterinary Clinic"
            }));
            setRecentEHRs(recent);
          }
        } catch (err) {
          console.error("Error fetching recent EHRs:", err);
        } finally {
          setLoadingEHRs(false);
        }
      }
    };

    fetchRecentEHRs();
  }, [pet.pet_id]); // Only depend on pet_id

  const handleInputChange = (field, value) => {
    setEditedPet(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    // Validate
    const newErrors = {};
    if (!editedPet.name?.trim()) newErrors.name = "Pet name is required";
    if (!editedPet.species?.trim()) newErrors.species = "Species is required";
    if (!editedPet.breed?.trim()) newErrors.breed = "Breed is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      
      // Prepare pet data
      const petDataToSend = {
        name: editedPet.name,
        species: editedPet.species,
        breed: editedPet.breed,
        birthdate: editedPet.birthdate,
        gender: editedPet.gender,
        color: editedPet.color,
        weight: editedPet.weight,
        allergies: editedPet.allergies || '',
        current_medications: editedPet.current_medications || '',
        notes: editedPet.notes || ''
      };
      
      formData.append('pet', JSON.stringify(petDataToSend));
      
      // Append profile image if a new one was selected
      if (selectedProfileImage) {
        formData.append('file', selectedProfileImage);
      }
      
      const response = await updatePet(pet.pet_id, formData);
      
      setIsEditing(false);
      setProfileImagePreview(null);
      setSelectedProfileImage(null);
      
      if (onUpdate && response.pet) {
        onUpdate(response.pet);
      }
      
      // Also update local state to reflect changes immediately
      setEditedPet(response.pet || pet);
    } catch (err) {
      console.error("Error updating pet:", err);
      setErrors({ submit: err.response?.data?.error || err.message || "Failed to update pet" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedPet(pet);
    setIsEditing(false);
    setErrors({});
    setProfileImagePreview(null);
    setSelectedProfileImage(null);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profileImage: 'Please select an image file' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5000000) {
        setErrors(prev => ({ ...prev, profileImage: 'Image size must be less than 5MB' }));
        return;
      }

      setSelectedProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      if (errors.profileImage) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.profileImage;
          return newErrors;
        });
      }
    }
  };

  // Memoize age calculation to prevent unnecessary re-renders
  const petAge = useMemo(() => {
    const birthdate = pet?.birthdate;
    if (!birthdate) return null;
    
    const birth = new Date(birthdate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0) {
      return `${years}y${months > 0 ? ` ${months}m` : ''}`;
    } else if (months > 0) {
      return `${months}m`;
    } else {
      const days = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
      return `${days}d`;
    }
  }, [pet?.birthdate]);

  return (
    <div className="p-4 max-w-2xl mx-auto md:p-0">
      {/* Edit/Save Buttons */}
      <div className="flex justify-end gap-2 mb-4">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-[#FEA08E] transition text-sm font-medium"
          >
            <FaEdit /> Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium disabled:opacity-50"
            >
              <FaTimes /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-[#FEA08E] transition text-sm font-medium disabled:opacity-50"
            >
              <FaSave /> {isSaving ? 'Saving...' : 'Save'}
            </button>
          </>
        )}
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {errors.submit}
        </div>
      )}

      {/* Pet Image */}
      <div className="w-full aspect-square bg-gray-200 rounded-2xl overflow-hidden mb-4 sm:max-w-xs sm:mx-auto md:mb-6 relative group">
        <img 
          src={profileImagePreview || pet.profileURL?.link || '/placeholder-pet.png'} 
          alt={pet.name} 
          className="w-full h-full object-cover" 
        />
        {isEditing && (
          <>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-white text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition text-sm font-medium flex items-center gap-2">
                <FaEdit className="text-xs" />
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {selectedProfileImage && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                New photo selected
              </div>
            )}
            {errors.profileImage && (
              <p className="absolute bottom-2 left-2 right-2 text-red-500 text-xs bg-white/90 px-2 py-1 rounded text-center">{errors.profileImage}</p>
            )}
          </>
        )}
      </div>

      {/* Pet Name & Breed */}
      <div className="text-center mb-6">
        {isEditing ? (
          <>
            <input
              key={`name-${pet.pet_id}`}
              type="text"
              value={editedPet.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="font-semibold text-xl mb-1 md:text-2xl md:mb-2 text-center w-full border border-gray-300 rounded-xl px-4 py-2"
              placeholder="Pet name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            <input
              key={`breed-${pet.pet_id}`}
              type="text"
              value={editedPet.breed || ''}
              onChange={(e) => handleInputChange('breed', e.target.value)}
              className="text-gray-500 md:text-lg text-center w-full border border-gray-300 rounded-xl px-4 py-2 mt-2"
              placeholder="Breed"
            />
            {errors.breed && <p className="text-red-500 text-xs mt-1">{errors.breed}</p>}
          </>
        ) : (
          <>
            <h2 className="font-semibold text-xl mb-1 md:text-2xl md:mb-2">
              {pet.name}
            </h2>
            <p className="text-gray-500 md:text-lg">{pet.breed}</p>
          </>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 md:gap-6 md:mb-8">
        <InfoCard label="Gender" value={isEditing ? (editedPet.gender === 'male' ? 'Male' : editedPet.gender === 'female' ? 'Female' : '-') : (pet.gender === 'male' ? 'Male' : pet.gender === 'female' ? 'Female' : '-')} />
        <InfoCard label="Age" value={petAge} />
        <InfoCard label="Weight" value={isEditing ? (editedPet.weight || '-') : (pet.weight || '-')} />
      </div>

      {/* Basic Information */}
      <InfoSection title="Basic Information">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          {isEditing ? (
            <div className="space-y-3">
               <div>
                 <label className="text-sm text-gray-600 block mb-1">Species</label>
                 <select
                   key={`species-${pet.pet_id}`}
                   value={editedPet.species || ''}
                   onChange={(e) => handleInputChange('species', e.target.value)}
                   className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                 >
                   <option value="">Select species</option>
                   <option value="dog">Dog</option>
                   <option value="cat">Cat</option>
                   <option value="bird">Bird</option>
                   <option value="rabbit">Rabbit</option>
                   <option value="other">Other</option>
                 </select>
                 {errors.species && <p className="text-red-500 text-xs mt-1">{errors.species}</p>}
               </div>
               <div>
                 <label className="text-sm text-gray-600 block mb-1">Gender</label>
                 <select
                   key={`gender-${pet.pet_id}`}
                   value={editedPet.gender || ''}
                   onChange={(e) => handleInputChange('gender', e.target.value)}
                   className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                 >
                   <option value="">Select gender</option>
                   <option value="male">Male</option>
                   <option value="female">Female</option>
                 </select>
               </div>
               <div>
                 <label className="text-sm text-gray-600 block mb-1">Color</label>
                 <input
                   key={`color-${pet.pet_id}`}
                   type="text"
                   value={editedPet.color || ''}
                   onChange={(e) => handleInputChange('color', e.target.value)}
                   className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                   placeholder="Pet color"
                 />
               </div>
               <div>
                 <label className="text-sm text-gray-600 block mb-1">Date of Birth</label>
                 <input
                   key={`birthdate-${pet.pet_id}`}
                   type="date"
                   value={editedPet.birthdate || ''}
                   onChange={(e) => handleInputChange('birthdate', e.target.value)}
                   className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                 />
               </div>
               <div>
                 <label className="text-sm text-gray-600 block mb-1">Weight</label>
                 <input
                   key={`weight-${pet.pet_id}`}
                   type="text"
                   value={editedPet.weight || ''}
                   onChange={(e) => handleInputChange('weight', e.target.value)}
                   className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                   placeholder="e.g., 5.5 kg or 12 lbs"
                 />
               </div>
            </div>
          ) : (
            <>
              <InfoRow label="Species" value={pet.species ? pet.species.charAt(0).toUpperCase() + pet.species.slice(1) : '-'} />
              <InfoRow label="Gender" value={pet.gender === 'male' ? 'Male' : pet.gender === 'female' ? 'Female' : '-'} />
              <InfoRow label="Color" value={pet.color} />
              <InfoRow label="Date of Birth" value={pet.dateOfBirth || pet.birthdate || '-'} />
              <InfoRow label="Weight" value={pet.weight} />
            </>
          )}
        </div>
      </InfoSection>

      {/* Medical Information */}
      {/* <InfoSection title="Medical Information">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Allergies</label>
                <textarea
                  value={editedPet.allergies || ''}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm resize-none"
                  rows="2"
                  placeholder="List any allergies"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Current Medications</label>
                <textarea
                  value={editedPet.current_medications || editedPet.medications || ''}
                  onChange={(e) => handleInputChange('current_medications', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm resize-none"
                  rows="2"
                  placeholder="List current medications"
                />
              </div>
            </div>
          ) : (
            <>
              <InfoRow label="Allergies" value={pet.allergies} />
              <InfoRow label="Current Medications" value={pet.medications} />
            </>
          )}
        </div>
      </InfoSection> */}

      {/* Additional Notes */}
      {/* <InfoSection title="Additional Notes">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          {isEditing ? (
            <textarea
              value={editedPet.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm resize-none"
              rows="3"
              placeholder="Additional notes about your pet"
            />
          ) : (
            <p className="text-sm text-gray-700">{pet.notes || '-'}</p>
          )}
        </div>
      </InfoSection> */}

      {/* Recent Appointments */}
      <InfoSection title="Recent Health Records">
        <div className="space-y-3">
          {loadingEHRs ? (
            <>
              <div className="bg-gray-200 rounded-2xl h-16 md:h-20 animate-pulse"></div>
              <div className="bg-gray-200 rounded-2xl h-16 md:h-20 animate-pulse"></div>
            </>
          ) : recentEHRs.length > 0 ? (
            recentEHRs.map((ehr) => (
              <div key={ehr.id} className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">{ehr.reason}</p>
                    <p className="text-sm text-gray-600">{ehr.clinic}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(ehr.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-500">No health records available</p>
            </div>
          )}
        </div>
      </InfoSection>
    </div>
  );
}