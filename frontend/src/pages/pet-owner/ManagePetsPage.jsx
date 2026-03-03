import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaChevronLeft, FaMars, FaVenus, FaEdit, FaSave, FaTimes, FaPaw } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import { fetchAllPetsById, updatePet } from '../../global/api/pet';
import { getEHRsByPet } from '../../global/api/ehr';

// Sub-components

const InfoPill = ({ label, value }) => (
  <div className="flex flex-col items-center bg-[#FFF7F5] rounded-2xl px-2 py-3">
    <span className="text-sm font-semibold text-gray-800">{value || '—'}</span>
    <span className="text-[11px] text-gray-400 mt-0.5">{label}</span>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-xs text-gray-400">{label}</span>
    <span className="text-xs font-medium text-gray-700 max-w-[55%] text-right">{value || '—'}</span>
  </div>
);

function calcAge(birthdate) {
  if (!birthdate) return null;
  const birth = new Date(birthdate);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years > 0) return `${years}y${months > 0 ? ` ${months}m` : ''}`;
  if (months > 0) return `${months}m`;
  return `${Math.floor((today - birth) / 86400000)}d`;
}

// PetCard

function PetCard({ pet, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedPet, setEditedPet] = useState(pet);
  const [errors, setErrors] = useState({});
  const [recentEHRs, setRecentEHRs] = useState([]);
  const [loadingEHRs, setLoadingEHRs] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isEditing) setEditedPet(pet);
  }, [pet.pet_id]);

  useEffect(() => {
    const fetchEHRs = async () => {
      if (!pet?.pet_id) return;
      setLoadingEHRs(true);
      try {
        const res = await getEHRsByPet(pet.pet_id);
        if (res?.ehrs?.length > 0) {
          setRecentEHRs(res.ehrs.slice(0, 2).map(e => ({
            id: e.id,
            date: e.visit_date,
            reason: e.appointment?.service || 'General Checkup',
            clinic: e.clinic?.name || 'Veterinary Clinic'
          })));
        }
      } catch (err) { console.error(err); }
      finally { setLoadingEHRs(false); }
    };
    fetchEHRs();
  }, [pet.pet_id]);

  const handleInputChange = (field, value) => {
    setEditedPet(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!editedPet.name?.trim()) newErrors.name = 'Name is required';
    if (!editedPet.species?.trim()) newErrors.species = 'Species is required';
    if (!editedPet.breed?.trim()) newErrors.breed = 'Breed is required';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('pet', JSON.stringify({
        name: editedPet.name, species: editedPet.species, breed: editedPet.breed,
        birthdate: editedPet.birthdate, gender: editedPet.gender, color: editedPet.color,
        weight: editedPet.weight, allergies: editedPet.allergies || '',
        current_medications: editedPet.current_medications || '', notes: editedPet.notes || ''
      }));
      if (selectedProfileImage) formData.append('file', selectedProfileImage);
      const response = await updatePet(pet.pet_id, formData);
      setIsEditing(false);
      setProfileImagePreview(null);
      setSelectedProfileImage(null);
      if (onUpdate && response.pet) onUpdate(response.pet);
      setEditedPet(response.pet || pet);
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || err.message || 'Failed to update pet' });
    } finally { setIsSaving(false); }
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
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErrors(p => ({ ...p, profileImage: 'Select an image file' })); return; }
    if (file.size > 5000000) { setErrors(p => ({ ...p, profileImage: 'Image must be < 5MB' })); return; }
    setSelectedProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfileImagePreview(reader.result);
    reader.readAsDataURL(file);
    if (errors.profileImage) setErrors(p => { const n = { ...p }; delete n.profileImage; return n; });
  };

  const petAge = calcAge(pet.birthdate);
  const GenderIcon = pet.gender === 'male' ? FaMars : FaVenus;
  const genderColor = pet.gender === 'male' ? 'text-blue-400' : 'text-pink-400';

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Body */}
      <div className="pt-6 px-6 pb-6 flex flex-col flex-1">
        {/* Avatar row */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0 group relative">
            <img
              src={profileImagePreview || pet.profileURL?.link || '/placeholder-pet.png'}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <FaEdit className="text-white text-xs" />
                <input type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" />
              </label>
            )}
          </div>
          <div className="flex flex-col gap-2 ml-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-gray-50 transition"
              >
                <FaEdit className="text-xs" /> Edit
              </button>
            ) : (
              <>
                <button onClick={handleCancel} disabled={isSaving}
                  className="text-gray-500 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <FaTimes className="text-xs" /> Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving}
                  className="bg-primary text-white px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-[#FEA08E] transition disabled:opacity-50"
                >
                  <FaSave className="text-xs" /> {isSaving ? 'Saving…' : 'Save'}
                </button>
              </>
            )}
          </div>
        </div>
        {/* Name & gender */}
        <div className="mb-4">
          {isEditing ? (
            <div className="space-y-2">
              <div>
                <input
                  type="text" value={editedPet.name || ''}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className="font-semibold text-lg w-full border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-primary"
                  placeholder="Pet name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="text" value={editedPet.breed || ''}
                  onChange={e => handleInputChange('breed', e.target.value)}
                  className="text-sm text-gray-500 w-full border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-primary"
                  placeholder="Breed"
                />
                {errors.breed && <p className="text-red-500 text-xs mt-1">{errors.breed}</p>}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-gray-900">{pet.name}</h3>
                <GenderIcon className={`${genderColor} text-sm`} />
              </div>
              <p className="text-sm text-gray-400">{pet.breed}</p>
            </>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          <InfoPill label="Age" value={petAge} />
          <InfoPill label="Weight" value={isEditing ? editedPet.weight : pet.weight} />
          <InfoPill label="Species" value={isEditing
            ? (editedPet.species ? editedPet.species.charAt(0).toUpperCase() + editedPet.species.slice(1) : '—')
            : (pet.species ? pet.species.charAt(0).toUpperCase() + pet.species.slice(1) : '—')} />
        </div>

        {/* Details */}
        {isEditing ? (
          <div className="space-y-3 mb-5">
            {errors.submit && (
              <p className="text-red-500 text-xs bg-red-50 rounded-xl px-3 py-2">{errors.submit}</p>
            )}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Species</label>
              <select value={editedPet.species || ''} onChange={e => handleInputChange('species', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
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
              <label className="text-xs text-gray-400 block mb-1">Gender</label>
              <select value={editedPet.gender || ''} onChange={e => handleInputChange('gender', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Color</label>
              <input type="text" value={editedPet.color || ''} onChange={e => handleInputChange('color', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="Pet color" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Date of Birth</label>
              <input type="date" value={editedPet.birthdate || ''} onChange={e => handleInputChange('birthdate', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Weight</label>
              <input type="text" value={editedPet.weight || ''} onChange={e => handleInputChange('weight', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="e.g. 5.5 kg" />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-4 mb-5">
            <InfoRow label="Color" value={pet.color} />
            <InfoRow label="Date of Birth" value={pet.dateOfBirth || pet.birthdate} />
            <InfoRow label="Gender" value={pet.gender === 'male' ? 'Male' : pet.gender === 'female' ? 'Female' : null} />
          </div>
        )}

        {/* Health Records toggle */}
        {!isEditing && (
          <div className="mt-auto">
            <button
              onClick={() => setExpanded(p => !p)}
              className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-gray-600 transition mb-2 font-medium"
            >
              <span>Recent Health Records</span>
              <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {expanded && (
              <div className="space-y-2">
                {loadingEHRs ? (
                  <>
                    <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                    <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                  </>
                ) : recentEHRs.length > 0 ? recentEHRs.map(ehr => (
                  <div key={ehr.id} className="bg-[#FFF7F5] rounded-xl p-3 flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-gray-800">{ehr.reason}</p>
                      <p className="text-[11px] text-gray-400">{ehr.clinic}</p>
                    </div>
                    <p className="text-[11px] text-gray-400 flex-shrink-0 ml-2">
                      {new Date(ehr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                )) : (
                  <p className="text-xs text-gray-400 text-center py-3">No health records yet</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Main Page
export default function ManagePetsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState(null);

  useEffect(() => {
    const fetchAllPets = async () => {
      setLoading(true);
      try {
        const res = await fetchAllPetsById();
        setPets(res || null);
      } catch (err) {
        console.error('Unable to get pets:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPets();
  }, []);

  const handlePetUpdate = useCallback((updatedPet) => {
    setPets(prev => prev?.map(p => p.pet_id === updatedPet.pet_id ? updatedPet : p));
  }, []);

  const handleAddPet = () => navigate('add');

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="hidden sm:block">
        <Navbar />
      </div>

      {/* Header — mobile only */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between sm:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <FaChevronLeft className="text-sm" />
          <span className="font-semibold text-lg">My Pets</span>
        </button>
        <button
          onClick={handleAddPet}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-2xl text-sm font-medium hover:bg-[#FEA08E] transition"
        >
          <FaPlus className="text-xs" /> Add Pet
        </button>
      </div>

      {/* Desktop Add Pet button */}
      <div className="hidden sm:flex justify-end max-w-7xl mx-auto px-8 pt-6">
        <button
          onClick={handleAddPet}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-2xl text-sm font-medium hover:bg-[#FEA08E] transition"
        >
          <FaPlus className="text-xs" /> Add Pet
        </button>
      </div>

      {/* Content */}
      <div className="mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 h-80 animate-pulse" />
            ))}
          </div>
        ) : !pets || pets.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-[#FFF3F0] rounded-full flex items-center justify-center mb-6">
              <FaPaw className="text-4xl text-primary opacity-60" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No pets yet</h2>
            <p className="text-gray-400 text-sm mb-6">Add your furry family members to get started</p>
            <button
              onClick={handleAddPet}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#FEA08E] transition"
            >
              <FaPlus /> Add your first pet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map(pet => (
              <PetCard key={pet.pet_id} pet={pet} onUpdate={handlePetUpdate} />
            ))}

          </div>
        )}
      </div>
    </main>
  );
}