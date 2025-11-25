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
    pictures: [],
    license: null,
  });

  const [previews, setPreviews] = useState({
    pictures: [],
    license: null,
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleMultipleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const remaining = 10 - files.pictures.length;
    
    if (selectedFiles.length > remaining) {
      setErrors((prev) => ({
        ...prev,
        pictures: `You can only upload ${remaining} more image(s). Maximum is 10 images.`,
      }));
      return;
    }

    selectedFiles.forEach((file) => {
      if (file.size > 5000000) {
        setErrors((prev) => ({
          ...prev,
          pictures: "File size must be less than 5MB",
        }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          pictures: [...prev.pictures, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });

    setFiles((prev) => ({
      ...prev,
      pictures: [...prev.pictures, ...selectedFiles],
    }));
    
    if (errors.pictures) setErrors((prev) => ({ ...prev, pictures: "" }));
  };

  const removePicture = (index) => {
    setFiles((prev) => ({
      ...prev,
      pictures: prev.pictures.filter((_, i) => i !== index),
    }));
    setPreviews((prev) => ({
      ...prev,
      pictures: prev.pictures.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setErrors((prev) => ({
          ...prev,
          [type]: "File size must be less than 5MB",
        }));
        return;
      }
      setFiles((prev) => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () =>
        setPreviews((prev) => ({ ...prev, [type]: reader.result }));
      reader.readAsDataURL(file);
      if (errors[type]) setErrors((prev) => ({ ...prev, [type]: "" }));
    }
  };

  const removeFile = (type) => {
    setFiles((prev) => ({ ...prev, [type]: null }));
    setPreviews((prev) => ({ ...prev, [type]: null }));
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
      // register user
      const registerResponse = await registerUser(updatedUserData);

      // automatically log in the user
      const data = await loginUser(
        updatedUserData.email,
        updatedUserData.password
      );
      // login returns user object through context
      // register the clinic (only after user is registered and logged in)
      const clinicResponse = await registerClinic(formData);

      setSubmitStatus("submitted");
    } catch (err) {
      console.error("Error during registration process:", err.message);
      setSubmitStatus(null);
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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Documents & Photos</h3>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Clinic Photos (Max 10)</label>
                {previews.pictures.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {previews.pictures.map((p, i) => (
                      <div key={i} className="relative group border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary transition-all">
                        <img src={p} alt={`Clinic ${i + 1}`} className="w-full aspect-square object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                          <button type="button" onClick={() => removePicture(i)}
                            className="opacity-0 group-hover:opacity-100 bg-white text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all transform scale-90 group-hover:scale-100">
                            <FaTimes className="text-sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {previews.pictures.length < 10 && (
                  <div className="border border-gray-300 rounded-2xl p-6 text-center">
                    <input type="file" accept="image/*" multiple onChange={handleMultipleFileChange} className="hidden" id="pictures" />
                    <label htmlFor="pictures" className="cursor-pointer">
                      <FaCamera className="text-3xl text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        {previews.pictures.length === 0 ? "Upload clinic photos" : `Add more (${10 - previews.pictures.length} left)`}
                      </p>
                      <span className="inline-block px-4 py-2 bg-primary text-white text-sm rounded-2xl hover:bg-[#FEA08E] transition">
                        Choose Files
                      </span>
                    </label>
                  </div>
                )}
                {errors.pictures && <p className="text-red-500 text-xs mt-1">{errors.pictures}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2">License/Permit (Optional)</label>
                {previews.license ? (
                  <div className="border border-gray-300 rounded-2xl p-4">
                    <img src={previews.license} alt="License" className="w-full h-48 object-cover rounded-2xl mb-3" />
                    <button type="button" onClick={() => removeFile("license")}
                      className="w-full py-2 text-sm text-red-600 border border-red-600 rounded-2xl hover:bg-red-50">Remove</button>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-2xl p-6 text-center">
                    <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "license")} className="hidden" id="license" />
                    <label htmlFor="license" className="cursor-pointer">
                      <FaCamera className="text-3xl text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload license/permit</p>
                      <span className="inline-block px-4 py-2 bg-primary text-white text-sm rounded-2xl hover:bg-[#FEA08E] transition">Choose File</span>
                    </label>
                  </div>
                )}
                {errors.license && <p className="text-red-500 text-xs mt-1">{errors.license}</p>}
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