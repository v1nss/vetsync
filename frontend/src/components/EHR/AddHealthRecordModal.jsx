import React, { useState } from "react";
import { FiX, FiPlus, FiTrash2, FiUpload } from "react-icons/fi";
import { RiMicroscopeLine, RiSyringeLine, RiBugLine } from "react-icons/ri";
import { FaPrescription } from "react-icons/fa";
import NotificationModal from "../NotificationModal";

export default function AddHealthRecordModal({ patient, appointment, onClose, onSave }) {
  console.log("AddHealthRecordModal appointment:", appointment);
  const [formData, setFormData] = useState({
    appointmentDate: appointment?.date || new Date().toISOString().split('T')[0],
    veterinarian: appointment?.assigned_vet || "",
    reason: appointment?.service || "",
    attachedFile: null,
    noRecordsRequired: false,
    documents: {
      labResults: [],
      vaccineRecords: [],
      prescriptions: [],
      deworming: []
    }
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Add a new document to a specific type
  const addDocument = (type) => {
    const newDoc = {
      id: `${type}_${Date.now()}`,
      name: "",
      description: "",
      duration: type === 'vaccineRecords' ? "" : undefined,
      durationUnit: type === 'vaccineRecords' ? "months" : undefined
    };

    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: [...(prev.documents[type] || []), newDoc]
      }
    }));
  };

  // Remove a document
  const removeDocument = (type, docId) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: prev.documents[type].filter(doc => doc.id !== docId)
      }
    }));
  };

  // Update document field
  const updateDocument = (type, docId, field, value) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: prev.documents[type].map(doc =>
          doc.id === docId ? { ...doc, [field]: value } : doc
        )
      }
    }));
  };

  // Handle main file upload
  const handleFileUpload = (file) => {
    if (file) {
      console.log("Uploading file:", file.name);
      const fileUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, attachedFile: { name: file.name, url: fileUrl, file: file } }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Appointment date is required";
    }
    if (!formData.veterinarian.trim()) {
      newErrors.veterinarian = "Veterinarian name is required";
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason for visit is required";
    }

    if (!formData.noRecordsRequired) {
      const hasDocuments = 
        formData.documents.labResults.length > 0 ||
        formData.documents.vaccineRecords.length > 0 ||
        formData.documents.prescriptions.length > 0 ||
        formData.documents.deworming.length > 0;

      if (!hasDocuments) {
        newErrors.documents = "Please add at least one medical record or check 'No medical records required'";
      }

      ['labResults', 'vaccineRecords', 'prescriptions', 'deworming'].forEach(type => {
        formData.documents[type].forEach((doc, index) => {
          if (!doc.name.trim()) {
            newErrors[`${type}_${index}_name`] = "Name is required";
          }
          if (!doc.description.trim()) {
            newErrors[`${type}_${index}_description`] = "Description is required";
          }
          
          if (type === 'vaccineRecords') {
            if (!doc.duration || doc.duration <= 0) {
              newErrors[`${type}_${index}_duration`] = "Duration is required";
            }
          }
        });
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields.'
      });
      return;
    }

    const healthRecord = {
      id: `hr_${Date.now()}`,
      petId: patient.id,
      appointmentId: appointment?.id,
      vetId: appointment?.vet_id,
      appointmentDate: formData.appointmentDate,
      veterinarian: formData.veterinarian,
      reason: formData.reason,
      attachedFile: formData.attachedFile,
      noRecordsRequired: formData.noRecordsRequired,
      documents: formData.noRecordsRequired ? {
        labResults: [],
        vaccineRecords: [],
        prescriptions: [],
        deworming: []
      } : {
        labResults: formData.documents.labResults.length > 0 ? formData.documents.labResults : [],
        vaccineRecords: formData.documents.vaccineRecords.length > 0 ? formData.documents.vaccineRecords : [],
        prescriptions: formData.documents.prescriptions.length > 0 ? formData.documents.prescriptions : [],
        deworming: formData.documents.deworming.length > 0 ? formData.documents.deworming : []
      },
      createdAt: new Date().toISOString()
    };

    setNotification({
      isOpen: true,
      type: 'success',
      title: 'Success!',
      message: 'Health record has been saved successfully.'
    });

    onSave(healthRecord);
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, isOpen: false });
    if (notification.type === 'success') {
      onClose();
    }
  };

  const documentTypes = [
    { key: 'labResults', label: 'Lab Results', icon: RiMicroscopeLine, color: 'blue' },
    { key: 'vaccineRecords', label: 'Vaccine Records', icon: RiSyringeLine, color: 'green' },
    { key: 'prescriptions', label: 'Prescriptions', icon: FaPrescription, color: 'purple' },
    { key: 'deworming', label: 'Deworming', icon: RiBugLine, color: 'orange' }
  ];

  const renderDocumentForm = (type, doc, index) => {
    const isVaccine = type === 'vaccineRecords';
    
    return (
      <div key={doc.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            {documentTypes.find(t => t.key === type).label} #{index + 1}
          </span>
          <button
            type="button"
            onClick={() => removeDocument(type, doc.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>

        <div className={`grid grid-cols-1 ${isVaccine ? 'md:grid-cols-3' : ''} gap-3`}>
          <div className={isVaccine ? 'md:col-span-3' : ''}>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
            <input
              type="text"
              value={doc.name}
              onChange={(e) => updateDocument(type, doc.id, 'name', e.target.value)}
              placeholder={`e.g., ${type === 'labResults' ? 'Blood Test Results' : type === 'vaccineRecords' ? 'Rabies Vaccination' : type === 'prescriptions' ? 'Amoxicillin Prescription' : 'Deworming Treatment'}`}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors[`${type}_${index}_name`] ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors[`${type}_${index}_name`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`${type}_${index}_name`]}</p>
            )}
          </div>

          <div className={isVaccine ? 'md:col-span-3' : ''}>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
            <textarea
              value={doc.description}
              onChange={(e) => updateDocument(type, doc.id, 'description', e.target.value)}
              placeholder="Enter detailed information..."
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors[`${type}_${index}_description`] ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors[`${type}_${index}_description`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`${type}_${index}_description`]}</p>
            )}
          </div>

          {isVaccine && (
            <>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Duration *</label>
                <input
                  type="number"
                  min="1"
                  value={doc.duration}
                  onChange={(e) => updateDocument(type, doc.id, 'duration', e.target.value)}
                  placeholder="1"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors[`${type}_${index}_duration`] ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors[`${type}_${index}_duration`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`${type}_${index}_duration`]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                <select
                  value={doc.durationUnit}
                  onChange={(e) => updateDocument(type, doc.id, 'durationUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Health Record</h2>
              <p className="text-sm text-gray-600 mt-1">
                {patient.name} • {patient.species} • {patient.breed}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                Appointment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.appointmentDate ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.appointmentDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.appointmentDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Veterinarian *
                  </label>
                  <input
                    type="text"
                    value={formData.veterinarian}
                    onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                    placeholder="Dr. John Smith"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.veterinarian ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.veterinarian && (
                    <p className="text-red-500 text-xs mt-1">{errors.veterinarian}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit (Service) *
                  </label>
                  <input
                    type="text"
                    value={formData.reason}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">This field is auto-filled from the appointment service</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach File (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary cursor-pointer transition">
                      <FiUpload className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formData.attachedFile ? formData.attachedFile.name : 'Choose file (PDF, Images, Documents)'}
                      </span>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e.target.files[0])}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </label>
                    {formData.attachedFile && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, attachedFile: null }))}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Records Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Medical Records
                </h3>
                {errors.documents && (
                  <p className="text-red-500 text-xs">{errors.documents}</p>
                )}
              </div>

              {/* No Records Required Checkbox */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.noRecordsRequired}
                    onChange={(e) => setFormData({ ...formData, noRecordsRequired: e.target.checked })}
                    className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    No medical records required for this visit
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-2 ml-8">
                  Check this box if the service does not require medical documentation (e.g., Grooming, Boarding)
                </p>
              </div>

              {/* Only show medical records section if checkbox is NOT checked */}
              {!formData.noRecordsRequired && (
                <>
                  {/* Add Document Buttons */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {documentTypes.map(({ key, label, icon: Icon, color }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => addDocument(key)}
                        className={`flex items-center gap-2 px-4 py-2 bg-${color}-50 text-${color}-700 border border-${color}-200 rounded-lg hover:bg-${color}-100 transition`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">Add {label}</span>
                        <FiPlus className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>

                  {/* Document Forms */}
                  <div className="space-y-6">
                    {documentTypes.map(({ key, label, icon: Icon, color }) => (
                      formData.documents[key].length > 0 && (
                        <div key={key}>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Icon className={`w-4 h-4 text-${color}-600`} />
                            {label} ({formData.documents[key].length})
                          </h4>
                          <div className="space-y-4">
                            {formData.documents[key].map((doc, index) => renderDocumentForm(key, doc, index))}
                          </div>
                        </div>
                      )
                    ))}

                    {/* Empty State */}
                    {formData.documents.labResults.length === 0 &&
                     formData.documents.vaccineRecords.length === 0 &&
                     formData.documents.prescriptions.length === 0 &&
                     formData.documents.deworming.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-gray-500 text-sm">
                          No medical records added yet. Click the buttons above to add medical records.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
              >
                Save Health Record
              </button>
            </div>
          </form>
        </div>
      </div>

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={handleNotificationClose}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </>
  );
}