import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../../global/api/user";
import { loginUser } from "../../global/api/auth";
import { useAuth } from "../../context/AuthContext";
import { registerClinic } from "../../global/api/clinic";
import { FaChevronLeft, FaChevronRight, FaCamera, FaTimes } from "react-icons/fa";

const Input = ({ label, name, type = "text", placeholder, required, value, onChange, error }) => (
  <div>
    <label className={`block text-sm text-gray-700 mb-2 ${required ? 'label-required' : ''}`}>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange}
      className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl" placeholder={placeholder} />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default function RegisterClinicPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const receivedUserData = location.state;

  if (!receivedUserData) return navigate("/register");

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    contact_number: "",
    email: "",
    hours: "",
    description: "",
  });

  const [files, setFiles] = useState({
    clinicImages: [],
    documentImages: [],
  });

  const [previews, setPreviews] = useState({
    clinicImages: [],
    documentImages: [],
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle multiple image uploads for clinic photos and documents
  const handleMultipleFileChange = (e, imageType) => {
    const selectedFiles = Array.from(e.target.files);
    const currentFiles = files[imageType];
    const maxImages = 10;
    const remaining = maxImages - currentFiles.length;
    
    if (selectedFiles.length > remaining) {
      setErrors((prev) => ({
        ...prev,
        [imageType]: `You can only upload ${remaining} more image(s). Maximum is ${maxImages} images.`,
      }));
      return;
    }

    // Validate file sizes and types
    const validFiles = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    for (const file of selectedFiles) {
      if (file.size > 5000000) {
        setErrors((prev) => ({
          ...prev,
          [imageType]: `File "${file.name}" is too large. Maximum size is 5MB.`,
        }));
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [imageType]: `File "${file.name}" is not a valid image type. Use JPG, PNG, or WEBP.`,
        }));
        return;
      }
      
      validFiles.push(file);
    }

    // Create preview URLs for valid files
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          [imageType]: [...prev[imageType], reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });

    // Update files state
    setFiles((prev) => ({
      ...prev,
      [imageType]: [...prev[imageType], ...validFiles],
    }));
    
    // Clear errors
    if (errors[imageType]) {
      setErrors((prev) => ({ ...prev, [imageType]: "" }));
    }
  };

  // Remove a specific image
  const removeImage = (imageType, index) => {
    setFiles((prev) => ({
      ...prev,
      [imageType]: prev[imageType].filter((_, i) => i !== index),
    }));
    setPreviews((prev) => ({
      ...prev,
      [imageType]: prev[imageType].filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Clinic name is required";
      if (!formData.contact_number.trim()) newErrors.contact_number = "Phone number is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    }
    
    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = "Address is required";
    }
    
    return newErrors;
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Clinic name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.contact_number.trim()) newErrors.contact_number = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    return newErrors;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = validateStep(currentStep);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitStatus("pending");

    const updatedUserData = {
      ...receivedUserData.user, // keep existing user fields
      clinic_name: formData.name, // overwrite clinic_name
    };

    try {
      // Step 1: Register user
      var userData = new FormData();
      userData.append('user', JSON.stringify(updatedUserData));
      if (receivedUserData.profilePicture) {
        userData.append('file', receivedUserData.profilePicture);
      }
      const registerResponse = await registerUser(userData);

      // Step 2: Automatically log in the user
      await login(receivedUserData.user.email, receivedUserData.user.password);
      navigate("/clinic-admin/pending");
      // Step 3: Register the clinic with images
      const clinicFormData = new FormData();
      clinicFormData.append('clinic', JSON.stringify(formData));
      
      // Append clinic images
      files.clinicImages.forEach((file, index) => {
        clinicFormData.append('clinicImages', file);
      });
      
      // Append document images
      files.documentImages.forEach((file, index) => {
        clinicFormData.append('documentImages', file);
      });
      
      const clinicResponse = await registerClinic(clinicFormData);

      setSubmitStatus("submitted");
    } catch (err) {
      console.error("Error during registration process:", err);
      setSubmitStatus(null);
      setErrors({ submit: err.message || "Registration failed. Please try again." });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background py-8 px-4">
      <div className="bg-white sm:p-8 rounded-2xl sm:shadow-lg w-full max-w-xl">
        <img src="/vetsync-logo-wname.png" alt="VetSync Logo" className="h-12 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-center">Register Your Clinic</h2>
        <p className="text-center text-gray-600 mb-6">Step {currentStep} of 3</p>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`h-1 flex-1 rounded ${currentStep >= step ? "bg-primary" : "bg-gray-200"}`} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 text-xs text-gray-600">
            <span className="text-left">Basic Info</span>
            <span className="text-center">Clinic Details</span>
            <span className="text-right">Documents</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <Input label="Clinic Name" name="name" placeholder="Enter clinic name" required 
                value={formData.name} onChange={handleChange} error={errors.name} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Phone Number" name="contact_number" type="tel" placeholder="(+63) 912-345-6789" required 
                  value={formData.contact_number} onChange={handleChange} error={errors.contact_number} />
                <Input label="Email" name="email" type="email" placeholder="clinic@example.com" required 
                  value={formData.email} onChange={handleChange} error={errors.email} />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Clinic Details</h3>
              <Input label="Street Address" name="address" placeholder="Enter street address" required 
                value={formData.address} onChange={handleChange} error={errors.address} />
              <div className="grid grid-cols-3 gap-3">
                <Input label="City" name="city" placeholder="City" 
                  value={formData.city} onChange={handleChange} />
                <Input label="State" name="state" placeholder="State" 
                  value={formData.state} onChange={handleChange} />
                <Input label="ZIP" name="zipCode" placeholder="ZIP" 
                  value={formData.zipCode} onChange={handleChange} />
              </div>
              <Input label="Operating Hours" name="hours" placeholder="e.g., Mon-Fri 9AM-5PM" 
                value={formData.hours} onChange={handleChange} />
              <div>
                <label className="block text-sm text-gray-700 mb-2">Description (Optional)</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4"
                  className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl resize-none"
                  placeholder="Brief description of your clinic..." />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Documents & Photos</h3>
              
              {/* Clinic Photos Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic Photos (Optional - Max 10)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload images of your clinic facility, waiting room, examination rooms, etc.
                </p>
                {previews.clinicImages.length > 0 && (
                  <div className="flex gap-3 mb-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {previews.clinicImages.map((preview, index) => (
                      <div key={index} className="relative shrink-0 w-32 h-32 border-2 border-gray-200 rounded-xl overflow-hidden">
                        <button 
                          type="button" 
                          onClick={() => removeImage('clinicImages', index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all shadow-md z-10"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                        <img src={preview} alt={`Clinic ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded-full">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {previews.clinicImages.length < 10 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-primary transition-all">
                    <input 
                      type="file" 
                      accept="image/jpeg,image/jpg,image/png,image/webp" 
                      multiple 
                      onChange={(e) => handleMultipleFileChange(e, 'clinicImages')} 
                      className="hidden" 
                      id="clinicImages" 
                    />
                    <label htmlFor="clinicImages" className="cursor-pointer">
                      <FaCamera className="text-3xl text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        {previews.clinicImages.length === 0 
                          ? "Upload clinic photos" 
                          : `Add more photos (${10 - previews.clinicImages.length} remaining)`}
                      </p>
                      <span className="inline-block px-4 py-2 bg-primary text-white text-sm rounded-2xl hover:bg-[#FEA08E] transition">
                        Choose Files
                      </span>
                      <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP - Max 5MB each</p>
                    </label>
                  </div>
                )}
                {errors.clinicImages && <p className="text-red-500 text-xs mt-1">{errors.clinicImages}</p>}
              </div>
              
              {/* Document Images Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Documents (Optional - Max 10)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload business licenses, permits, certifications, insurance documents, etc.
                </p>
                {previews.documentImages.length > 0 && (
                  <div className="flex gap-3 mb-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
                    {previews.documentImages.map((preview, index) => (
                      <div key={index} className="relative shrink-0 w-32 h-32 border-2 border-blue-200 rounded-xl overflow-hidden">
                        <button 
                          type="button" 
                          onClick={() => removeImage('documentImages', index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all shadow-md z-10"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                        <img src={preview} alt={`Document ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 right-1 bg-blue-500 bg-opacity-90 text-white text-xs px-2 py-0.5 rounded-full">
                          Doc {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {previews.documentImages.length < 10 && (
                  <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-all">
                    <input 
                      type="file" 
                      accept="image/jpeg,image/jpg,image/png,image/webp" 
                      multiple 
                      onChange={(e) => handleMultipleFileChange(e, 'documentImages')} 
                      className="hidden" 
                      id="documentImages" 
                    />
                    <label htmlFor="documentImages" className="cursor-pointer">
                      <FaCamera className="text-3xl text-blue-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        {previews.documentImages.length === 0 
                          ? "Upload required documents" 
                          : `Add more documents (${10 - previews.documentImages.length} remaining)`}
                      </p>
                      <span className="inline-block px-4 py-2 bg-blue-500 text-white text-sm rounded-2xl hover:bg-blue-600 transition">
                        Choose Files
                      </span>
                      <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP - Max 5MB each</p>
                    </label>
                  </div>
                )}
                {errors.documentImages && <p className="text-red-500 text-xs mt-1">{errors.documentImages}</p>}
              </div>

              {submitStatus === "pending" && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-2xl text-sm">
                  <p className="font-semibold mb-1">✓ Registration Submitted!</p>
                  <p>Your clinic registration is pending approval from the system administrator. You will be notified once your clinic is approved.</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {currentStep > 1 && (
              <button type="button" onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50">
                <FaChevronLeft className="text-sm" />Back
              </button>
            )}
            {currentStep < 3 ? (
              <button type="button" onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-2xl hover:bg-[#FEA08E]">
                Next<FaChevronRight className="text-sm" />
              </button>
            ) : (
              <button type="submit" disabled={submitStatus === "pending"}
                className="flex-1 bg-primary text-white py-3 rounded-2xl hover:bg-[#FEA08E] disabled:opacity-50">
                {submitStatus === "pending" ? "Registration Submitted" : "Register Clinic"}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}