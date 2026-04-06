import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaChevronLeft, FaMars, FaVenus, FaEdit, FaSave, FaTimes, FaPaw, FaChevronDown, FaHeart, FaCalendar, FaWeight, FaStethoscope } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Pagination from '../../components/Pagination';
import { fetchAllPetsById, updatePet } from '../../global/api/pet';
import { getEHRsByPet } from '../../global/api/ehr';

// Utility function
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

// FormField Component
function FormField({ label, type = 'text', value, onChange, error, placeholder, options, fullWidth, className = '', rows = 1 }) {
  const baseClasses = `w-full px-3 py-2.5 text-sm border-2 rounded-lg transition focus:outline-none ${
    error 
      ? 'border-red-300 focus:border-red-500 bg-red-50' 
      : 'border-gray-200 focus:border-primary bg-white hover:border-gray-300'
  }`;

  return (
    <div className={fullWidth ? 'md:col-span-2' : ''} style={className ? { marginTop: className === 'mt-4' ? '1rem' : '' } : {}}>
      <label className="text-xs font-bold text-gray-700 block mb-2 uppercase tracking-wide">{label}</label>
      {type === 'select' ? (
        <select value={value} onChange={onChange} className={baseClasses}>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} className={baseClasses} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={baseClasses} />
      )}
      {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
    </div>
  );
}

// DetailCard Component
function DetailCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
      <div className="flex items-start gap-2">
        {Icon && <Icon className="text-primary text-xs mt-0.5 shrink-0" />}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
          <p className="text-sm font-bold text-gray-800 mt-1 truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}


// PetTableRow Component
function PetTableRow({ pet, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedPet, setEditedPet] = useState(pet);
  const [errors, setErrors] = useState({});
  const [recentEHRs, setRecentEHRs] = useState([]);
  const [loadingEHRs, setLoadingEHRs] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);

  useEffect(() => {
    if (!isEditing) setEditedPet(pet);
  }, [pet.pet_id]);

  useEffect(() => {
    if (expanded && recentEHRs.length === 0 && !loadingEHRs) {
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
    }
  }, [expanded, pet.pet_id]);

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
    <>
      {/* Main Row */}
      <div className={`grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 py-4 px-3 md:px-4 border-b border-gray-100 items-center transition-all duration-200 cursor-pointer ${
        expanded 
          ? 'bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/8' 
          : 'hover:bg-gray-50'
      }`}>
        {/* Name & Gender */}
        <div className="flex items-center gap-3" onClick={() => setExpanded(!expanded)}>
          <button 
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} 
            className={`p-1.5 rounded-md transition-all duration-200 ${expanded ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-400'}`}
          >
            <FaChevronDown className={`text-xs transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 shrink-0 ring-2 ring-white shadow-sm">
            <img src={pet.profileURL?.link || '/placeholder-pet.png'} alt={pet.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-800 truncate text-sm">{pet.name}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <GenderIcon className={`${genderColor} text-xs`} />
              {pet.gender ? (pet.gender === 'male' ? 'Male' : 'Female') : '—'}
            </p>
          </div>
        </div>

        {/* Breed */}
        <div className="hidden md:block px-1">
          <p className="text-sm font-medium text-gray-700 truncate">{pet.breed || '—'}</p>
        </div>

        {/* Species */}
        <div className="hidden md:block px-1">
          <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
            {pet.species ? pet.species.charAt(0).toUpperCase() + pet.species.slice(1) : '—'}
          </span>
        </div>

        {/* Age */}
        <div className="hidden md:flex md:items-center md:gap-1 px-1 text-gray-700">
          <FaCalendar className="text-xs text-gray-400" />
          <p className="text-sm font-medium">{petAge || '—'}</p>
        </div>

        {/* Weight */}
        <div className="hidden md:flex md:items-center md:gap-1 px-1 text-gray-700">
          <FaWeight className="text-xs text-gray-400" />
          <p className="text-sm font-medium">{pet.weight || '—'}</p>
        </div>

        {/* Mobile details summary */}
        <div className="md:hidden text-xs text-gray-600 space-y-1 ml-12">
          {pet.breed && <p className="font-medium">{pet.breed}</p>}
          <div className="flex gap-3 text-gray-500 text-xs">
            {petAge && <span>• {petAge}</span>}
            {pet.weight && <span>• {pet.weight}</span>}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="bg-gradient-to-b from-primary/3 to-primary/1 px-3 md:px-4 py-6 border-b-2 border-primary/10 animate-in fade-in slide-in-from-top-2 duration-200">
          {isEditing ? (
            <div className="space-y-6">
              {errors.submit && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="text-red-700 text-sm font-medium">{errors.submit}</p>
                </div>
              )}

              {/* Edit Form */}
              <div className="space-y-5">
                {/* Profile Image Section */}
                <div className="border-b border-gray-200 pb-5">
                  <label className="text-xs text-gray-600 font-bold block mb-3 uppercase tracking-wide">Profile Image</label>
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 group relative ring-2 ring-white shadow-md">
                    <img src={profileImagePreview || pet.profileURL?.link || '/placeholder-pet.png'} alt={pet.name} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                      <FaEdit className="text-white text-lg mb-1" />
                      <span className="text-white text-xs">Change</span>
                      <input type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" />
                    </label>
                  </div>
                  {errors.profileImage && <p className="text-red-500 text-xs mt-2">{errors.profileImage}</p>}
                </div>

                {/* Basic Info Grid */}
                <div>
                  <h3 className="text-xs text-gray-600 font-bold mb-3 uppercase tracking-wide">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField 
                      label="Pet Name" 
                      type="text" 
                      value={editedPet.name || ''} 
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={errors.name}
                      placeholder="Pet name"
                    />
                    <FormField 
                      label="Species" 
                      type="select" 
                      value={editedPet.species || ''} 
                      onChange={(e) => handleInputChange('species', e.target.value)}
                      error={errors.species}
                      options={[
                        { value: '', label: 'Select species' },
                        { value: 'dog', label: 'Dog' },
                        { value: 'cat', label: 'Cat' },
                        { value: 'bird', label: 'Bird' },
                        { value: 'rabbit', label: 'Rabbit' },
                        { value: 'other', label: 'Other' }
                      ]}
                    />
                    <FormField 
                      label="Breed" 
                      type="text" 
                      value={editedPet.breed || ''} 
                      onChange={(e) => handleInputChange('breed', e.target.value)}
                      error={errors.breed}
                      placeholder="Breed"
                    />
                    <FormField 
                      label="Gender" 
                      type="select" 
                      value={editedPet.gender || ''} 
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      options={[
                        { value: '', label: 'Select gender' },
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' }
                      ]}
                    />
                  </div>
                </div>

                {/* Physical Info Grid */}
                <div>
                  <h3 className="text-xs text-gray-600 font-bold mb-3 uppercase tracking-wide">Physical Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField 
                      label="Color" 
                      type="text" 
                      value={editedPet.color || ''} 
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="Pet color"
                    />
                    <FormField 
                      label="Date of Birth" 
                      type="date" 
                      value={editedPet.birthdate || ''} 
                      onChange={(e) => handleInputChange('birthdate', e.target.value)}
                    />
                    <FormField 
                      label="Weight" 
                      type="text" 
                      value={editedPet.weight || ''} 
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="e.g. 5.5 kg"
                    />
                  </div>
                </div>

                {/* Health Info */}
                <div>
                  <h3 className="text-xs text-gray-600 font-bold mb-3 uppercase tracking-wide">Health Information</h3>
                  <FormField 
                    label="Allergies" 
                    type="text" 
                    value={editedPet.allergies || ''} 
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    placeholder="List any known allergies"
                    fullWidth
                  />
                  <FormField 
                    label="Current Medications" 
                    type="text" 
                    value={editedPet.current_medications || ''} 
                    onChange={(e) => handleInputChange('current_medications', e.target.value)}
                    placeholder="List current medications"
                    fullWidth
                    className="mt-4"
                  />
                  <FormField 
                    label="Additional Notes" 
                    type="textarea" 
                    value={editedPet.notes || ''} 
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any other notes about your pet"
                    fullWidth
                    className="mt-4"
                    rows="3"
                  />
                </div>
              </div>

              {/* Save/Cancel Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button onClick={handleCancel} disabled={isSaving}
                  className="flex-1 border-2 border-gray-300 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/90 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <FaSave className="text-xs" /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Details Grid */}
              <div>
                <h3 className="text-xs text-gray-600 font-bold mb-4 uppercase tracking-wide">Quick Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <DetailCard icon={FaCalendar} label="Date of Birth" value={pet.birthdate || '—'} />
                  <DetailCard icon={null} label="Age" value={petAge || '—'} />
                  <DetailCard icon={FaWeight} label="Weight" value={pet.weight || '—'} />
                  <DetailCard icon={null} label="Color" value={pet.color || '—'} />
                </div>
              </div>

              {/* Health & Medical */}
              {(pet.allergies || pet.current_medications || pet.notes) && (
                <div className="border-y border-gray-200 py-4">
                  <h3 className="text-xs text-gray-600 font-bold mb-3 uppercase tracking-wide">Health & Medical</h3>
                  <div className="space-y-3">
                    {pet.allergies && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                        <p className="text-xs text-red-700 font-semibold">⚠️ Allergies</p>
                        <p className="text-sm text-red-900 mt-1">{pet.allergies}</p>
                      </div>
                    )}
                    {pet.current_medications && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                        <p className="text-xs text-blue-700 font-semibold">💊 Current Medications</p>
                        <p className="text-sm text-blue-900 mt-1">{pet.current_medications}</p>
                      </div>
                    )}
                    {pet.notes && (
                      <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
                        <p className="text-xs text-amber-700 font-semibold">📝 Notes</p>
                        <p className="text-sm text-amber-900 mt-1">{pet.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Health Records */}
              {(loadingEHRs || recentEHRs.length > 0) && (
                <div>
                  <h3 className="text-xs text-gray-600 font-bold mb-3 uppercase tracking-wide flex items-center gap-2">
                    <FaStethoscope className="text-primary" /> Recent Health Records
                  </h3>
                  {loadingEHRs ? (
                    <div className="space-y-2">
                      <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse" />
                      <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse" />
                    </div>
                  ) : recentEHRs.length > 0 ? (
                    <div className="space-y-2">
                      {recentEHRs.map(ehr => (
                        <div key={ehr.id} className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-lg p-3 flex justify-between hover:shadow-md transition">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{ehr.reason}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{ehr.clinic}</p>
                          </div>
                          <p className="text-xs font-medium text-primary shrink-0 ml-3">
                            {new Date(ehr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Edit Button */}
              <button onClick={() => setIsEditing(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/15 hover:to-primary/10 px-4 py-3 rounded-lg text-sm font-semibold text-primary transition">
                <FaEdit className="text-sm" /> Edit Pet Information
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// Main Page
export default function ManagePetsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;

  const totalPages = pets ? Math.max(1, Math.ceil(pets.length / PAGE_SIZE)) : 1;
  const pagedPets = pets?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) || [];

  useEffect(() => {
    const fetchAllPets = async () => {
      setLoading(true);
      try {
        const res = await fetchAllPetsById();
        setPets(res || null);
        setCurrentPage(1);
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
      <div className="sticky top-0 z-40 bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between sm:hidden shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-semibold"
        >
          <FaChevronLeft className="text-sm" />
          <span className="text-lg">My Pets</span>
        </button>
        <button
          onClick={handleAddPet}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition"
        >
          <FaPlus className="text-xs" /> Add Pet
        </button>
      </div>

      {/* Desktop Add Pet button */}
      <div className="hidden sm:flex justify-between items-center mx-auto sm:px-8 lg:px-16 pt-6 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
        <button
          onClick={handleAddPet}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-lg transition"
        >
          <FaPlus className="text-xs" /> Add Pet
        </button>
      </div>

      {/* Content */}
      <div className="mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 px-4 border-b border-gray-200 bg-gray-50">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse" />
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse hidden md:block" />
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse hidden md:block" />
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse hidden md:block" />
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse hidden md:block" />
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`grid grid-cols-1 md:grid-cols-5 gap-4 py-4 px-4 ${i < 3 ? 'border-b border-gray-100' : ''}`}>
                <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse" />
                <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse hidden md:block" />
                <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse hidden md:block" />
                <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse hidden md:block" />
                <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse hidden md:block" />
              </div>
            ))}
          </div>
        ) : !pets || pets.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <FaPaw className="text-4xl text-primary opacity-60" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No pets yet</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm">Add your furry family members to get started</p>
            <button
              onClick={handleAddPet}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              <FaPlus /> Add your first pet
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 py-4 px-3 md:px-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2 font-bold text-gray-700 text-xs uppercase tracking-wider">
                <span className="w-6" />
                <span>Pet Name</span>
              </div>
              <div className="hidden md:block font-bold text-gray-700 text-xs uppercase tracking-wider">Breed</div>
              <div className="hidden md:block font-bold text-gray-700 text-xs uppercase tracking-wider">Species</div>
              <div className="hidden md:block font-bold text-gray-700 text-xs uppercase tracking-wider">Age</div>
              <div className="hidden md:block font-bold text-gray-700 text-xs uppercase tracking-wider">Weight</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {pagedPets.map(pet => (
                <PetTableRow key={pet.pet_id} pet={pet} onUpdate={handlePetUpdate} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-3 md:px-4 py-4 border-t border-gray-200 bg-gray-50/50">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}