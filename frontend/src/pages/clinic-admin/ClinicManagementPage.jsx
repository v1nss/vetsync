import React, { useState, useEffect } from "react";
import { FaEdit, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaImage, FaSave, FaTimes, FaPlus, FaCamera, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { fetchMyClinic, updateClinic } from "../../global/api/clinicAdmin";
import DriveImage from "../../components/DriveImage";

export default function ClinicManagementPage() {
  const { token } = useAuth();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClinic, setEditedClinic] = useState(null);
  const [newService, setNewService] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentDocImageIndex, setCurrentDocImageIndex] = useState(0);

  useEffect(() => {
    fetchMyClinic()
      .then(data => { 
        setClinic(data); 
        setEditedClinic(data); 
        // Reset image indices when data loads
        setCurrentImageIndex(0);
        setCurrentDocImageIndex(0);
      })
      .catch(err => console.error("Failed to fetch clinic data:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = () => { setIsEditing(true); setEditedClinic({ ...clinic }); };
  const handleCancel = () => { setIsEditing(false); setEditedClinic({ ...clinic }); };
  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedClinicData = await updateClinic(clinic.clinic_id, editedClinic);
      setClinic(updatedClinicData);
      setEditedClinic(updatedClinicData);
      setIsEditing(false);
      alert("Clinic updated successfully!");
    } catch (err) { 
      console.error("Failed to update clinic:", err);
      alert("Failed to update clinic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => setEditedClinic(prev => ({ ...prev, [field]: value }));
  const handleOperatingHoursChange = (day, value) => setEditedClinic(prev => ({ ...prev, operating_hours: { ...prev.operating_hours, [day]: value } }));
  const addService = () => { if (newService.trim()) { setEditedClinic(prev => ({ ...prev, services: [...(prev.services || []), newService.trim()] })); setNewService(""); } };
  const removeService = (index) => setEditedClinic(prev => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }));
  
  // Handle clinic image upload
  const handleClinicImageUpload = (e, imageType) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
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
    }
  };

  // Remove clinic image
  const removeClinicImage = (imageType, index) => {
    setEditedClinic(prev => ({
      ...prev,
      [imageType]: (prev[imageType] || []).filter((_, i) => i !== index)
    }));
    
    // Adjust current index if needed
    if (imageType === 'clinic_images' && currentImageIndex >= ((editedClinic?.clinic_images?.length || 1) - 1)) {
      setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
    }
    if (imageType === 'document_images' && currentDocImageIndex >= ((editedClinic?.document_images?.length || 1) - 1)) {
      setCurrentDocImageIndex(Math.max(0, currentDocImageIndex - 1));
    }
  };

  const nextImage = () => {
    if (currentData?.clinic_images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % currentData.clinic_images.length);
    }
  };
  
  const prevImage = () => {
    if (currentData?.clinic_images?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + currentData.clinic_images.length) % currentData.clinic_images.length);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading clinic information...</p>
      </div>
    </div>
  );

  const currentData = isEditing ? editedClinic : clinic;
  
  const InputField = ({ label, icon: Icon, field, type = "text", rows }) => {
    const isEmpty = !currentData?.[field] || currentData[field].trim() === '';
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {Icon && <Icon className="inline mr-2 text-primary" />}{label}
        </label>
        {isEditing ? (
          rows ? (
            <textarea value={currentData?.[field] || ''} onChange={(e) => handleInputChange(field, e.target.value)} rows={rows} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent" placeholder={`Enter ${label.toLowerCase()}...`} />
          ) : (
            <input type={type} value={currentData?.[field] || ''} onChange={(e) => handleInputChange(field, e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent" placeholder={`Enter ${label.toLowerCase()}...`} />
          )
        ) : (
          <p className={isEmpty ? "text-gray-400 italic" : "text-gray-900"}>
            {isEmpty ? `No ${label.toLowerCase()} provided` : currentData[field]}
          </p>
        )}
      </div>
    );
  };

  const OperatingHourRow = ({ day, field, placeholder }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <span className="font-medium text-gray-700">{day}</span>
      {isEditing ? (
        <input type="text" value={currentData?.operating_hours?.[field]} onChange={(e) => handleOperatingHoursChange(field, e.target.value)} placeholder={placeholder} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
      ) : (
        <span className="text-gray-900">{currentData?.operating_hours?.[field]}</span>
      )}
    </div>
  );

  return (
    <main>
      <div className="min-h-screen pb-10">
        <div className="mb-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Clinic Management</h1>
                <p className="text-gray-600 mt-1">Manage your clinic profile and information</p>
              </div>
              {!isEditing ? (
                <button onClick={handleEdit} className="mt-2 sm:mt-0 flex w-fit items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition">
                  <FaEdit /> Edit Clinic
                </button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={handleCancel} className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">
                    <FaTimes /> Cancel
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
                    <FaSave /> Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              {/* Clinic Photos Carousel */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FaImage className="text-primary" />
                    Clinic Photos
                  </h3>
                </div>
                <div className="relative aspect-square">
                  {currentData?.clinic_images && currentData.clinic_images.length > 0 ? (
                    <>
                      <DriveImage 
                        image={currentData.clinic_images[currentImageIndex]} 
                        alt={currentData.clinic_images[currentImageIndex]?.name || 'Clinic image'} 
                        className="w-full h-full object-cover" 
                      />
                      {currentData.clinic_images.length > 1 && (
                        <>
                          <button 
                            onClick={prevImage} 
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                          >
                            <FaChevronLeft />
                          </button>
                          <button 
                            onClick={nextImage} 
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                          >
                            <FaChevronRight />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {currentData.clinic_images.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
                      <FaImage className="text-gray-300 text-6xl mb-2" />
                      <p className="text-gray-400 text-sm">No clinic photos</p>
                      {isEditing && (
                        <label className="mt-4 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/80 transition flex items-center gap-2">
                          <FaCamera />
                          Add Photos
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleClinicImageUpload(e, 'clinic_images')}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
                {(currentData?.clinic_images && currentData.clinic_images.length > 0) || isEditing ? (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {(currentData?.clinic_images || []).map((image, idx) => (
                        <div key={image?.id || idx} className="relative shrink-0">
                          <DriveImage 
                            image={image} 
                            alt={image?.name || `Image ${idx + 1}`}
                            className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition ${
                              idx === currentImageIndex ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
                            }`}
                          />
                          <div 
                            onClick={() => setCurrentImageIndex(idx)}
                            className="absolute inset-0 cursor-pointer"
                          />
                          {isEditing && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeClinicImage('clinic_images', idx);
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow-md z-10"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          )}
                        </div>
                      ))}
                      {isEditing && (currentData?.clinic_images?.length > 0 || editedClinic?.clinic_images?.length > 0) && (
                        <label className="shrink-0 w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition">
                          <FaPlus className="text-gray-400" />
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleClinicImageUpload(e, 'clinic_images')}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Document Images Carousel */}
              {((currentData?.document_images && currentData.document_images.length > 0) || isEditing) && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-blue-50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <FaImage className="text-blue-500" />
                      Documents
                    </h3>
                  </div>
                  <div className="relative aspect-square">
                    {currentData?.document_images && currentData.document_images.length > 0 ? (
                      <>
                        <DriveImage 
                          image={currentData.document_images[currentDocImageIndex]} 
                          alt={currentData.document_images[currentDocImageIndex]?.name || 'Document image'} 
                          className="w-full h-full object-cover" 
                        />
                        {currentData.document_images.length > 1 && (
                          <>
                            <button 
                              onClick={() => setCurrentDocImageIndex((prev) => 
                                (prev - 1 + currentData.document_images.length) % currentData.document_images.length
                              )} 
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                            >
                              <FaChevronLeft />
                            </button>
                            <button 
                              onClick={() => setCurrentDocImageIndex((prev) => 
                                (prev + 1) % currentData.document_images.length
                              )} 
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                            >
                              <FaChevronRight />
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                              {currentDocImageIndex + 1} / {currentData.document_images.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-blue-50 flex flex-col items-center justify-center">
                        <FaImage className="text-blue-200 text-6xl mb-2" />
                        <p className="text-blue-300 text-sm">No documents uploaded</p>
                        {isEditing && (
                          <label className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition flex items-center gap-2">
                            <FaCamera />
                            Add Documents
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleClinicImageUpload(e, 'document_images')}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                  {(currentData?.document_images && currentData.document_images.length > 0) || isEditing ? (
                    <div className="p-4 bg-blue-50 border-t border-blue-200">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {(currentData?.document_images || []).map((image, idx) => (
                          <div key={image?.id || idx} className="relative shrink-0">
                            <DriveImage 
                              image={image} 
                              alt={image?.name || `Document ${idx + 1}`}
                              className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition ${
                                idx === currentDocImageIndex ? 'ring-2 ring-blue-500' : 'opacity-60 hover:opacity-100'
                              }`}
                            />
                            <div 
                              onClick={() => setCurrentDocImageIndex(idx)}
                              className="absolute inset-0 cursor-pointer"
                            />
                            {isEditing && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeClinicImage('document_images', idx);
                                }}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow-md z-10"
                              >
                                <FaTimes className="text-xs" />
                              </button>
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <label className="shrink-0 w-16 h-16 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition">
                            <FaPlus className="text-blue-400" />
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleClinicImageUpload(e, 'document_images')}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Clinic Status */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Clinic Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      currentData?.status === "approved" 
                        ? "bg-green-100 text-green-700" 
                        : currentData?.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {currentData?.status?.charAt(0).toUpperCase() + currentData?.status?.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Images</span>
                    <span className="text-sm font-medium text-gray-900">
                      {(currentData?.clinic_images?.length || 0) + (currentData?.document_images?.length || 0)} total
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
                <div className="space-y-5">
                  <InputField label="Clinic Name" field="name" />
                  <InputField label="Address" icon={FaMapMarkerAlt} field="address" rows={2} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Contact Number" icon={FaPhone} field="contact_number" />
                    <InputField label="Email Address" icon={FaEnvelope} field="email" type="email" />
                  </div>
                  <InputField label="Description" field="description" rows={4} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  <FaClock className="inline mr-2 text-primary" />Operating Hours
                </h2>
                <div className="space-y-4">
                  <OperatingHourRow day="Monday - Friday" field="weekdays" placeholder="9:00 AM - 6:00 PM" />
                  <OperatingHourRow day="Saturday" field="saturday" placeholder="9:00 AM - 4:00 PM" />
                  <OperatingHourRow day="Sunday" field="sunday" placeholder="Closed" />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Services Offered</h2>
                  {isEditing && <span className="text-sm text-gray-600">{currentData?.services?.length || 0} services</span>}
                </div>
                <div className="space-y-4">
                  {currentData?.services && currentData.services.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {currentData.services.map((service, idx) => (
                        <div key={idx} className="group relative px-4 py-2 bg-blue-50 text-primary/80 rounded-xl border border-blue-200 font-medium">
                          {service}
                          {isEditing && (
                            <button onClick={() => removeService(idx)} className="ml-2 text-red-500 hover:text-red-700">
                              <FaTimes className="text-sm" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic text-center py-4">No services added yet</p>
                  )}
                  {isEditing && (
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <input type="text" value={newService} onChange={(e) => setNewService(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addService()} placeholder="Add new service..." className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent" />
                      <button onClick={addService} className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition flex items-center gap-2">
                        <FaPlus /> Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}