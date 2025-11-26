import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateClinic } from "../../global/api/clinicAdmin";
import { useAuth } from "../../context/AuthContext";
import { FaChevronLeft, FaChevronRight, FaCamera, FaTimes } from "react-icons/fa";
import { fetchMyClinic } from "../../global/api/clinicAdmin";
import ClinicAdminNavbar from "../../components/ClinicAdminNavbar";
import DriveImage from "../../components/DriveImage";

const Input = ({ label, name, type = "text", placeholder, required, value, onChange, error }) => (
  <div>
    <label className={`block text-sm text-gray-700 mb-2 ${required ? 'label-required' : ''}`}>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange}
      className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl" placeholder={placeholder} />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default function EditClinicPage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const location = useLocation();
  const existingClinic = location.state?.clinic;
  const isResubmission = location.state?.isResubmission;

  useEffect(() => {
    const loadClinicData = async () => {
      try {
        let clinic = existingClinic;
        if (!clinic) {
          clinic = await fetchMyClinic();
        }

        if (clinic.status == "pending") {
          navigate("/clinic-admin/pending");
          return;
        }

        if (!clinic) {
          navigate("/clinic-admin/rejected");
          return;
        }

        // Set clinic data similar to ClinicManagementPage
        setEditedClinic({
          ...clinic,
          clinic_images: clinic?.clinic_images || [],
          document_images: clinic?.document_images || [],
        });
        
        setFormData({
          name: clinic?.name || "",
          address: clinic?.address || "",
          city: clinic?.city || "",
          state: clinic?.state || "",
          zipCode: clinic?.zipCode || "",
          contact_number: clinic?.contact_number || "",
          email: clinic?.email || "",
          hours: clinic?.hours || "",
          description: clinic?.description || "",
          status: "pending",
        });

      } catch (error) {
        console.error("Failed to load clinic data:", error);
        navigate("/clinic-admin/rejected");
      } finally {
        setLoading(false);
      }
    };

    loadClinicData();
  }, [existingClinic, navigate]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: existingClinic?.name || "",
    address: existingClinic?.address || "",
    city: existingClinic?.city || "",
    state: existingClinic?.state || "",
    zipCode: existingClinic?.zipCode || "",
    contact_number: existingClinic?.contact_number || "",
    email: existingClinic?.email || "",
    hours: existingClinic?.hours || "",
    description: existingClinic?.description || "",
    status: "pending",
  });

  const [editedClinic, setEditedClinic] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle clinic image upload - similar to ClinicManagementPage
  const handleClinicImageUpload = (e, imageType) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Check total images limit for clinic_images
      if (imageType === 'clinic_images') {
        const currentTotal = (editedClinic?.clinic_images || []).length;
        if (currentTotal + files.length > 10) {
          setErrors((prev) => ({
            ...prev,
            pictures: `You can only upload ${10 - currentTotal} more image(s). Maximum is 10 images.`,
          }));
          return;
        }
      }

      // Validate file sizes
      const invalidFiles = files.filter(file => file.size > 5000000);
      if (invalidFiles.length > 0) {
        setErrors((prev) => ({
          ...prev,
          [imageType === 'clinic_images' ? 'pictures' : 'license']: "File size must be less than 5MB",
        }));
        return;
      }

      const readers = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({
            id: `temp_${Date.now()}_${Math.random()}`,
            name: file.name,
            link: reader.result,
            isNew: true,
            file: file // Store file for upload
          });
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then(results => {
        setEditedClinic(prev => ({
          ...prev,
          [imageType]: [...(prev[imageType] || []), ...results]
        }));
      });
      
      // Clear errors
      if (errors[imageType === 'clinic_images' ? 'pictures' : 'license']) {
        setErrors((prev) => ({ ...prev, [imageType === 'clinic_images' ? 'pictures' : 'license']: "" }));
      }
    }
  };

  // Remove clinic image - similar to ClinicManagementPage
  const removeClinicImage = (imageType, index) => {
    setEditedClinic(prev => ({
      ...prev,
      [imageType]: (prev[imageType] || []).filter((_, i) => i !== index)
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
    setSubmitStatus("loading");

    try {
      if (!editedClinic || !editedClinic.clinic_id) {
        throw new Error("Clinic data not loaded");
      }

      // Prepare clinic data similar to ClinicManagementPage - merge formData with editedClinic
      const clinicDataToUpdate = {
        ...editedClinic,
        ...formData,
        clinic_images: editedClinic.clinic_images || [],
        document_images: editedClinic.document_images || [],
      };
      
      await updateClinic(editedClinic.clinic_id, clinicDataToUpdate);
      
      setSubmitStatus("submitted");
      
      setTimeout(() => {
        navigate("/clinic-admin/clinic", { replace: true });
      }, 2000);

    } catch (err) {
      console.error("Update error:", err);
      setErrors({ submit: err.response?.data?.message || err.message || "Failed to update clinic. Please try again." });
      setSubmitStatus(null);
    }
  };

  const totalImages = (editedClinic?.clinic_images || []).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ClinicAdminNavbar />
      
      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="bg-white sm:p-8 rounded-2xl sm:shadow-lg w-full max-w-xl">
          <img src="/vetsync-logo-wname.png" alt="VetSync Logo" className="h-12 mx-auto mb-6" />
          
          {isResubmission && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">
                <strong>Resubmission:</strong> Please review and update your clinic information based on the feedback provided.
              </p>
            </div>
          )}
          
          <h2 className="text-2xl font-semibold text-center">Edit Clinic Information</h2>
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

          {errors.submit && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

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
                  
                  {/* All Images - Existing and New Combined */}
                  {(editedClinic?.clinic_images && editedClinic.clinic_images.length > 0) && (
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {editedClinic.clinic_images.map((image, idx) => (
                        <div key={image?.id || idx} className="relative group border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary transition-all aspect-square bg-gray-100">
                          <DriveImage 
                            image={image} 
                            alt={image?.name || `Image ${idx + 1}`}
                            className="w-full h-full object-cover relative z-0"
                          />
                          {image.isNew && (
                            <div className="absolute top-1 left-1 z-20">
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">New</span>
                            </div>
                          )}
                          <button 
                            type="button" 
                            onClick={() => removeClinicImage('clinic_images', idx)}
                            className="absolute top-1 right-1 z-30 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all shadow-md"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {totalImages < 10 && (
                    <div className="border border-gray-300 rounded-2xl p-6 text-center">
                      <input type="file" accept="image/*" multiple onChange={(e) => handleClinicImageUpload(e, 'clinic_images')} className="hidden" id="pictures" />
                      <label htmlFor="pictures" className="cursor-pointer">
                        <FaCamera className="text-3xl text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          {totalImages === 0 ? "Upload clinic photos" : `Add more (${10 - totalImages} left)`}
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
                  <label className="block text-sm text-gray-700 mb-2">License/Permit Documents</label>
                  
                  {/* All License Images - Existing and New Combined */}
                  {(editedClinic?.document_images && editedClinic.document_images.length > 0) && (
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {editedClinic.document_images.map((image, idx) => (
                        <div key={image?.id || idx} className="relative group border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary transition-all aspect-square bg-gray-100">
                          <DriveImage 
                            image={image} 
                            alt={image?.name || `Document ${idx + 1}`}
                            className="w-full h-full object-cover relative z-0"
                          />
                          {image.isNew && (
                            <div className="absolute top-1 left-1 z-20">
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">New</span>
                            </div>
                          )}
                          <button 
                            type="button" 
                            onClick={() => removeClinicImage('document_images', idx)}
                            className="absolute top-1 right-1 z-30 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all shadow-md"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="border border-gray-300 rounded-2xl p-6 text-center">
                    <input type="file" accept="image/*,application/pdf" multiple onChange={(e) => handleClinicImageUpload(e, 'document_images')} className="hidden" id="license" />
                    <label htmlFor="license" className="cursor-pointer">
                      <FaCamera className="text-3xl text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload license/permit documents</p>
                      <span className="inline-block px-4 py-2 bg-primary text-white text-sm rounded-2xl hover:bg-[#FEA08E] transition">Choose Files</span>
                    </label>
                  </div>
                  {errors.license && <p className="text-red-500 text-xs mt-1">{errors.license}</p>}
                </div>

                {submitStatus === "submitted" && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-2xl text-sm">
                    <p className="font-semibold mb-1">✓ Clinic Updated Successfully!</p>
                    <p>Your changes have been saved. Redirecting to dashboard...</p>
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
                <button 
                  type="submit" 
                  disabled={submitStatus === "loading" || submitStatus === "submitted"}
                  className="flex-1 bg-primary text-white py-3 rounded-2xl hover:bg-[#FEA08E] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitStatus === "loading" ? "Updating..." : submitStatus === "submitted" ? "Updated!" : "Update & Resubmit"}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}