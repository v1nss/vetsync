import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaCheckCircle, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import { registerPet } from '../../global/api/pet';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import NotificationModal from '../../components/NotificationModal';

const InputField = ({ label, name, value, onChange, error, required, ...props }) => (
  <div>
    <label className={`block text-sm font-medium text-gray-700 mb-2 ${required ? 'label-required' : ''}`}>
      {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
      {...props}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const TextareaField = ({ label, name, value, onChange, rows = 2, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl resize-none"
      {...props}
    />
  </div>
);

const ButtonGroup = ({ options, name, required, formData, handleChange, errors }) => (
  <div>
    <label className={`block text-sm font-medium text-gray-700 mb-2 ${required ? 'label-required' : ''}`}>
      {name === 'species' ? 'Species' : name === 'gender' ? 'Gender' : name}
    </label>
    <div className="grid grid-cols-2 gap-3">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => handleChange({ target: { name, value: opt.value }})}
          className={`px-4 py-3 rounded-2xl transition ${
            formData[name] === opt.value
              ? 'bg-primary text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
    {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
  </div>
);

export default function AddPetPage() {
  const {token} = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', breed: '', gender: '', weight: '', color: '', species: '',
    birthdate: '', allergies: '', medications: '', notes: '', image: null
  });
  const [petProfile, setPetProfile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const showNotification = (type, title, message) => {
    setNotification({ isOpen: true, type, title, message });
  };

  const closeNotification = () => {
    setNotification({ ...notification, isOpen: false });
    if (notification.type === 'success') {
      navigate('/pet-owner/pets');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (!file) {
      return;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      showNotification('error', 'Invalid File Type', 'Only PNG, JPG, and JPEG images are allowed.');
      e.target.value = "";
      setPetProfile(null);
      setPreview(null);
      setErrors(prev => ({ ...prev, image: 'Invalid file type' }));
      return;
    }

    // Check file size
    if (file.size > maxSizeInBytes) {
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      showNotification('error', 'File Too Large', `The selected file is ${fileSizeInMB}MB. Please choose an image smaller than 5MB.`);
      e.target.value = "";
      setPetProfile(null);
      setPreview(null);
      setErrors(prev => ({ ...prev, image: 'File must be less than 5MB' }));
      return;
    }

    // Clear any previous errors
    setErrors(prev => ({ ...prev, image: '' }));
    
    // Set the file and preview
    setPetProfile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Pet name is required';
    if (!formData.species) newErrors.species = 'Species is required';
    if (!formData.breed.trim()) newErrors.breed = 'Breed is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.weight.trim()) newErrors.weight = 'Weight is required';
    if (!petProfile) newErrors.image = 'Pet photo is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showNotification('error', 'Validation Error', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      var data = new FormData();
      data.append('pet', JSON.stringify(formData));

      if (petProfile) {
        data.append('file', petProfile); 
      }
      
      const res = await registerPet(data);
      console.log("Pet Created Successfully: ", res);
      showNotification('success', 'Pet Added Successfully!', `${formData.name} has been added to your pets.`);
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      showNotification('error', 'Registration Failed', err.response?.data?.message || 'An error occurred while adding your pet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate("/pet-owner/pets");

  return (
    <>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      <div className="hidden sm:block">
        <Navbar />
      </div>
      {/* Mobile */}
      <div className="sm:hidden min-h-screen bg-white pb-20">
        <div className="top-0 sm:hidden fixed left-0 p-4 z-40 flex items-center gap-2 bg-white w-full border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-gray-300 transition"
            disabled={isSubmitting}
          >
            <FaChevronLeft className="text-gray-500" />
          </button>
          <h1 className="text-xl font-medium">Add Pet</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="pt-20 p-4 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="label-required block text-sm font-medium text-gray-700 mb-2">Pet Photo</label>
            <div className={`w-full aspect-square max-w-xs mx-auto ${preview ? 'bg-gray-200' : 'border-2 border-dashed border-gray-300'} rounded-2xl overflow-hidden mb-3 flex items-center justify-center`}>
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <p className="text-sm text-gray-500">Upload pet photo</p>
              )}
            </div>
            <input 
              type="file" 
              accept="image/png,image/jpeg,image/jpg" 
              onChange={handleImageChange} 
              className="hidden" 
              id="petImage"
              disabled={isSubmitting}
            />
            <label 
              htmlFor="petImage" 
              className={`block w-full text-center px-4 py-2 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Choose Photo
            </label>
            {errors.image && <p className="text-red-500 text-xs mt-1 text-center">{errors.image}</p>}
            <p className="text-xs text-gray-500 mt-2 text-center">Maximum file size: 5MB</p>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            <InputField label="Pet Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} required placeholder="Enter pet name" disabled={isSubmitting} />
            <ButtonGroup 
              name="species" 
              required 
              options={[{value: 'dog', label: 'Dog'}, {value: 'cat', label: 'Cat'}]}
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />            
            <InputField label="Breed" name="breed" value={formData.breed} onChange={handleChange} error={errors.breed} required placeholder="Enter breed" disabled={isSubmitting} />
            <InputField label="Color" name="color" value={formData.color} onChange={handleChange} placeholder="e.g., Golden, Black & White" disabled={isSubmitting} />
            <ButtonGroup 
              name="gender" 
              required 
              options={[{value: 'male', label: 'Male'}, {value: 'female', label: 'Female'}]}
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />            
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Date of Birth" name="birthdate" value={formData.birthdate} onChange={handleChange} required type="date" disabled={isSubmitting} />
              <InputField label="Weight" name="weight" value={formData.weight} onChange={handleChange} error={errors.weight} required placeholder="e.g., 8kg" disabled={isSubmitting} />
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Medical Information (Optional)</h3>
            <TextareaField label="Allergies" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="List any known allergies" disabled={isSubmitting} />
            <TextareaField label="Current Medications" name="medications" value={formData.medications} onChange={handleChange} placeholder="List current medications" disabled={isSubmitting} />
          </div>

          <TextareaField label="Additional Notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Any other important information about your pet" disabled={isSubmitting} />
        </form>

        {/* Fixed Bottom Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-3">
          <button 
            type="button" 
            onClick={handleCancel} 
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSubmit} 
            className="flex-1 px-4 py-3 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Pet...' : 'Add Pet'}
          </button>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:block min-h-screen bg-background">
        <div className="max-w-4xl mx-auto py-8 px-6">
          <div className="flex items-center gap-4 mb-8">
            <button 
              type="button" 
              onClick={handleCancel} 
              className="flex items-center gap-2 rounded-full"
              disabled={isSubmitting}
            >
              <FaChevronLeft className="text-gray-500" />
              <h1 className="text-2xl font-medium">Add New Pet</h1>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Same content as mobile */}
              <div>
                <label className="label-required block text-sm font-medium text-gray-700 mb-2">Pet Photo</label>
                <div className={`w-full aspect-square max-w-xs mx-auto ${preview ? 'bg-gray-200' : 'border-2 border-dashed border-gray-300'} rounded-2xl overflow-hidden mb-3 flex items-center justify-center`}>
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <p className="text-sm text-gray-500">Upload pet photo</p>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/png,image/jpeg,image/jpg" 
                  onChange={handleImageChange} 
                  className="hidden" 
                  id="petImageDesktop"
                  disabled={isSubmitting}
                />
                <label 
                  htmlFor="petImageDesktop" 
                  className={`block w-full max-w-xs mx-auto text-center px-4 py-2 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Choose Photo
                </label>
                {errors.image && <p className="text-red-500 text-xs mt-1 text-center">{errors.image}</p>}
                <p className="text-xs text-gray-500 mt-2 text-center">Maximum file size: 5MB</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>
                <InputField label="Pet Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} required placeholder="Enter pet name" disabled={isSubmitting} />
                <ButtonGroup 
                  name="species" 
                  required 
                  options={[{value: 'dog', label: 'Dog'}, {value: 'cat', label: 'Cat'}]}
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />                
                <InputField label="Breed" name="breed" value={formData.breed} onChange={handleChange} error={errors.breed} required placeholder="Enter breed" disabled={isSubmitting} />
                <InputField label="Color" name="color" value={formData.color} onChange={handleChange} placeholder="e.g., Golden, Black & White" disabled={isSubmitting} />
                <ButtonGroup 
                  name="gender" 
                  required 
                  options={[{value: 'male', label: 'Male'}, {value: 'female', label: 'Female'}]}
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />                
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Date of Birth" name="birthdate" value={formData.birthdate} onChange={handleChange} required type="date" disabled={isSubmitting} />
                  <InputField label="Weight" name="weight" value={formData.weight} onChange={handleChange} error={errors.weight} required placeholder="e.g., 8kg" disabled={isSubmitting} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Medical Information (Optional)</h3>
                <TextareaField label="Allergies" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="List any known allergies" disabled={isSubmitting} />
                <TextareaField label="Current Medications" name="medications" value={formData.medications} onChange={handleChange} placeholder="List current medications" disabled={isSubmitting} />
              </div>

              <TextareaField label="Additional Notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Any other important information about your pet" disabled={isSubmitting} />

              <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={handleCancel} 
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding Pet...' : 'Add Pet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}