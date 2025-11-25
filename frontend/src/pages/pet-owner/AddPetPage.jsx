import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import { registerPet } from '../../global/api/pet';
import React from 'react';
import { useAuth } from '../../context/AuthContext';

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
    name: '', breed: '', gender: '', age: '', weight: '', color: '', species: '',
    dateOfBirth: '', allergies: '', medications: '', notes: '', image: null
  });
  const [petProfile, setPetProfile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]

    if (!file) {
      // setErrorMessage
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      // setErrorMessage("Invalid file type. Only PNG, JPG, and JPEG are allowed.");
      e.target.value = ""; // Reset the input field
      return;
    }

    if (file) {
      setPetProfile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Pet name is required';
    if (!formData.species) newErrors.species = 'Species is required';
    if (!formData.breed.trim()) newErrors.breed = 'Breed is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.age.trim()) newErrors.age = 'Age is required';
    if (!formData.weight.trim()) newErrors.weight = 'Weight is required';
    if (!petProfile) newErrors.image = 'Pet photo is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      var data = new FormData()
      data.append('pet', JSON.stringify(formData));

      if (petProfile) {
        data.append('file', petProfile); 
      }
      const res = await registerPet(data);
      console.log("pet created Succesfully: ", res)
      navigate('/pet-owner/pets');
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
    }

  };

  const handleCancel = () => navigate('/pets');



  return (
    <>
      <div className="hidden sm:block">
        <Navbar />
      </div>
      {/* Mobile */}
      <div className="sm:hidden min-h-screen bg-white pb-20">
        <div className="top-0 sm:hidden fixed left-0 p-4 z-50 flex items-center gap-2 bg-white w-full border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-gray-300 transition"
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
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="petImage" />
            <label htmlFor="petImage" className="block w-full text-center px-4 py-2 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition cursor-pointer">
              Choose Photo
            </label>
            {errors.image && <p className="text-red-500 text-xs mt-1 text-center">{errors.image}</p>}
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            <InputField label="Pet Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} required placeholder="Enter pet name" />
            <ButtonGroup 
              name="species" 
              required 
              options={[{value: 'dog', label: 'Dog'}, {value: 'cat', label: 'Cat'}]}
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />            
            <InputField label="Breed" name="breed" value={formData.breed} onChange={handleChange} error={errors.breed} required placeholder="Enter breed" />
            <InputField label="Color" name="color" value={formData.color} onChange={handleChange} placeholder="e.g., Golden, Black & White" />
            <ButtonGroup 
              name="gender" 
              required 
              options={[{value: 'male', label: 'Male'}, {value: 'female', label: 'Female'}]}
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />            
            <InputField label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Age" name="age" value={formData.age} onChange={handleChange} error={errors.age} required placeholder="e.g., 2y" />
              <InputField label="Weight" name="weight" value={formData.weight} onChange={handleChange} error={errors.weight} required placeholder="e.g., 8kg" />
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Medical Information</h3>
            <TextareaField label="Allergies" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="List any known allergies" />
            <TextareaField label="Current Medications" name="medications" value={formData.medications} onChange={handleChange} placeholder="List current medications" />
          </div>

          <TextareaField label="Additional Notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Any other important information about your pet" />
        </form>

        {/* Fixed Bottom Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-3">
          <button type="button" onClick={handleCancel} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="flex-1 px-4 py-3 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition">
            Add Pet
          </button>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:block min-h-screen bg-background">
        <div className="max-w-4xl mx-auto py-8 px-6">
          <div className="flex items-center gap-4 mb-8">
            <button type="button" onClick={handleCancel} className="flex items-center gap-2 rounded-full">
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
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="petImageDesktop" />
                <label htmlFor="petImageDesktop" className="block w-full max-w-xs mx-auto text-center px-4 py-2 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition cursor-pointer">
                  Choose Photo
                </label>
                {errors.image && <p className="text-red-500 text-xs mt-1 text-center">{errors.image}</p>}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>
                <InputField label="Pet Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} required placeholder="Enter pet name" />
                <ButtonGroup 
                  name="species" 
                  required 
                  options={[{value: 'dog', label: 'Dog'}, {value: 'cat', label: 'Cat'}]}
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />                
                <InputField label="Breed" name="breed" value={formData.breed} onChange={handleChange} error={errors.breed} required placeholder="Enter breed" />
                <InputField label="Color" name="color" value={formData.color} onChange={handleChange} placeholder="e.g., Golden, Black & White" />
                <ButtonGroup 
                  name="gender" 
                  required 
                  options={[{value: 'male', label: 'Male'}, {value: 'female', label: 'Female'}]}
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />                
                <InputField label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Age" name="age" value={formData.age} onChange={handleChange} error={errors.age} required placeholder="e.g., 2y" />
                  <InputField label="Weight" name="weight" value={formData.weight} onChange={handleChange} error={errors.weight} required placeholder="e.g., 8kg" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Medical Information</h3>
                <TextareaField label="Allergies" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="List any known allergies" />
                <TextareaField label="Current Medications" name="medications" value={formData.medications} onChange={handleChange} placeholder="List current medications" />
              </div>

              <TextareaField label="Additional Notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Any other important information about your pet" />

              <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
                <button type="button" onClick={handleCancel} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition">
                  Add Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}